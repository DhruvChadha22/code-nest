import Demo from "@/components/Demo";
import FAQs from "@/components/FAQs";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";

const Home = () => {
    return (
        <div className="min-h-screen bg-[#080D27] text-white">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Demo />
            <FAQs />
            <Footer />
        </div>
    );
};

export default Home;
