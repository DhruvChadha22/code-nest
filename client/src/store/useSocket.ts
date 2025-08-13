import { io, type Socket } from "socket.io-client";
import { create } from "zustand";

interface SocketState {
    socket: Socket
};

export const useSocket = create<SocketState>(() => ({
    socket: io(import.meta.env.VITE_WS_SERVER_URL)
}));
