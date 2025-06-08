import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const WaterQuality = () => {
  // All your existing state and logic remains exactly the same
  const [selectedBasin, setSelectedBasin] = useState('');
  const [selectedChemical, setSelectedChemical] = useState('');
  const [dataAvailabilityMap, setDataAvailabilityMap] = useState('');
  const [mapQualityPlots, setMapQualityPlots] = useState('');

  const handleRadioChange = (event) => {
    const newBasin = event.target.value;
    setSelectedBasin(newBasin);
    setSelectedChemical('');
    if (selectedChemical) {
      updateImages(newBasin, selectedChemical);
    }
  };

  const handleChemicalChange = (event) => {
    const newChemical = event.target.value;
    setSelectedChemical(newChemical);
    if (selectedBasin) {
      updateImages(selectedBasin, newChemical);
    }
  };

  const updateImages = (basin, chemical) => {
    const basePath = 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Water_Quality/DataAvailability_Maps_Basinwise_WQ';
    const mapPath = 'https://storage.googleapis.com/miz_hydrology/Frontend_Data/Water_Quality/Water_Quality_Plots';
    setDataAvailabilityMap(`${basePath}/${basin}/${chemical.toLowerCase()}.PNG`);
    setMapQualityPlots(`${mapPath}/${basin} Basin/${chemical}.jpeg`);
  };

  const chemicals = [
    "Ammonia", "Nitrate", "Nitrite", "Nitrogen",
    "Organic Nitrogen", "Phosphate", "Phosphorus", "Suspended Solids"
  ];

  const basins = [
    'Arkansas', 'Lower Mississippi', 'Missouri',
    'Ohio', 'Tennessee', 'Upper Mississippi'
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start py-6 px-4">
      <div className="w-full max-w-10xl border border-gray-200 rounded-2xl shadow-md overflow-hidden bg-white flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-blue-500">Water</span> Quality
            </h1>
          </div>
        </div>

        <div className="px-4 py-4 bg-gray-50">
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            Observing and modeling water quality in streams within the Mississippi River 
            Basin (MRB) is pivotal to environmental health, economic stability, and public 
            well-being. The MRB is a vast watershed, over 1,245,000 square miles in size, 
            that drains 31 U.S. states and 2 Canadian provinces and plays a critical role 
            in the agricultural, industrial, and residential sectors of North America. 
            Consequently, the quality of its water resources impacts a wide array of ecological 
            systems and human activities.
          </p>
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            Commonly occurring pollutants in the MRB such as Total Nitrogen 
            (ammonia, nitrate, nitrite, organic nitrogen), phosphate, and phosphorus 
            originate from agricultural runoff, industrial discharges, and urban wastewater. 
            Agricultural activities, especially, contribute significantly to the nitrogen and 
            phosphorus loads in the water. These nutrients, while essential for crop growth, 
            can lead to eutrophication when they enter aquatic ecosystems in large quantities, 
            resulting in harmful algal blooms that deplete oxygen in water bodies, killing fish 
            and other aquatic life.
          </p>
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            The importance of data availability cannot be overstated in the context of 
            water quality observation and modeling. Reliable and comprehensive data allow 
            for accurate assessment of current water quality conditions, identification of 
            pollution sources, and the formulation of effective management strategies. 
            Moreover, data-driven models are essential tools for predicting future water 
            quality scenarios under different land and water management practices and 
            climate conditions, enabling decision-makers to implement proactive measures 
            to protect water resources.
          </p>
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            Local, state, and federal policies play a pivotal role in managing water 
            quality in the MRB. Policies such as the Clean Water Act in the United States 
            establish the regulatory framework for reducing pollution through the setting 
            of water quality standards and the issuance of permits for discharges. However,
            the effectiveness of these policies is heavily dependent on their enforcement 
            and the collaboration between different levels of government and the private sector. 
            Programs and initiatives at the state and local levels, tailored to the specific 
            conditions and needs of the Basin's sub-watersheds, complement federal regulations and are 
            essential for the integrated management of water resources.
          </p>
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            In summary, the observation and modeling of water quality in the Mississippi 
            River Basin are fundamental to understanding and mitigating the impacts of 
            pollutants on this critical waterway. Through comprehensive data collection and 
            analysis, coupled with strong and enforceable policies at all levels of government, 
            it is possible to protect and improve the water quality of the Basin, safeguarding it
            for future generations while supporting the economic activities that depend on it.
          </p>
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            <a
              href="https://storage.googleapis.com/miz_hydrology/Frontend_Data/Water_Quality/Water_Quality_Data_Availability.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Water Quality Data Availability in Mississippi River Basin (PDF)
            </a>
          </p>
        </div>

        {/* Map and Selection Section */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px] pb-4 sm:pb-8">
          {/* Map Image */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
              <img
                src="https://storage.googleapis.com/miz_hydrology/Frontend_Data/Water_Quality/Mississippi_river_basin_map_2.png"
                alt="Mississippi River Basin Map"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Selection Controls */}
          <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200/80 flex flex-col shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200/80 bg-gray-50/50">
              <h2 className="text-lg font-medium text-gray-900">Selection Controls</h2>
            </div>
            <div className="p-6 space-y-6">
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" className="text-lg font-medium mb-2 text-gray-900">
                  Select Basin
                </FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <RadioGroup
                    value={selectedBasin}
                    onChange={handleRadioChange}
                    className="space-y-2"
                  >
                    {basins.slice(0, 3).map((basin, idx) => (
                      <FormControlLabel 
                        key={idx} 
                        value={basin} 
                        control={
                          <Radio 
                            sx={{
                              color: '#3B82F6',
                              '&.Mui-checked': {
                                color: '#2563EB',
                              },
                            }}
                          />
                        } 
                        label={
                          <span className="text-gray-700 font-medium">
                            {basin}
                          </span>
                        }
                        className="hover:bg-gray-50 rounded-lg p-2 transition-colors duration-150"
                      />
                    ))}
                  </RadioGroup>
                  <RadioGroup
                    value={selectedBasin}
                    onChange={handleRadioChange}
                    className="space-y-2"
                  >
                    {basins.slice(3).map((basin, idx) => (
                      <FormControlLabel 
                        key={idx + 3} 
                        value={basin} 
                        control={
                          <Radio 
                            sx={{
                              color: '#3B82F6',
                              '&.Mui-checked': {
                                color: '#2563EB',
                              },
                            }}
                          />
                        } 
                        label={
                          <span className="text-gray-700 font-medium">
                            {basin}
                          </span>
                        }
                        className="hover:bg-gray-50 rounded-lg p-2 transition-colors duration-150"
                      />
                    ))}
                  </RadioGroup>
                </div>
              </FormControl>

              {selectedBasin && (
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" className="text-lg font-medium mb-2 text-gray-900">
                    Select Chemical
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <RadioGroup
                      value={selectedChemical}
                      onChange={handleChemicalChange}
                      className="space-y-2"
                    >
                      {chemicals.slice(0, 4).map((chem, idx) => (
                        <FormControlLabel 
                          key={idx} 
                          value={chem} 
                          control={
                            <Radio 
                              sx={{
                                color: '#3B82F6',
                                '&.Mui-checked': {
                                  color: '#2563EB',
                                },
                              }}
                            />
                          } 
                          label={
                            <span className="text-gray-700 font-medium">
                              {chem}
                            </span>
                          }
                          className="hover:bg-gray-50 rounded-lg p-2 transition-colors duration-150"
                        />
                      ))}
                    </RadioGroup>
                    <RadioGroup
                      value={selectedChemical}
                      onChange={handleChemicalChange}
                      className="space-y-2"
                    >
                      {chemicals.slice(4).map((chem, idx) => (
                        <FormControlLabel 
                          key={idx + 4} 
                          value={chem} 
                          control={
                            <Radio 
                              sx={{
                                color: '#3B82F6',
                                '&.Mui-checked': {
                                  color: '#2563EB',
                                },
                              }}
                            />
                          } 
                          label={
                            <span className="text-gray-700 font-medium">
                              {chem}
                            </span>
                          }
                          className="hover:bg-gray-50 rounded-lg p-2 transition-colors duration-150"
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </FormControl>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {selectedBasin && selectedChemical && (
          <div className="space-y-6 p-6">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Data Availability Map for {selectedChemical} in {selectedBasin} Basin
              </h3>
              <img
                src={dataAvailabilityMap}
                alt="Data Availability Map"
                className="w-full max-w-3xl mx-auto border-4 border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Quality Plots for {selectedChemical} in {selectedBasin} Basin
              </h3>
              <img
                src={mapQualityPlots}
                alt="Water Quality Plot"
                className="w-full max-w-3xl mx-auto border-4 border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterQuality;