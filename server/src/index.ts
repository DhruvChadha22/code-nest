import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as UUIDv4 } from "uuid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

interface CursorPosition {
    lineNumber: number;
    column: number;
};

interface CursorData {
    username: string;
    position: CursorPosition;
};

interface CanvasObject {
    id: string;
    [key: string]: unknown;
};

interface Room {
    users: string[];
    editor: {
        code: string | null;
        language: string;
        cursors: Record<string, CursorData>;
        input: string;
        output: string;
    };
    canvas: {
        objects: Record<string, CanvasObject>;
    };
};

const rooms: Map<string, Room> = new Map();

io.on("connection", (socket) => {
    const createRoom = () => {
        const roomId = UUIDv4();
        
        rooms.set(roomId, {
            users: [],
            editor: {
                code: null,
                language: "",
                cursors: {},
                input: "",
                output: "",
            },
            canvas: {
                objects: {},
            },
        });
        
        socket.join(roomId);
        socket.emit("room-created", { roomId });
    };

    const joinRoom = ({ roomId, userId } : { roomId: string, userId: string }) => {
        const room = rooms.get(roomId);

        if (!room) {
            socket.emit("room-not-found");
            return;
        }
        
        room.users.push(userId);

        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.userId = userId;

        socket.emit("room-joined", { roomId });
    };

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);

    const updatePeers = ({ 
        roomId, 
        userId, 
        username, 
        videoEnabled, 
        audioEnabled 
    }: { 
        roomId: string, 
        userId: string, 
        username: string 
        videoEnabled: boolean,
        audioEnabled: boolean,
    }) => {
        socket.to(roomId).emit("peer-joined", { 
            peerId: userId, 
            peerName: username, 
            peerVideoEnabled: videoEnabled, 
            peerAudioEnabled: audioEnabled 
        });
    };

    const updateMedia = ({ 
        roomId, 
        peerId, 
        kind, 
        enabled 
    }: { 
        roomId: string, 
        peerId: string, 
        kind: "video" | "audio", 
        enabled: boolean 
    }) => {
        socket.to(roomId).emit("update-media", { peerId, kind, enabled });
    };
    
    socket.on("media-ready", updatePeers);
    socket.on("media-toggle", updateMedia);

    const changeCode = ({ roomId, code, changes }: { roomId: string, code: string, changes: any[] }) => {
        const room = rooms.get(roomId);

        if (room) {
            room.editor.code = code;
            socket.to(roomId).emit("update-code", { changes });
        }
    };

    const changeLanguage = ({ roomId, language }: { roomId: string, language: string }) => {
        const room = rooms.get(roomId);

        if (room) {
            room.editor.language = language;
            socket.to(roomId).emit("update-language", { language });
        }
    };

    const changeInput = ({ roomId, input }: { roomId: string, input: string }) => {
        const room = rooms.get(roomId);

        if (room) {
            room.editor.input = input;
            socket.to(roomId).emit("update-input", { input });
        }
    };

    const changeOutput = ({ roomId, output }: { roomId: string, output: string }) => {
        const room = rooms.get(roomId);

        if (room) {
            room.editor.output = output;
            socket.to(roomId).emit("update-output", { output });
        }
    };

    const changeCursor = ({ 
        roomId, 
        userId, 
        username, 
        position 
    }: { 
        roomId: string, 
        userId: string, 
        username: string, 
        position: CursorPosition 
    }) => {
        const room = rooms.get(roomId);

        if (room && room.users.includes(userId)) {
            room.editor.cursors[userId] = { username, position };
            socket.to(roomId).emit("update-cursor", { userId, username, position });
        }
    };

    const removeCursor = ({ roomId, userId }: { roomId: string, userId: string }) => {
        const room = rooms.get(roomId);

        if (room && room.users.includes(userId)) {
            const newCursors = room.editor.cursors;
            delete newCursors[userId];
            room.editor.cursors = newCursors;
            socket.to(roomId).emit("user-left", { userId });
        }
    };

    const sendEditorData = ({ roomId, userId }: { roomId: string, userId: string }) => {
        const room = rooms.get(roomId);

        if (room && room.users.includes(userId)) {
            socket.emit("sync-editor", { 
                code: room.editor.code,
                language: room.editor.language,
                cursors: room.editor.cursors,
                input: room.editor.input,
                output: room.editor.output
            });
        }
    };

    socket.on("editor-ready", sendEditorData);
    socket.on("code-change", changeCode);
    socket.on("language-change", changeLanguage);
    socket.on("input-change", changeInput);
    socket.on("output-change", changeOutput);
    socket.on("cursor-change", changeCursor);
    socket.on("remove-cursor", removeCursor);

    const sendCanvasData = ({ roomId, userId }: { roomId: string, userId: string }) => {
        const room = rooms.get(roomId);

        if (room && room.users.includes(userId)) {
            socket.emit("sync-canvas", { allObjects: Object.values(room.canvas.objects) });
        }
    };

    const addObject = ({ roomId, object }: { roomId: string, object: CanvasObject }) => {
        const room = rooms.get(roomId);

        if (room) {
            room.canvas.objects[object.id] = object;
            socket.to(roomId).emit("add-object", { objectData: object });
        }
    };

    const modifyObject = ({ roomId, object }: { roomId: string, object: CanvasObject }) => {
        const room = rooms.get(roomId);

        if (room) {
            const existingObject = room.canvas.objects[object.id];
            if (existingObject) {
                room.canvas.objects[object.id] = object;
                socket.to(roomId).emit("update-object", { objectData: object });
            }
        }
    };

    const removeObject = ({ roomId, object }: { roomId: string, object: CanvasObject }) => {
        const room = rooms.get(roomId);

        if (room) {
            const newObjects = room.canvas.objects;
            delete newObjects[object.id];
            room.canvas.objects = newObjects;
            socket.to(roomId).emit("remove-object", { objectData: object });
        }
    };

    const clearCanvas = ({ roomId }: { roomId: string }) => {
        const room = rooms.get(roomId);

        if (room) {
            room.canvas.objects = {};
            socket.to(roomId).emit("clear-canvas");
        }
    };

    socket.on("canvas-ready", sendCanvasData);
    socket.on("object-added", addObject);
    socket.on("object-modified", modifyObject);
    socket.on("object-removed", removeObject);
    socket.on("canvas-cleared", clearCanvas);

    const removeUser = ({ roomId, userId }: { roomId: string, userId: string }) => {
        const room = rooms.get(roomId);

        if (room && room.users.includes(userId)) {
            const newUsers = room.users.filter(id => id !== userId);
            const newCursors = room.editor.cursors;
            delete newCursors[userId];
            socket.leave(roomId);

            room.users = newUsers;
            room.editor.cursors = newCursors;

            if (room.users.length === 0) {
                rooms.delete(roomId);
            } else {
                socket.to(roomId).emit("peer-left", { peerId: userId });
                socket.to(roomId).emit("user-left", { userId });
            }
        }
    };

    socket.on("leave-room", removeUser);

    socket.on("disconnect", () => {
        const { roomId, userId } = socket.data;
        if (roomId && userId) {
            removeUser({ roomId, userId });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
