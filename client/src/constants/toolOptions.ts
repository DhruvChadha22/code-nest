import { BrushCleaning, Circle, Minus, MousePointer, Pencil, Square, Trash2, Type } from "lucide-react";

export const toolOptions = [
    {
        type: "select",
        icon: MousePointer,
        fill: true,
    },
    {
        type: "rectangle",
        icon: Square,
        fill: true,
    },
    {
        type: "ellipse",
        icon: Circle,
        fill: true,
    },
    {
        type: "line",
        icon: Minus,
        fill: false,
    },
    {
        type: "draw",
        icon: Pencil,
        fill: false,
    },
    {
        type: "textbox",
        icon: Type,
        fill: false,
    },
    {
        type: "delete",
        icon: Trash2,
        fill: false,
    },
    {
        type: "clear",
        icon: BrushCleaning,
        fill: false,
    },
];
