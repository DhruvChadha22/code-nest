import { User } from "lucide-react";

const Demo = () => {
    return (
        <section id="demo" className="py-20 bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">See it in action</h2>
                <p className="text-xl text-gray-400">Built for speed, simplicity, and collaboration</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                {/* Mock Browser Bar */}
                <div className="bg-gray-900 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
                    <div className="flex space-x-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                    <div className="bg-gray-700 rounded px-3 py-1 text-sm text-gray-300 inline-block">
                        codenest.dev/room/abc123
                    </div>
                    </div>
                </div>

                {/* Mock App Interface */}
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 w-full h-full p-6">
                    {/* Code Editor Mock */}
                    <div className="bg-gray-900 rounded border border-gray-600 p-4">
                        <div className="text-sm text-gray-400 mb-2">main.py</div>
                        <div className="space-y-1 text-sm font-mono">
                        <div className="text-purple-400">def fibonacci(n):</div>
                        <div className="text-white ml-4">if n {"<="} 1:</div>
                        <div className="text-white ml-8">return n</div>
                        <div className="text-white ml-4">return fibonacci(n-1) + fibonacci(n-2)</div>
                        </div>
                    </div>

                    {/* Video Chat Mock */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                            key={i}
                            className="aspect-video bg-gray-700 rounded border border-gray-600 flex items-center justify-center"
                            >
                            <User className="h-6 w-6 text-gray-500" />
                            </div>
                        ))}
                        </div>
                        <div className="bg-gray-900 rounded border border-gray-600 p-3">
                        <div className="text-sm text-gray-400 mb-1">Output:</div>
                        <div className="text-green-400 font-mono text-sm">55</div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
    );
};

export default Demo;
