import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";

const Home = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Demo />
            <Footer />
        </div>
    );
};

export default Home;
