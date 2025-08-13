import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Code2 } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="#" className="flex items-center space-x-2">
                        <Code2 className="h-8 w-8 text-blue-500" />
                        <span className="text-xl font-bold">CodeNest</span>
                    </a>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                            How it Works
                        </a>
                        <a href="#demo" className="text-gray-300 hover:text-white transition-colors">
                            Demo
                        </a>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer" 
                            size="sm"
                            onClick={() => navigate("/join-room")}
                        >
                            Join-Room
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
