import { mainFeatures, otherFeatures } from "@/constants/landingPageDetails";
import { Element } from "react-scroll";

const Features = () => {
    return (
        <section className="py-20">
            <Element name="features">
                <div className="mx-auto max-w-[1252px] px-16 max-xl:px-10 max-lg:px-6 max-sm:px-4">
                    <div className="relative flex md:flex-wrap flex-nowrap border-2 border-[#334679] rounded-4xl after:bg-[linear-gradient(rgba(196,203,245,0.5),transparent)] after:absolute after:right-0 after:top-0 after:h-full after:w-1/2 after:mix-blend-soft-light after:content-[''] max-md:after:hidden md:overflow-hidden max-md:flex-col md:bg-[linear-gradient(#1b275a,#0e1434)] max-md:border-none max-md:rounded-none max-md:gap-3">
                        {mainFeatures.map(({ icon, caption, title, text }) => {
                            const Icon = icon;
                            return <div
                                key={title}
                                className="relative z-2 md:px-10 px-5 md:pb-10 pb-5 flex-[0_0_50%] max-md:bg-[linear-gradient(#1b275a,#0e1434)] max-md:border-2 max-md:border-[#334679] max-md:rounded-3xl max-md:flex-[1_0_320px]"
                            >
                                <div className="w-full flex justify-start items-start">
                                    <div className="-ml-3 mb-12 flex items-center justify-center flex-col">
                                        <div className="w-0.5 h-16 bg-[#334679]" />
                                        <Icon className="size-16 object-contain bg-[radial-gradient(circle_at_center,#283dbd,#386BE8)] border-2 border-[#334679] hover:border-[#2EF2FF] transition-all duration-500 rounded-full p-4" />
                                    </div>
                                </div>

                                <p className="text-[12px] text-[#c8ea80] font-bold leading-[16px] tracking-[0.3em] uppercase mb-5 max-md:mb-6">{caption}</p>
                                <h2 className="max-w-400 mb-7 text-[48px] text-[#eaedff] font-semibold leading-[56px] tracking-[-0.02em] text-p4 max-md:mb-6 max-md:text-[32px] max-md:font-semibold max-md:leading-[40px]">{title}</h2>
                                <p className="mb-11 text-[22px] text-gray-300 leading-[36px] max-md:mb-8 max-md:text-[16px] max-md:leading-[28px] max-md:tracking-[0.02em]">{text}</p>
                            </div>
                        })}

                        <ul className="relative flex justify-around flex-grow px-[5%] border-2 border-[#334679] rounded-4xl max-md:hidden">
                            <div className="absolute bg-[#334679]/20 top-[38%] left-0 right-0 w-full h-[1px] z-10" />

                            {otherFeatures.map(({ icon, title }) => {
                                const Icon = icon;
                                return <li key={title} className="relative pt-16 px-4 pb-14 z-20">
                                    <div className="absolute top-0 bottom-0 left-1/2 bg-[#334679]/20 w-[1px] h-full -z-10" />

                                    <div className="flex items-center justify-center mx-auto mb-3 border-2 border-[#0C1838] bg-[radial-gradient(circle_at_center,#1C2B69,#1C51A0)] rounded-full hover:border-[#2EF2FF] transition-all duration-500 size-16">
                                        <Icon className="size-3/4 object-contain p-2" />
                                    </div>

                                    <h3 className="relative z-20 max-w-36 mx-auto my-0 font-semibold text-center text-gray-300 uppercase">
                                        {title}
                                    </h3>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </Element>
        </section>
    );
};

export default Features;
