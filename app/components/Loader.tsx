export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative flex flex-col items-center">
                {/* Main spinner */}
                <div className="relative w-24 h-24">
                    {/* Outer circle */}
                    <div className="absolute w-full h-full border-4 border-blue-500/20 rounded-full"></div>
                    {/* Spinning gradient ring */}
                    <div className="absolute w-full h-full rounded-full animate-spin">
                        <div className="w-full h-full rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400"></div>
                    </div>
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent animate-pulse"></div>
                </div>
                
                {/* Loading text with animated dots */}
                <div className="mt-8 flex items-center space-x-1">
                    <span className="text-blue-400 font-medium">Loading</span>
                    {[0, 1, 2].map((i) => (
                        <span 
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400"
                            style={{ 
                                animation: `bounce 0.8s infinite ${i * 0.2}s`
                            }}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
}