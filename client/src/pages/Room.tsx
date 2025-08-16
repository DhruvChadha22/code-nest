import { useUser } from "@/store/useUser";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "@/components/CodeEditor";
import MediaGrid from "@/components/MediaGrid";
import DrawingBoard from "@/components/DrawingBoard";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocalPeer } from "@/store/useLocalPeer";

const Room = () => {
    const [selected, setSelected] = useState<"editor" | "canvas">("editor");
    const [hasCopied, setHasCopied] = useState<boolean>(false);

    const { roomId } = useParams();
    const { userId, clearUserData } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const { localStream, peer } = useLocalPeer.getState();
        if (!userId || !localStream || !peer) {
            navigate("/join-room");
            return;
        }

        window.addEventListener("beforeunload", clearUserData);
        
        return () => {
            clearUserData();
            window.removeEventListener("beforeunload", clearUserData);
        };
    }, []);

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId || "");
        setHasCopied(true);
        toast.success("Room ID Copied!", {
            unstyled: true,
            classNames: {
                toast: "bg-[#256ddb] flex items-center justify-center font-medium text-gray-300 p-4 rounded-lg",
                icon: "flex items-center size-6 mr-2"
            },
        });

        setTimeout(() => setHasCopied(false), 4000);
    };

    return (
        <div className="w-screen h-screen bg-[#101636] text-white flex flex-col">
            <header className="bg-[#080E28] px-4 py-3 flex items-center justify-between shadow-lg">
                <a href="/">
                    <img
                        src="/logo-with-name.svg"
                        width={140}
                        height={55}
                        alt="logo"    
                    />
                </a>
                <Button
                    size="sm"
                    onClick={copyRoomId}
                    disabled={hasCopied}
                    className="bg-[linear-gradient(#283dbd,#386BE8)] border-2 border-[#0C1838] hover:border-[#2EF2FF] transition-all duration-500 hover:cursor-pointer text-white text-semibold"
                >
                    <Copy className="size-3 sm:size-4 mr-1 stroke-3" />
                    <span className="text-xs sm:text-sm">Copy Room ID</span>
                </Button>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-auto">
                <div className="w-full lg:w-1/6">
                    <MediaGrid roomId={roomId} />
                </div>

                <div className="w-full lg:w-5/6 h-full">
                    <div className="flex flex-row items-center justify-start bg-[#080E28]">
                        <Button 
                            onClick={() => setSelected("editor")}
                            size="lg"
                            className={cn("hover:cursor-pointer rounded-none", selected === "editor" ? "bg-[#101636] hover:bg-[#101636]" : "hover:bg-[#101636]/50")}
                        >
                            <h3 className={cn("h-fit text-lg font-medium text-gray-300", selected !== "editor" && "text-muted-foreground")}>Editor</h3>
                        </Button>
                        <Button 
                            onClick={() => setSelected("canvas")}
                            size="lg"
                            className={cn("hover:cursor-pointer rounded-none", selected === "canvas" ? "bg-[#101636] hover:bg-[#101636]" : "hover:bg-[#101636]/50")}
                        >
                            <h3 className={cn("h-fit text-lg font-medium text-gray-300", selected !== "canvas" && "text-muted-foreground")}>Canvas</h3>
                        </Button>
                    </div>
                    {
                        selected === "editor" 
                        ? 
                            <CodeEditor roomId={roomId} />
                        :
                            <DrawingBoard roomId={roomId} />
                    }
                </div>
            </div>
        </div>
    );
};

export default Room;
