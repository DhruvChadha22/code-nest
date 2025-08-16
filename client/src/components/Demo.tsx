import { demoImages } from "@/constants/landingPageDetails";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { Element } from "react-scroll";

const Demo = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % demoImages.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    const variants = {
        enter: {
            x: "100%",
            scale: 0.5,
            opacity: 0,
        },
        center: {
            x: "0%",
            scale: 1,
            opacity: 1,
            transition: {
                x: { type: "tween", stiffness: 300, damping: 5, duration: 1 },
                scale: { duration: 1 },
                opacity: { duration: 1 },
            } as Transition<any>,
        },
        exit: {
            x: "-100%",
            scale: 0.5,
            opacity: 0,
            transition: {
                x: { type: "tween", stiffness: 300, damping: 5, duration: 1 },
                scale: { duration: 1 },
                opacity: { duration: 1 },
            } as Transition<any>,
        },
    };

    return (
        <section className="py-20 hidden md:block">
            <Element name="demo">
                <div className="max-w-7xl flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">See it in action</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Built for speed, simplicity, and collaboration</p>
                    </div> 
                    <div className="relative w-[700px] h-[340px] lg:w-[950px] lg:h-[470px] xl:w-[1200px] xl:h-[630px] overflow-hidden">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={demoImages[index]}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="absolute mx-auto p-4 lg:p-8 border-2 border-[#334679] rounded-4xl"
                            >
                                <img
                                    
                                    src={demoImages[index]}
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </Element>
        </section>
    );
};

export default Demo;
