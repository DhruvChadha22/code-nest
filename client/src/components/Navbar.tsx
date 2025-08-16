import { useEffect, useState } from "react";
import { Link as LinkScroll } from "react-scroll";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 32);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const NavLink = ({ title }: { title: string }) => (
        <LinkScroll
            to={title}
            offset={-100}
            spy
            smooth
            activeClass="text-[#c8ea80]"
            className="text-[16px] font-bold leading-[24px] text-[#EAEDFF] uppercase transition-colors duration-500 cursor-pointer hover:text-[#2EF2FF]"
        >
            {title}
        </LinkScroll>
    );

    return (
        <header
            className={cn(
                "fixed top-0 left-0 z-50 w-full py-10 transition-all duration-500 max-lg:py-3",
                hasScrolled && "py-2 bg-[#05091d] backdrop-blur-[8px]",
            )}
        >
            <div className="mx-auto max-w-[1252px] px-16 max-xl:px-10 max-sm:px-4 flex h-14 items-center max-lg:px-5">
                <ul className="flex flex-1">
                    <li className="flex flex-1 items-center justify-between max-lg:hidden">
                        <NavLink title="features" />
                        <div className="size-1.5 rounded-full bg-[#3c52d9]" />
                        <NavLink title="working" />
                    </li>

                    <li className="flex flex-1 items-center justify-center">
                        <LinkScroll
                            to="hero"
                            offset={-250}
                            spy
                            smooth
                            className="flex items-center justify-center gap-4 transition-transform duration-500 cursor-pointer"
                        >
                            <img
                                src="/logo-with-name.svg"
                                width={200}
                                height={80}
                                alt="logo"    
                            />
                        </LinkScroll>
                    </li>

                    <li className="flex flex-1 items-center justify-between max-lg:hidden">
                        <NavLink title="demo" />
                        <div className="size-1.5 rounded-full bg-[#3c52d9]" />
                        <NavLink title="faq" />
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
