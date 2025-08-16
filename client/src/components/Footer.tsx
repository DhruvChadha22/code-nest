import { socials } from "@/constants/landingPageDetails";

const Footer = () => {
    return (
        <footer className="border-t border-[#334679] bg-[#1b275a]">
            <div className="max-w-7xl mx-auto py-10">
                <div className="flex w-full max-md:flex-col">
                    <div className="flex flex-1 flex-wrap items-center justify-center font-semibold gap-5">
                        <div className="flex flex-col gap-2">
                            <p>Made by, Dhruv Chadha</p>
                            <a href="https://storyset.com/technology" target="_blank" className="opacity-70 underline">Illustrations by Storyset</a>
                        </div>
                    </div>

                    <ul className="flex flex-1 justify-center gap-3 max-md:mt-10">
                        {socials.map(({ title, url, icon }) => {
                            const Icon = icon;
                            return <li key={title}>
                                <a href={url} target="_blank" className="flex size-16 items-center justify-center rounded-full border-2 border-[#1959AD]/25 bg-[#080D27]/20 transition-all duration-500 hover:border-[#1959AD]">
                                    <Icon className="size-1/3 object-contain" />
                                </a>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
