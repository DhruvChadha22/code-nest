import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/store/useSocket";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Button } from "./ui/button";
import { useUser } from "@/store/useUser";
import { cleanupCursorCSS, getRandomCursorColor, injectCursorCSS } from "@/lib/utils";
import { useCursors } from "@/store/useCursors";
import { Textarea } from "./ui/textarea";
import { Loader2, Play } from "lucide-react";
import nightOwl from "monaco-themes/themes/Night Owl.json";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { languageOptions } from "@/constants/languageOptions";

interface CursorPosition {
    lineNumber: number;
    column: number;
};

interface CursorData {
    username: string;
    position: CursorPosition;
};

const CodeEditor = ({ roomId }: { roomId?: string }) => {
    const initialCode = useRef<string>(languageOptions[0].defaultCode);
    const [language, setLanguage] = useState<string>(languageOptions[0].value);
    const [fontSize, setFontSize] = useState<string>("15");
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [isOutputLoading, setIsOutputLoading] = useState<boolean>(false);
    
    const isApplyingRemoteEdits = useRef<boolean>(false);

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof monaco>(null);
    const editorDisposablesRef = useRef<monaco.IDisposable[] | null>(null);

    const { socket } = useSocket();
    const { userId } = useUser();
    const { setCursor, removeCursor, clearAllCursors } = useCursors();

    useEffect(() => {
        socket.on("sync-editor", syncEditor);
        socket.on("update-code", updateCode);
        socket.on("update-language", updateLanguage);
        socket.on("update-input", updateInput);
        socket.on("update-output", updateOutput);
        socket.on("update-cursor", updateCursor);
        socket.on("user-left", removeUser);

        window.addEventListener("beforeunload", cleanupEditor);

        return () => {
            cleanupEditor();
            window.removeEventListener("beforeunload", cleanupEditor);
        };
    }, []);

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        editorRef.current = editor;
        monacoRef.current = monacoInstance;
        
        socket.emit("editor-ready", { roomId, userId });
        
        monacoRef.current.editor.defineTheme("night-owl", nightOwl as monaco.editor.IStandaloneThemeData);
        monacoRef.current.editor.setTheme("night-owl");

        const disposables = [];
        
        const cursorListener = editor.onDidChangeCursorPosition((e: monaco.editor.ICursorPositionChangedEvent) => {
            const { username } = useUser.getState();
            const position = e.position;
            updateCursor({ userId, username, position });
            socket.emit("cursor-change", { roomId, userId, username, position });
        });
        
        const contentListener = editor.onDidChangeModelContent((e: monaco.editor.IModelContentChangedEvent) => {
            if (isApplyingRemoteEdits.current) return;

            const code = editor.getValue();
            const changes = e.changes;
            socket.emit("code-change", { roomId, code, changes });
        });
        
        disposables.push(cursorListener, contentListener);
        editorDisposablesRef.current = disposables;
    };

    const syncEditor = ({ 
        code,
        language,
        cursors,
        input,
        output,
    }: { 
        code: string | null,
        language: string,
        cursors: Record<string, CursorData>;
        input: string;
        output: string;
    }) => {
        setInput(input);
        setOutput(output);
        
        const editor = editorRef.current;
        const model = editor?.getModel();
        
        if (!editor || !model) return;

        updateLanguage({ language });
        isApplyingRemoteEdits.current = true;
        if (code !== null) {
            setEditorCode(code);
        }
        isApplyingRemoteEdits.current = false;

        Object.entries(cursors).forEach(([userId, cursorData]) => {
            const { username, position } = cursorData;
            updateCursor({ userId, username, position });
        });
    };

    const setEditorCode = (code: string) => {
        const editor = editorRef.current;
        const model = editor?.getModel();
        
        if (!editor || !model) return;

        editor.executeEdits(null, [
            {
                range: model.getFullModelRange(),
                text: code,
                forceMoveMarkers: true,
            },
        ]);
    };

    const updateCode = ({ changes }: { changes: monaco.editor.IModelContentChange[] }) => {
        const editor = editorRef.current;
        const monacoInstance = monacoRef.current;

        if (!editor || !monacoInstance) return;
        
        const edits = changes.map(change => ({
            range: new monacoInstance.Range(
                change.range.startLineNumber,
                change.range.startColumn,
                change.range.endLineNumber,
                change.range.endColumn
            ),
            text: change.text,
            forceMoveMarkers: true,
        }));
        
        isApplyingRemoteEdits.current = true;
        editor.executeEdits(null, edits);
        isApplyingRemoteEdits.current = false;
    };

    const updateLanguage = ({ language }: { language: string }) => {
        const lang = languageOptions.find((opt) => opt.value === language);

        if (lang) {
            setLanguage(lang.value);
        }
    };

    const updateInput = ({ input }: { input: string }) => {
        setInput(input);
    };

    const updateOutput = ({ output }: { output: string }) => {
        setOutput(output);
    };

    const updateCursor = ({ userId, username, position }: { userId: string, username: string, position: CursorPosition }) => {
        const editor = editorRef.current;
        const monacoInstance = monacoRef.current;

        if (!editor || !monacoInstance) return;

        const { allCursors } = useCursors.getState();
        
        const color = allCursors[userId]?.color ?? getRandomCursorColor();
        injectCursorCSS(userId, username, color);

        const decorations = [{
            range: new monacoInstance.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
            ),
            options: {
                className: `remote-cursor-${userId}`,
                afterContentClassName: `remote-cursor-label-${userId}`,
            },
        }];

        const previousDecorations = allCursors[userId]?.decorations ?? [];
        const newDecorations = editor.deltaDecorations(previousDecorations, decorations);

        setCursor(userId, newDecorations, position, username, color);
    };

    const handleLanguageChange = (newLanguage: string) => {
        const lang = languageOptions.find((opt) => opt.value === newLanguage);

        if (lang) {
            setLanguage(lang.value);
            socket.emit("language-change", { roomId, language: lang.value });
            setEditorCode(lang.defaultCode);
        }
    };

    const handleInputChange = (newInput: string) => {
        setInput(newInput);
        socket.emit("input-change", { roomId, input: newInput });
    };

    const executeCode = async () => {
        const editor = editorRef.current;
        if (!editor) return;

        setIsOutputLoading(true);
        try {
            const response: any = await axios.post(
                import.meta.env.VITE_PISTON_API_URL,
                {
                    language,
                    version: "*",
                    files: [{ content: editor.getValue() }],
                    stdin: input,
                }
            );

            const newOutput = response?.data?.run?.output;
            setOutput(newOutput);
            socket.emit("output-change", { roomId, output: newOutput });
        } catch (e) {
            console.log(e);
        } finally {
            setIsOutputLoading(false);
        }
    };

    const removeUser = ({ userId }: { userId: string }) => {
        const editor = editorRef.current;
        const { allCursors } = useCursors.getState();

        const decorations = allCursors[userId]?.decorations;
        if (editor && decorations) editor.deltaDecorations(decorations, []);
        cleanupCursorCSS(userId);
        removeCursor(userId);
    };

    const cleanupEditor = () => {
        const editor = editorRef.current;
        const { allCursors } = useCursors.getState();

        Object.entries(allCursors).forEach(([userId, cursorData]) => {
            const decorations = cursorData.decorations;
            if (editor) editor.deltaDecorations(decorations, []);
            cleanupCursorCSS(userId);
        });
        clearAllCursors();

        editorDisposablesRef.current?.forEach((listener: monaco.IDisposable) => listener.dispose());
        editorDisposablesRef.current = [];

        socket.emit("remove-cursor", { roomId, userId });

        socket.off("sync-editor", syncEditor);
        socket.off("update-code", updateCode);
        socket.off("update-language", updateLanguage);
        socket.off("update-input", updateInput);
        socket.off("update-output", updateOutput);
        socket.off("update-cursor", updateCursor);
        socket.off("user-left", removeUser);
    };

    return (
        <div className="flex flex-col lg:flex-row justify-between h-screen lg:h-[calc(100vh-130px)] ml-2 lg:ml-0">
            <div className="flex flex-col gap-2 p-4 lg:pr-0 h-screen lg:h-[calc(100vh-130px)] w-full lg:w-2/3 mb-6 lg:mb-0">
                <div className="flex flex-col sm:flex-row justify-start gap-2 sm:gap-8">
                    <div className="flex items-center gap-3">
                        <span className="text-md text-gray-200">Language:</span>
                        <Select
                            value={language}
                            onValueChange={(value) => handleLanguageChange(value)}
                        >
                            <SelectTrigger className="w-[120px] lg:w-[180px] rounded-md font-normal text-white bg-[#080E28]/50 hover:bg-[#080E28]/70 border-none focus:ring-offset-0 focus:ring-transparent outline-none focus:bg-[#080E28]/80 cursor-pointer transition">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#080E28] border-none text-white font-semibold">
                                <SelectGroup>
                                    <SelectLabel className="text-slate-300">Language</SelectLabel>
                                    {languageOptions.map(({ value, label }) => (
                                        <SelectItem key={value} value={value}>
                                        {label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-md text-gray-200">Font Size:</span>
                        <Select
                            defaultValue="15"
                            value={fontSize}
                            onValueChange={(value) => setFontSize(value)}
                        >
                            <SelectTrigger className="w-[100px] rounded-md font-normal text-white bg-[#080E28]/50 hover:bg-[#080E28]/70 border-none focus:ring-offset-0 focus:ring-transparent outline-none focus:bg-[#080E28]/80 cursor-pointer transition">
                                <SelectValue placeholder="Select font-size" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#080E28] border-none text-white font-semibold h-[200px]">
                                <SelectGroup>
                                    <SelectLabel className="text-slate-300">Font Size</SelectLabel>
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const size = (12 + i).toString();
                                        return (
                                            <SelectItem key={size} value={size}>
                                                {size}px
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="h-screen lg:h-[calc(100vh-200px)]">
                    <Editor
                        height="100%"
                        width="100%"
                        theme="night-owl"
                        language={language}
                        value={initialCode.current}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: Number(fontSize),
                        }}
                        loading={
                            <Loader2 className="size-6 text-slate-300 animate-spin" />
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col lg:mt-4 h-full w-full lg:w-1/3 lg:max-w-1/3">
                <div className="p-4 flex-1 flex flex-col h-full w-full max-w-full gap-4">
                    <div className="flex-1 flex flex-col h-2/5 max-h-2/5 w-full max-w-screen lg:max-w-full">
                        <label className="text-md font-medium text-gray-300 mb-2">Input</label>
                        <Textarea
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Enter input here..."
                            className="flex-1 bg-[#011627] border-[#070D27] text-white placeholder-muted resize-none max-w-full max-h-full"
                        />
                    </div>

                    <div className="flex-1 flex flex-col mt-4 h-2/5 max-h-2/5 max-w-screen lg:max-w-full">
                        <label className="text-md font-medium text-gray-300 mb-2">Output</label>
                        <Textarea
                            value={output}
                            readOnly
                            placeholder="Output will appear here..."
                            className="flex-1 bg-[#011627] border-[#070D27] text-white placeholder-muted resize-none max-w-full max-h-full"
                        />
                    </div>

                    <Button
                        onClick={executeCode}
                        disabled={isOutputLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer"
                    >
                        {isOutputLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Running Code...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Run Code
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
