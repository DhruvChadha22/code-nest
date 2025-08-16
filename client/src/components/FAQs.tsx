import { faqs } from "@/constants/landingPageDetails";
import FAQItem from "./FAQItem";
import { Element } from "react-scroll";

const FAQs = () => {
    return (
        <section className="py-20">
            <Element name="faq">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-center text-4xl sm:text-5xl font-bold tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="mt-12">
                        {faqs.map(({ question, answer }, index) => (
                            <FAQItem key={question} question={question} answer={answer} index={index} />
                        ))}
                    </div>
                </div>
            </Element>
        </section>
    );
};

export default FAQs;
