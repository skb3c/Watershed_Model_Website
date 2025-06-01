import React from 'react';

const Instrumentation = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Instrumentation Demonstration
                </h1>
                
                {/* Video Section - Now with constrained dimensions */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Rain Tower Demo</h2>
                    <div className="flex justify-center">
                        <video 
                            controls 
                            className="w-full max-w-3xl h-auto max-h-[50vh] rounded-lg shadow-md"
                            src='https://storage.googleapis.com/miz_hydrology/Frontend_Data/Instrumentation/RainTower.MP4'
                        />
                    </div>
                </div>

                {/* Resources Section */}
                <div className="bg-white rounded-xl shadow-lg p-5">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Research Resources</h2>
                    <ul className="space-y-2">
                        <li>
                            <a 
                                href='https://elibrary.asabe.org/abstract.asp?aid=5380' 
                                target="_blank" 
                                rel="noopener noreferrer"
                               className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                Rainfall Simulator
                            </a>
                        </li>
                        {/* Other links remain the same */}
                        <li>
                            <a 
                                href='https://elibrary.asabe.org/abstract.asp?aid=17663' 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                Influence of Kinetic Energy
                            </a>
                        </li>
                        <li>
                            <a 
                                href='https://elibrary.asabe.org/abstract.asp?aid=29500' 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                Polyacrylamide Influence on Runoff
                            </a>
                        </li>
                        <li>
                            <a 
                                href='https://acsess.onlinelibrary.wiley.com/doi/abs/10.2134/jeq2014.10.0447' 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                Phosphate Treatment of Lead-Contaminated Soil
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Instrumentation;