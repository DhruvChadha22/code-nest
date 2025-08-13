import { create } from "zustand";
import Peer from "peerjs";

interface LocalPeerState {
    peer: Peer | null;
    localStream: MediaStream | null;
    setPeer: (peer: Peer | null) => void;
    setLocalStream: (stream: MediaStream | null) => void;
    clearLocalPeer: () => void;
};

export const useLocalPeer = create<LocalPeerState>((set) => ({
    peer: null,
    localStream: null,
    setPeer: (peer) => set({ peer }),
    setLocalStream: (stream) => set((state) => {
        state.localStream?.getTracks().forEach((track) => track.stop());
        return { localStream: stream };
    }),
    clearLocalPeer: () => set((state) => {
        const stream = state.localStream;
        stream?.getTracks().forEach((track) => track.stop());
        state.peer?.destroy();
        
        return {
            peer: null,
            localStream: null,
        };
    }),
}));
