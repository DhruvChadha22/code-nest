import { steps } from "@/constants/landingPageDetails";
import WorkingStep from "./WorkingStep";
import { Element } from "react-scroll";

const HowItWorks = () => {
    return (
        <section className="py-20">
            <Element name="working">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Get started in seconds</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Three simple steps to collaborative coding bliss</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {steps.map(({ title, description, icon }, index) => (
                            <WorkingStep key={title} title={title} description={description} icon={icon} index={index} />
                        ))}
                    </div>
                </div>
            </Element>
        </section>
    );
};

export default HowItWorks;
