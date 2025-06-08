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
  const [isHovered, setIsHovered] = useState(null);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    setCurrentIndex(0);
  };

  const handleSliderChange = (event) => {
    setCurrentIndex(parseInt(event.target.value));
  };

  const maxIndex = selectedLocation ? imagesByLocation[selectedLocation].falseColor.length - 1 : 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start py-6 px-4">
      <div className="w-full max-w-10xl border border-gray-200 rounded-2xl shadow-lg overflow-hidden bg-white flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-yellow-300">UAV</span> Imaging
            </h1>
            <p className="text-blue-100 text-lg mt-2">
              Advanced drone imaging for precision agriculture and water sustainability
            </p>
          </div>
        </div>

        <div className="px-6 py-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed">
              Unmanned Aerial Vehicles (UAVs), commonly known as drones, have emerged as a highly 
              effective tool in precision agriculture, including water sustainability practices. 
              UAV imaging, through various sensors and cameras, can collect detailed data on crop health,
              soil conditions, and environmental factors, enabling farmers and water managers to make 
              informed decisions regarding water use.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px]">
          <div className="flex-1 p-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Precision Irrigation
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Detection of Variability
                    </h3>
                    <p className="text-gray-700 pl-7">
                    UAVs equipped with multispectral or thermal cameras can 
                    identify variations in field moisture levels and crop health that are not visible to the naked eye. This data allows for the identification of under-irrigated or over-irrigated areas.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Irrigation Planning
                    </h3>
                    <p className="text-gray-700 pl-7">
                    By pinpointing specific zones that require attention, UAV 
                    imaging enables the implementation of precision irrigation techniques. This means water is applied 
                    in the right amount, at the right time, and at the right place, minimizing waste and enhancing water
                    use efficiency.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  Soil Moisture Analysis
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Monitoring Soil Conditions
                    </h3>
                    <p className="text-gray-700 pl-7">
                    High-resolution images from UAVs can help in assessing 
                    soil moisture levels across different parts of a farm. This information is crucial for determining 
                    irrigation schedules and volumes that precisely meet the crops' needs without overuse of water.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Identifying Drainage Issues
                    </h3>
                    <p className="text-gray-700 pl-7">
                    UAV imaging can reveal areas with poor drainage or 
                    water pooling, which can affect crop health. Addressing these issues not only improves crop yields 
                    but also conserves water by optimizing irrigation practices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-purple-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Crop Health Monitoring
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Stress Detection
                    </h3>
                    <p className="text-gray-700 pl-7">
                    Stress in plants, often due to inadequate or excessive water, can
                    be detected through UAV imagery long before visible symptoms appear. Early detection of stress allows
                    for quicker interventions, such as adjusting irrigation, to prevent further water stress and loss of 
                    yield.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Water Efficiency
                    </h3>
                    <p className="text-gray-700 pl-7">
                    Healthier crops make better use of water. By maintaining optimal 
                    crop health through precise water management, UAV imaging contributes to overall water sustainability in
                    agriculture.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  Water Resource Management
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-indigo-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mapping Water Resources
                    </h3>
                    <p className="text-gray-700 pl-7">
                      UAVs can be used to map and monitor on-farm water resources, including ponds, reservoirs, and irrigation channels. 
                      This aids in the efficient allocation and use of available water, planning for water storage needs, and identifying 
                      leaks or inefficiencies in irrigation systems.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Evaluating Conservation Practices
                    </h3>
                    <p className="text-gray-700 pl-7">
                      UAV imagery can assess the effectiveness of water conservation measures, such as cover cropping, mulching, and terracing. 
                      Understanding the impact of these practices can guide future efforts in water conservation strategies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-teal-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  Data Integration for Comprehensive Management
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-teal-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Integration with Other Data
                    </h3>
                    <p className="text-gray-700 pl-7">
                      UAV imaging data can be integrated with data from other sources (e.g., weather stations, soil sensors) to create 
                      comprehensive models of water use and needs. This holistic approach supports more accurate and sustainable water 
                      management decisions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Predictive Analytics
                    </h3>
                    <p className="text-gray-700 pl-7">
                      Over time, data collected by UAVs can be analyzed to predict future water needs and plan accordingly, improving 
                      the resilience of agricultural systems to variability in weather patterns and climate change.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-cyan-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Conclusion
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    UAV imaging represents a significant advancement in agricultural technology, offering a high-precision, data-driven 
                    approach to water sustainability. By enabling targeted irrigation practices, early stress detection, and efficient 
                    water resource management, UAVs contribute to the optimization of water use in agriculture, leading to enhanced 
                    crop yields, reduced water waste, and a more sustainable agricultural future.
                  </p>
                  <p className="text-gray-700">
                    View our drone projects from our South Farm location and read about our current research projects with UAV imagery.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                <div className="w-full md:w-1/3">
                  <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a location:
                  </label>
                  <select
                    id="location-select"
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  >
                    <option value="">-- Select Location --</option>
                    {Object.keys(imagesByLocation).map(location => (
                      <option key={location} value={location}>
                        {location.replace(/_/g, ' ')}
                      </option>
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}
              </div>

              {selectedLocation && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div 
                    className={`bg-gray-50 p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${isHovered === 'falseColor' ? 'ring-2 ring-blue-500' : ''}`}
                    onMouseEnter={() => setIsHovered('falseColor')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <h3 className="text-center font-semibold mb-3 text-blue-700">False Color</h3>
                    <img
                      src={imagesByLocation[selectedLocation].falseColor[currentIndex]}
                      alt="False Color"
                      className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                  <div 
                    className={`bg-gray-50 p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${isHovered === 'ndvi' ? 'ring-2 ring-green-500' : ''}`}
                    onMouseEnter={() => setIsHovered('ndvi')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <h3 className="text-center font-semibold mb-3 text-green-700">NDVI</h3>
                    <img
                      src={imagesByLocation[selectedLocation].ndvi[currentIndex]}
                      alt="NDVI"
                      className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                  <div 
                    className={`bg-gray-50 p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${isHovered === 'trueColor' ? 'ring-2 ring-yellow-500' : ''}`}
                    onMouseEnter={() => setIsHovered('trueColor')}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <h3 className="text-center font-semibold mb-3 text-yellow-700">True Color</h3>
                    <img
                      src={imagesByLocation[selectedLocation].trueColor[currentIndex]}
                      alt="True Color"
                      className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UAVImaging;
