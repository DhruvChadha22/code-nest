import { create } from "zustand";

interface UserState {
    userId: string;
    username: string;
    videoEnabled: boolean;
    audioEnabled: boolean;
    setUserId: (id: string) => void;
    setUsername: (name: string) => void;
    setVideoEnabled: (enabled: boolean) => void;
    setAudioEnabled: (enabled: boolean) => void;
    clearUserData: () => void;
};

export const useUser = create<UserState>((set) => ({
    userId: "",
    username: "",
    videoEnabled: true,
    audioEnabled: true,
    setUserId: (id) => set({ userId: id }),
    setUsername: (name) => set({ username: name }),
    setVideoEnabled: (enabled) => set({ videoEnabled: enabled }),
    setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
    clearUserData: () => set({
        userId: "",
        username: "",
        videoEnabled: true,
        audioEnabled: true,
    }),
}));
