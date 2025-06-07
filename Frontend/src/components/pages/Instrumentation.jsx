import React from 'react';
import { FaCloudRain, FaSatelliteDish } from 'react-icons/fa';

const Instrumentation = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Instrumentation Demonstration
                </h1>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Feature 1 - Rain Tower Simulation */}
                    <div 
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                        onClick={() => document.getElementById('rain-tower-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <div className="inline-block p-4 bg-blue-200 rounded-full mb-6 ring-2 ring-blue-300 ring-opacity-50">
                            <FaCloudRain className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-3">Rain Tower Simulation</h3>
                        <p className="text-blue-700">Demonstration of our advanced rainfall simulation technology for research purposes</p>
                    </div>

                    {/* Feature 2 - Environmental Sensing */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="inline-block p-4 bg-green-200 rounded-full mb-6 ring-2 ring-green-300 ring-opacity-50">
                            <FaSatelliteDish className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-900 mb-3">Environmental Sensing</h3>
                        <p className="text-green-700">Advanced sensing technologies for monitoring environmental conditions (Coming Soon)</p>
                    </div>
                </div>

                {/* Video Section - Now with constrained dimensions */}
                <div id="rain-tower-section" className="bg-white rounded-xl shadow-lg p-4 mb-6">
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