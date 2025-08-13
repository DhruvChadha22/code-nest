import { ArrowRight, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="text-center">
                    <Badge variant="secondary" className="text-sm p-2 rounded-full mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20">
                        <a href="https://github.com/DhruvChadha22/code-nest" target="_blank">⭐ Star the GitHub Repo!</a>
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        CodeNest
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Code together, create together. Real-time collaborative coding with built-in video chat, drawing board and instant code execution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button 
                            size="lg" 
                            className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-8 py-3 text-lg group"
                            onClick={() => navigate("/join-room")}
                        >
                            Start Coding
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:cursor-pointer hover:text-white px-8 py-3 text-lg bg-transparent"
                            onClick={() => navigate("/join-room")}
                        >
                            <Users className="mr-2 h-5 w-5" />
                            Join a Room
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
