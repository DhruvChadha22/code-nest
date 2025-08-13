import { create } from "zustand";

interface CursorState {
    allCursors: Record<
        string, { 
            decorations: string[], 
            position: { lineNumber: number; column: number }, 
            username: string, 
            color: string,
        }>;
    setCursor: (
        userId: string,
        decorations: string[],
        position: { lineNumber: number; column: number },
        username: string,
        color: string,
    ) => void;
    removeCursor: (userId: string) => void;
    clearAllCursors: () => void;
};

export const useCursors = create<CursorState>((set) => ({
    allCursors: {},
    setCursor: (userId, decorations, position, username, color) => {
        set((state) => ({
            allCursors: {
                ...state.allCursors,
                [userId]: {
                    ...state.allCursors[userId],
                    decorations: decorations,
                    position,
                    username,
                    color,
                },
            },
        }));
    },
    removeCursor: (userId) => {
        set((state) => {
            const newState = { ...state.allCursors };
            delete newState[userId];
            return { allCursors: newState };
        });
    },
    clearAllCursors: () => set({ allCursors: {} }),
}));
