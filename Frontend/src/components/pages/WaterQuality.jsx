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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          Water Quality Data Availability
        </h1>
        <p className="text-lg text-center text-blue-100">
          Mississippi River Basin
        </p>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Water Quality Data Availability in Mississippi River Basin
        </h2>
        <div className="space-y-4 text-gray-700">
          {/* Your existing paragraphs */}
          <p>Observing and modeling water quality in streams within the Mississippi River 
                   Basin (MRB) is pivotal to environmental health, economic stability, and public 
                   well-being. The MRB is a vast watershed, over 1,245,000 square miles in size, 
                   that drains 31 U.S. states and 2 Canadian provinces and plays a critical role 
                   in the agricultural, industrial, and residential sectors of North America. 
                   Consequently, the quality of its water resources impacts a wide array of ecological 
                   systems and human activities.
                </p>
                <p>
                    Commonly occurring pollutants in the MRB such as Total Nitrogen 
                    (ammonia, nitrate, nitrite, organic nitrogen), phosphate, and phosphorus 
                    originate from agricultural runoff, industrial discharges, and urban wastewater. 
                    Agricultural activities, especially, contribute significantly to the nitrogen and 
                    phosphorus loads in the water. These nutrients, while essential for crop growth, 
                    can lead to eutrophication when they enter aquatic ecosystems in large quantities, 
                    resulting in harmful algal blooms that deplete oxygen in water bodies, killing fish 
                    and other aquatic life. 
                </p>

                <p>
                    The importance of data availability cannot be overstated in the context of 
                    water quality observation and modeling. Reliable and comprehensive data allow 
                    for accurate assessment of current water quality conditions, identification of 
                    pollution sources, and the formulation of effective management strategies. 
                    Moreover, data-driven models are essential tools for predicting future water 
                    quality scenarios under different land and water management practices and 
                    climate conditions, enabling decision-makers to implement proactive measures 
                    to protect water resources. 
                </p>

                <p>
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

                <p>
                    In summary, the observation and modeling of water quality in the Mississippi 
                    River Basin are fundamental to understanding and mitigating the impacts of 
                    pollutants on this critical waterway. Through comprehensive data collection and 
                    analysis, coupled with strong and enforceable policies at all levels of government, 
                    it is possible to protect and improve the water quality of the Basin, safeguarding it
                    for future generations while supporting the economic activities that depend on it. 
                </p>    
          <p>
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
      </div>

      {/* Map and Selection Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Map Image */}
        <div className="lg:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <img
            src="https://storage.googleapis.com/miz_hydrology/Frontend_Data/Water_Quality/Mississippi_river_basin_map_2.png"
            alt="Mississippi River Basin Map"
            className="w-full h-auto rounded border border-gray-200"
          />
        </div>

        {/* Selection Controls */}
        <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md space-y-6">
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" className="text-lg font-medium mb-2">
              Select Basin
            </FormLabel>
            <RadioGroup
              value={selectedBasin}
              onChange={handleRadioChange}
              className="grid grid-cols-2 gap-3"
            >
              {basins.map((basin, idx) => (
                <FormControlLabel 
                  key={idx} 
                  value={basin} 
                  control={<Radio />} 
                  label={basin} 
                />
              ))}
            </RadioGroup>
          </FormControl>

          {selectedBasin && (
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" className="text-lg font-medium mb-2">
                Select Chemical
              </FormLabel>
              <RadioGroup
                value={selectedChemical}
                onChange={handleChemicalChange}
                className="grid grid-cols-2 gap-3"
              >
                {chemicals.map((chem, idx) => (
                  <FormControlLabel 
                    key={idx} 
                    value={chem} 
                    control={<Radio />} 
                    label={chem} 
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        </div>
      </div>

      {/* Results Section */}
      {selectedBasin && selectedChemical && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Data Availability Map for {selectedChemical} in {selectedBasin} Basin
            </h3>
            <img
              src={dataAvailabilityMap}
              alt="Data Availability Map"
              className="w-full max-w-3xl mx-auto border-4 border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
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
  );
};

export default WaterQuality;