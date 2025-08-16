import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number; }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    return (
        <div 
            className={cn("group p-4 mb-4 border-b border-[#334679] cursor-pointer", isOpen && "bg-[linear-gradient(#253575,#162561)] rounded-xl")}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="relative flex items-center">
                {isOpen && <div className="absolute left-0 -top-4 h-0.5 w-40 bg-[#2ef2ff]" />}

                <div className="flex-1">
                    <div className="text-[12px] font-semibold leading-[18px] tracking-[0.03em] mb-1.5 text-[#c8ea80]">
                        {index < 10 ? "0" : ""}
                        {index}
                    </div>
                    <span className="text-lg font-bold">{question}</span>
                </div>
                <div className="flex items-center justify-center mx-2 border-2 border-[#0C1838] bg-[radial-gradient(circle_at_center,#1C2B69,#1C51A0)] rounded-full group-hover:border-[#2EF2FF] transition-all duration-500 size-10">
                    {isOpen ? <Minus className="size-8 object-contain p-2 stroke-[#2EF2FF] stroke-3" /> : <Plus className="size-8 object-contain p-2 stroke-[#c8ea80] stroke-3" />}
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                        }}
                    >
                        {answer}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FAQItem;
