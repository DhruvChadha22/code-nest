import { Code2, User, Users } from "lucide-react";

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get started in seconds</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Three simple steps to collaborative coding bliss</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center group">
                        <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <User className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-white">1. Enter your name</h3>
                        <p className="text-gray-400">Quick and simple - just tell us what to call you during the session.</p>
                    </div>

                    <div className="text-center group">
                        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/20 transition-colors">
                            <Users className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-white">2. Create or join a room</h3>
                        <p className="text-gray-400">
                            Start a new coding session or join an existing room with a simple room code.
                        </p>
                    </div>

                    <div className="text-center group">
                        <div className="h-16 w-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/20 transition-colors">
                            <Code2 className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-white">3. Start coding together</h3>
                        <p className="text-gray-400">Begin coding, drawing and video calling in seconds. It's that simple.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
