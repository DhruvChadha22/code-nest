import { cursorColors } from "@/constants/cursorColors";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
};

export function getRandomCursorColor() {
    const randomIdx = Math.floor(Math.random() * 10);

    return cursorColors[randomIdx];
};

export function injectCursorCSS(userId: string, username: string, color: string) {
    const styleId = `remote-cursor-style-${userId}`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
        .remote-cursor-${userId} {
            border-left: 2px solid ${color};
        }
        .remote-cursor-label-${userId}::after {
            content: '${username}';
            background: ${color};
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 4px;
            font-size: 0.75rem;
            white-space: nowrap;
            position: absolute;
        }
    `;

    document.head.appendChild(style);
};

export function cleanupCursorCSS(userId: string) {
    const style = document.getElementById(`remote-cursor-style-${userId}`);
    if (style) style.remove();
};
