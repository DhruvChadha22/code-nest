import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Element } from "react-scroll";
import { cn } from "@/lib/utils";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-36 pb-40 max-xl:pt-32 max-xl:pb-36 max-md:pt-24 max-md:pb-28">
            <Element name="hero">
                <div className="mx-auto max-w-[1252px] px-16 max-xl:px-10 max-lg:px-6 max-sm:px-4 max-lg:mx-8">
                    <div className="relative z-10 max-w-1/2 max-lg:max-w-full max-lg:flex max-lg:flex-col max-lg:items-center max-lg:justify-center">
                        <Badge variant="secondary" className="text-sm font-semibold py-2 px-4 rounded-full mb-6 bg-[linear-gradient(#1C51A0,#1C2B69)] text-[#c8ea80] border-blue-500/20">
                            <a href="https://github.com/DhruvChadha22/code-nest" target="_blank">⭐ Star the GitHub Repo!</a>
                        </Badge>
                        <h1 className="mb-6 text-[72px] max-lg:text-center font-black leading-[84px] tracking-[-0.03em] text-[#eaedff] uppercase max-lg:mb-7 max-lg:text-[56px] max-lg:leading-[56px] max-md:mb-4 max-md:text-4xl max-md:leading-9">
                            Collaborate Seamlessly
                        </h1>
                        <p className="max-w-440 max-lg:text-center mb-4 text-[22px] leading-[36px] max-xl:text-[20px] max-xl:leading-8">
                            Code side-by-side, chat face-to-face, and sketch your vision in real time. All in one place, instantly — no accounts, no friction, just pure collaboration.
                        </p>
                        <div className="relative p-0.5 bg-[linear-gradient(#334679,#162561)] w-fit rounded-2xl shadow-500 group">
                            <button 
                                className="min-h-[60px] rounded-2xl bg-[linear-gradient(#253575,#162561)] before:bg-[linear-gradient(#1b275a,#0e1434)] before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] hover:cursor-pointer text-white px-4 py-3 group-hover:before:opacity-100 before:rounded-2xl overflow-hidden"
                                onClick={() => navigate("/join-room")}
                            >
                                <div className="flex items-center justify-center">
                                    <img
                                        src="/zap.svg"
                                        alt="zap"
                                        className="size-10 mr-4 object-contain z-10"
                                    />
                                    <span className="relative z-2 text-[16px] font-bold leading-[24px] text-[#2ef2ff] uppercase">Try it now</span>
                                </div>
                                <span 
                                    className={cn(
                                        "before:bg-[linear-gradient(to_right,transparent,#2ef2ff,transparent)] before:absolute before:left-2/5 before:top-0 before:z-4 before:h-0.5 before:w-3/5 before:opacity-0 before:transition-all before:duration-500 before:content-[''] group-hover:before:left-4 group-hover:before:opacity-40",
                                        "after:bg-[linear-gradient(to_right,transparent,#2ef2ff,transparent)] after:absolute after:bottom-0 after:left-4 after:z-4 after:h-0.5 after:w-7/20 after:opacity-0 after:transition-all after:duration-500 after:content-[''] group-hover:after:left-3/5 group-hover:after:opacity-40"
                                    )}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="absolute z-0 top-[calc(20%)] left-[calc(33%)] max-lg:top-1/5 max-lg:left-[calc(20%)] bg-[radial-gradient(circle_at_center,#273773,#080D27)] blur-3xl size-2/3 rounded-full" />
                    <div className="absolute z-10 max-lg:hidden top-[calc(15%)] left-[calc(55%)]">
                        <img
                            src="/hero-img.png"
                            className="size-150 h-auto"
                            alt="hero"
                        />
                    </div>
                </div>
            </Element>
        </section>
    );
};

export default Hero;
