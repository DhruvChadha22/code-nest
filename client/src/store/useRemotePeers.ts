import { create } from "zustand";

interface RemotePeersState {
    remotePeers: Record<
        string, { 
            stream: MediaStream; 
            username: string; 
            videoEnabled: boolean; 
            audioEnabled: boolean 
        }>;
    addRemotePeer: (
        peer: string, 
        stream: MediaStream, 
        username: string, 
        videoEnabled: boolean, 
        audioEnabled: boolean
    ) => void;
    removeRemotePeer: (peer: string) => void;
    updateRemotePeerMedia: (peerId: string, kind: "video" | "audio", enabled: boolean) => void;
    clearRemotePeers: () => void;
};

export const useRemotePeers = create<RemotePeersState>((set) => ({
    remotePeers: {},
    addRemotePeer: (peerId, stream, username, videoEnabled, audioEnabled) => {
        set((state) => ({
            remotePeers: {
                ...state.remotePeers,
                [peerId]: { stream, username, videoEnabled, audioEnabled },
            },
        }));
    },
    removeRemotePeer: (peerId) => {
        set((state) => {
            const peer = state.remotePeers[peerId];
            if (peer) {
                peer.stream?.getTracks().forEach((track) => track.stop());
            }
            const updatedPeers = { ...state.remotePeers };
            delete updatedPeers[peerId];

            return { remotePeers: updatedPeers };
        });
    },
    updateRemotePeerMedia: (peerId, kind, enabled) => {
        set((state) => {
            const peer = state.remotePeers[peerId];
            if (!peer) return state;

            return {
                remotePeers: {
                    ...state.remotePeers,
                    [peerId]: {
                        ...peer,
                        [kind === "video" ? "videoEnabled" : "audioEnabled"]: enabled,
                    },
                },
            };
        });
    },
    clearRemotePeers: () => set((state) => {
        Object.values(state.remotePeers).forEach((peerData) => {
            const remoteStream = peerData.stream;
            remoteStream?.getTracks().forEach((track) => track.stop());
        });

        return { remotePeers: {} };
    }),
}));
