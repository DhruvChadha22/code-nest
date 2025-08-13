import { Brush, Code2, Play, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const Features = () => {
    return (
        <section id="features" className="py-20 bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to code together</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Powerful features designed for seamless collaboration and productivity
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors group">
                        <CardHeader>
                            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                <Video className="h-6 w-6 text-blue-400" />
                            </div>
                            <CardTitle className="text-white">Real-Time Video Chat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-gray-400">
                                Collaborate face-to-face with built-in video and audio communication. No external tools needed.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors group">
                        <CardHeader>
                            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                <Code2 className="h-6 w-6 text-green-400" />
                            </div>
                            <CardTitle className="text-white">Live Code Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-gray-400">
                                Synchronized Monaco editor with syntax highlighting and multi-language support for seamless coding.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors group">
                        <CardHeader>
                            <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                                <Brush className="h-6 w-6 text-yellow-400" />
                            </div>
                            <CardTitle className="text-white">Drawing Board</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-gray-400">
                                Dry-run your code, build logic by visualising problems on a synchronized canvas with multiple drawing tools.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors group">
                        <CardHeader>
                            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                <Play className="h-6 w-6 text-purple-400" />
                            </div>
                            <CardTitle className="text-white">Run Code Instantly</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-gray-400">
                                Execute code with custom inputs and see output in real-time. Debug together, faster.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Features;
