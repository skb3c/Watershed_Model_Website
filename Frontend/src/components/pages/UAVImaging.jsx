import React, { useState } from 'react';

const imagesByLocation = {
  SouthFarm_2022: {
    falseColor: [
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-05-24_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-06-07_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-06-13_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-06-21_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-06-29_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-07-05_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-07-12_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-07-21_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-07-28_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-08-04_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-08-11_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-08-17_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-08-23_False%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/False%20Color/SouthFarm_2022-08-30_False%20Color.png'
    ],
    ndvi: [
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-05-24_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-06-07_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-06-13_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-06-21_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-06-29_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-07-05_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-07-12_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-07-21_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-07-28_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-08-04_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-08-11_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-08-17_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-08-23_NDVI.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/NDVI/SouthFarm_2022-08-30_NDVI.png'
    ],
    trueColor: [
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-05-24_True%20Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-06-07_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-06-13_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-06-21_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-06-29_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-07-05_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-07-12_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-07-21_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-07-28_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-08-04_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-08-11_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-08-17_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-08-23_True_Color.png',
        'https://storage.googleapis.com/miz_hydrology/Frontend_Data/UAV_Imaging/SouthFarm_2022/True%20Color/SouthFarm_2022-08-30_True_Color.png'
    ]
}
};

const UAVImaging = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState('');

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
        setCurrentIndex(0);
    };

    const handleSliderChange = (event) => {
        setCurrentIndex(parseInt(event.target.value));
    };

    const maxIndex = selectedLocation ? imagesByLocation[selectedLocation].falseColor.length - 1 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">UAV Imaging</h1>
                    <p className="text-lg text-gray-600">
                        Advanced drone imaging for precision agriculture and water sustainability
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="prose max-w-none">
                    <p>
                Unmanned Aerial Vehicles (UAVs), commonly known as drones, have emerged as a highly 
                effective tool in precision agriculture, including water sustainability practices. 
                UAV imaging, through various sensors and cameras, can collect detailed data on crop health,
                soil conditions, and environmental factors, enabling farmers and water managers to make 
                informed decisions regarding water use. Here’s how UAV imaging contributes to improving 
                agricultural water sustainability: 
                </p>
                <h2>Precision Irrigation</h2>
                <p>
                    <strong>Detection of Variability:</strong> UAVs equipped with multispectral or thermal cameras can 
                    identify variations in field moisture levels and crop health that are not visible to the naked eye. This data allows for the identification of under-irrigated or over-irrigated areas.
                </p>
                <p>
                    <strong>Irrigation Planning:</strong> By pinpointing specific zones that require attention, UAV 
                    imaging enables the implementation of precision irrigation techniques. This means water is applied 
                    in the right amount, at the right time, and at the right place, minimizing waste and enhancing water
                    use efficiency.
                </p>

                <h2>Soil Moisture Analysis</h2>
                <p>
                    <strong>Monitoring Soil Conditions:</strong> High-resolution images from UAVs can help in assessing 
                    soil moisture levels across different parts of a farm. This information is crucial for determining 
                    irrigation schedules and volumes that precisely meet the crops' needs without overuse of water.
                </p>
                <p>
                    <strong>Identifying Drainage Issues:</strong> UAV imaging can reveal areas with poor drainage or 
                    water pooling, which can affect crop health. Addressing these issues not only improves crop yields 
                    but also conserves water by optimizing irrigation practices.
                </p>

                <h2>Crop Health Monitoring</h2>
                <p>
                    <strong>Stress Detection:</strong> Stress in plants, often due to inadequate or excessive water, can
                    be detected through UAV imagery long before visible symptoms appear. Early detection of stress allows
                    for quicker interventions, such as adjusting irrigation, to prevent further water stress and loss of 
                    yield.
                </p>
                <p>
                    <strong>Water Efficiency:</strong> Healthier crops make better use of water. By maintaining optimal 
                    crop health through precise water management, UAV imaging contributes to overall water sustainability in
                    agriculture.
                </p>

                <h2>Water Resource Management</h2>
                <p>
                    <strong>Mapping Water Resources:</strong> UAVs can be used to map and monitor on-farm water resources, 
                    including ponds, reservoirs, and irrigation channels. This aids in the efficient allocation and use of 
                    available water, planning for water storage needs, and identifying leaks or inefficiencies in irrigation 
                    systems.
                </p>
                <p>
                    <strong>Evaluating Conservation Practices:</strong> UAV imagery can assess the effectiveness of water 
                    conservation measures, such as cover cropping, mulching, and terracing. Understanding the impact of 
                    these practices can guide future efforts in water conservation strategies.
                </p>

                <h2>Data Integration for Comprehensive Management</h2>
                <p>
                    <strong>Integration with Other Data:</strong> UAV imaging data can be integrated with data from other 
                    sources (e.g., weather stations, soil sensors) to create comprehensive models of water use and needs. 
                    This holistic approach supports more accurate and sustainable water management decisions.
                </p>
                <p>
                    <strong>Predictive Analytics:</strong> Over time, data collected by UAVs can be analyzed to predict 
                    future water needs and plan accordingly, improving the resilience of agricultural systems to variability
                    in weather patterns and climate change.
                </p>

                <h2>Conclusion</h2>
                <p>
                    UAV imaging represents a significant advancement in agricultural technology, offering a high-precision, 
                    data-driven approach to water sustainability. By enabling targeted irrigation practices, early stress 
                    detection, and efficient water resource management, UAVs contribute to the optimization of water use in
                    agriculture, leading to enhanced crop yields, reduced water waste, and a more sustainable agricultural 
                    future.
                </p>

                <p>
                    View our drone projects from our South Farm location and read about our current research projects with UAV imagery.
                </p>
                        {/* Keep all your existing content paragraphs */}
                    </div>
                </div>

                {/* Image Selection Controls */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Choose a location:
                            </label>
                            <select
                                id="location-select"
                                value={selectedLocation}
                                onChange={handleLocationChange}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Location --</option>
                                {Object.keys(imagesByLocation).map(location => (
                                    <option key={location} value={location}>{location.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>

                        {selectedLocation && (
                            <div className="w-full md:w-2/3">
                                <label htmlFor="image-slider" className="block text-sm font-medium text-gray-700 mb-2">
                                    Slide to preview the images
                                </label>
                                <input
                                    id="image-slider"
                                    type="range"
                                    min="0"
                                    max={maxIndex}
                                    value={currentIndex}
                                    onChange={handleSliderChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        )}
                    </div>

                    {/* Image Display */}
                    {selectedLocation && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="text-center font-medium mb-2">False Color</h3>
                                <img 
                                    src={imagesByLocation[selectedLocation].falseColor[currentIndex]} 
                                    alt="False Color" 
                                    className="w-full h-auto rounded border border-gray-200"
                                />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="text-center font-medium mb-2">NDVI</h3>
                                <img 
                                    src={imagesByLocation[selectedLocation].ndvi[currentIndex]} 
                                    alt="NDVI" 
                                    className="w-full h-auto rounded border border-gray-200"
                                />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="text-center font-medium mb-2">True Color</h3>
                                <img 
                                    src={imagesByLocation[selectedLocation].trueColor[currentIndex]} 
                                    alt="True Color" 
                                    className="w-full h-auto rounded border border-gray-200"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UAVImaging;