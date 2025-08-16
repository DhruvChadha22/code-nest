import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

const WorkingStep = ({
    title,
    description,
    icon,
    index
}: {
    title: string;
    description: string;
    icon: any;
    index: number;
}) => {
    const borderRef = useRef<HTMLDivElement>(null);

    const offsetX = useMotionValue(-100);
    const offsetY = useMotionValue(-100);
    const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            if (!borderRef.current) return;

            const borderRect = borderRef.current.getBoundingClientRect();
            offsetX.set(e.x - borderRect.x);
            offsetY.set(e.y - borderRect.y);
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    const Icon = icon;
    return (
        <div className="relative text-center group border-2 border-[#334679] rounded-xl p-8 bg-[linear-gradient(#1b275a,#0e1434)]">
            <motion.div 
                className="absolute inset-0 border-2 border-[#2EF2FF] rounded-xl" 
                style={{
                    WebkitMaskImage: maskImage,
                    maskImage
                }}
                ref={borderRef}
            />
            <div 
                className={cn(
                        "h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors",
                        index === 0 ? 
                            "bg-amber-500/10 group-hover:bg-amber-500/20" : 
                            index === 1 ? 
                                "bg-green-500/10 group-hover:bg-green-500/20" : 
                                "bg-purple-500/10 group-hover:bg-purple-500/20"
                )}
            >
                <Icon 
                    className={cn(
                        "size-8",
                        index === 0 ? 
                            "text-amber-200" : 
                            index === 1 ? 
                                "text-green-400" : 
                                "text-purple-400"
                    )} 
                />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
            <p className="text-xl text-gray-400">{description}</p>
        </div>
    );
};

export default WorkingStep;
