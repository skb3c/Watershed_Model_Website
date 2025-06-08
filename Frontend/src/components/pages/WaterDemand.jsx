import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import Plot from 'react-plotly.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ThreeDots } from 'react-loader-spinner';
import '../../assets/css/action-buttons.css'

// Memoize MapContent component
const MapContent = React.memo(function MapContent() {
  const map = useMap();
  useEffect(() => {
    if (map) map.setView([38.5, -92.5], 6);
  }, [map]);
  return null;
});

// Memoize convertToDMS function
const convertToDMS = (decimal, isLatitude) => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  const direction = isLatitude
    ? decimal >= 0 ? "North" : "South"
    : decimal >= 0 ? "East" : "West";

  return `${degrees}°${minutes}'${seconds}" ${direction}`;
};

// Memoize FeatureTable component
const FeatureTable = React.memo(function FeatureTable({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 p-8">
          <h3 className="text-lg font-semibold text-gray-700">No Feature Selected</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Click on a feature in the map to view its detailed information
          </p>
        </div>
      </div>
    );
  }

  const fieldsToShow = {
    Lat: 'Latitude',
    Long_: 'Longitude',
  };

  const filteredEntries = useMemo(() => 
    Object.entries(fieldsToShow)
      .filter(([key]) => data[key] !== undefined)
      .map(([key, label]) => {
        let value = data[key];
        if (key === 'Lat') {
          value = convertToDMS(value, true);
        } else if (key === 'Long_') {
          value = convertToDMS(value, false);
        }
        return [label, value];
      }), [data]);

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-xl font-bold text-white">Feature Details</h2>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map(([label, value], index) => (
                <tr key={label} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{label}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

function WaterDemand() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [startDate, setStartDate] = useState(new Date(2017, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2021, 0, 1));
  const [graphData, setGraphData] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renderErrorMessage, setRenderErrorMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const [isCurrentGrowingSeason, setIsCurrentGrowingSeason] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({
    precipitation: false,
    vaporPressure: false,
    temperature: false,
  });
  const highlightedLayerRef = useRef(null);
  const mapRef = useRef(null);

  const minDate = new Date(2017, 0, 1);
  const maxDate = new Date(2021, 12, 1);
  const years = [2017, 2018, 2019, 2020, 2021];

  // Memoize the GeoJSON style
  const geoJSONStyle = useMemo(() => ({
    color: 'rgba(255, 0, 0, 0.3)',
    weight: 1,
    opacity: 0.3,
    fillColor: 'red',
    fillOpacity: 0.05
  }), []);

  // Memoize the parameters array
  const parameters = useMemo(() => [
    { name: "precipitation", label: "Precipitation" },
    { name: "vaporPressure", label: "Vapor Pressure" },
    { name: "temperature", label: "Temperature" },
    {name: "Crop Water Demand", label: "Crop Water Demand" },
    {name: "potential Evapotranspiration", label: "Potential Evapotranspiration" },
  ], []);

  // Optimize GeoJSON fetch
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('https://storage.googleapis.com/miz_hydrology/Frontend_Data/Agricultural_Water/NLDAS_land_pixels.json', {
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Failed to fetch GeoJSON data');
        const data = await response.json();
        if (isMounted) setGeojsonData(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching GeoJSON:', error);
        }
      }
    };

    fetchGeoJSON();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Optimize growing season effect
  useEffect(() => {
    if (isCurrentGrowingSeason && selectedYear !== '') {
      const newStartDate = new Date(selectedYear, 4, 1);
      const newEndDate = new Date(selectedYear, 8, 30);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    } else {
      setStartDate(new Date(2017, 0, 1));
      setEndDate(new Date(2019, 0, 1));
    }
  }, [isCurrentGrowingSeason, selectedYear]);

  // Optimize feature click handler
  const onEachFeature = useCallback((feature, layer) => {
    layer.on({
      click: (e) => {
        const enrichedProperties = {
          ...feature.properties,
          Lat: e.latlng.lat,
          Long_: e.latlng.lng,
          CENTERY: e.latlng.lat,
          CENTERX: e.latlng.lng
        };
        setSelectedFeature(enrichedProperties);
        setClickedLatLng(e.latlng);

        if (highlightedLayerRef.current && highlightedLayerRef.current.setStyle) {
          highlightedLayerRef.current.setStyle(geoJSONStyle);
        }

        layer.setStyle({
          color: 'red',
          weight: 4,
          opacity: 1,
          dashArray: '',
          fillOpacity: 0.3
        });

        highlightedLayerRef.current = layer;
        mapRef.current?.flyTo(e.latlng, mapRef.current.getZoom(), {
          animate: true,
          duration: 1.5
        });
      }
    });
  }, [geoJSONStyle]);

  // Optimize checkbox handler
  const handleCheckboxChange = useCallback((event) => {
    const { name, checked } = event.target;
    if (name === "currentGrowingSeason") {
      setIsCurrentGrowingSeason(checked);
      if (checked) {
        setStartDate(new Date(2021, 0, 1));
        setEndDate(new Date(2021, 5, 30));
      } else {
        setStartDate(new Date(2017, 0, 1));
        setEndDate(new Date(2019, 0, 1));
      }
    } else {
      setSelectedCheckboxes(prev => ({
        ...prev,
        [name]: checked,
      }));
    }
  }, []);

  // Optimize year change handler
  const handleYearChange = useCallback((event) => {
    setSelectedYear(event.target.value);
  }, []);

  // Optimize date formatter
  const formatDate = useCallback((date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
  }, []);

  // Optimize button click handler
  const handleButtonClick = useCallback(async () => {
    setGraphData(null);
    const areAnySelected = Object.values(selectedCheckboxes).some((checkbox) => checkbox);

    if (selectedFeature && startDate && endDate && areAnySelected) {
      setLoading(true);

      let formatted_startdate = formatDate(startDate);
      let formatted_enddate = formatDate(endDate);
      const lat = selectedFeature.CENTERY;
      const long = selectedFeature.CENTERX;

      try {
        const apiCalls = [];
        const baseRequestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'uid': '01' },
          body: JSON.stringify({ 
            latitude: lat.toString(), 
            longitude: long.toString(), 
            startDate: formatted_startdate, 
            endDate: formatted_enddate 
          })
        };

        const endpoints = {
          precipitation: "http://127.0.0.1:5000/api/precipitation_visualization",
          vaporPressure: "http://127.0.0.1:5000/api/evapotranspiration_visualization",
          temperature: "http://127.0.0.1:5000/api/temperature_visualization"
        };

        Object.entries(selectedCheckboxes).forEach(([key, value]) => {
          if (value && endpoints[key]) {
            apiCalls.push(fetch(endpoints[key], baseRequestOptions));
          }
        });

        const responses = await Promise.all(apiCalls);
        const responseData = await Promise.all(
          responses.map(response => response.json())
        );

        const validData = responseData.filter(data => !data.error);
        if (validData.length > 0) {
          setGraphData(validData);
        } else {
          throw new Error('No valid data received');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setRenderErrorMessage(true);
        setShowErrorMessage(error.toString());
        setTimeout(() => {
          setRenderErrorMessage(false);
          setShowErrorMessage("");
        }, 5000);
      } finally {
        setLoading(false);
      }
    } else if (!areAnySelected) {
      setRenderErrorMessage(true);
      setShowErrorMessage("Select any of the above checkboxes");
      setTimeout(() => {
        setRenderErrorMessage(false);
        setShowErrorMessage("");
      }, 5000);
    }
  }, [selectedFeature, startDate, endDate, selectedCheckboxes, formatDate]);

  // Optimize reset handler
  const resetSelection = useCallback(() => {
    setSelectedFeature(null);
    setClickedLatLng(null);
    setStartDate(new Date(2017, 0, 1));
    setEndDate(new Date(2021, 0, 1));
    setGraphData(null);
    setSelectedCheckboxes({
      precipitation: false,
      vaporPressure: false,
      temperature: false,
    });
    setIsCurrentGrowingSeason(false);
    setSelectedYear('');
    if (highlightedLayerRef.current && highlightedLayerRef.current.setStyle) {
      highlightedLayerRef.current.setStyle(geoJSONStyle);
    }
  }, [geoJSONStyle]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start py-4 sm:py-6 px-2 sm:px-4">
      <div className="w-full max-w-[1400px] border border-gray-200 rounded-xl sm:rounded-2xl shadow-md overflow-hidden bg-white flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
          <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
              <span className="text-blue-500">Water</span> Demand
              <sup className="text-sm text-gray-700 font-medium align-super">(under development)</sup>
            </h1>
          </div>
        </div>

        <div className="px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 w-full">
          <p className="text-sm sm:text-base text-gray-700 mb-2">
          Temperature, vapor pressure, and precipitation are interconnected factors that determine the water needs of agricultural systems. Understanding and managing these factors are crucial for optimizing water use in agriculture, enhancing crop yields, and ensuring water sustainability. Select a land area of interest, and a date range, to see trends in precipitation, vapor pressure, and/or temperature in our interactive graphs. <span className="font-medium text-gray-800">More Information Coming Soon.</span>
          </p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px] pb-4 sm:pb-8">
          <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-0">
            <div className="absolute inset-0">
              <MapContainer 
                center={[38.5, -92.5]}
                zoom={6}
                className="h-full w-full rounded-none"
                zoomControl={false}
                zoomAnimation={true}         // Smooth zoom animation
                zoomAnimationDuration={0.7}  // Optional: makes the zoom transition slower
                fadeAnimation={true}         // Enables tile fade
                markerZoomAnimation={true}   // Marker animation while zooming
                preferCanvas={false}         // Use SVG for better rendering
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
              
              >
                <MapContent />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {geojsonData && (
                  <GeoJSON 
                    data={geojsonData} 
                    style={geoJSONStyle}
                    onEachFeature={onEachFeature}
                  />
                )}

                {clickedLatLng && (
                  <Marker 
                    position={clickedLatLng} 
                    icon={L.icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
                  >
                    <Popup>Selected Location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          <div className="w-full lg:max-w-[400px] bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200/80 flex flex-col shadow-lg">
  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/80 bg-gray-50/50">
    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Feature Details</h2>
  </div>

  <div className="flex-1 p-4 space-y-5">
    {selectedFeature && (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-5">
        {/* Date Picker Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Start and End Dates:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <DatePicker
    selected={startDate}
    onChange={(date) => setStartDate(date)}
    selectsStart
    startDate={startDate}
    endDate={endDate}
    minDate={minDate}
    maxDate={maxDate}
    className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
    placeholderText="Start Date"
  />
  <DatePicker
    selected={endDate}
    onChange={(date) => setEndDate(date)}
    selectsEnd
    startDate={startDate}
    endDate={endDate}
    minDate={minDate}
    maxDate={maxDate}
    className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
    placeholderText="End Date"
  />
</div>

        </div>

        {/* Parameter Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Parameters:</label>
          <div className="space-y-2">
            {parameters.map(({ name, label }) => (
              <label key={name} className="flex items-center space-x-2 text-gray-800">
                <input
                  type="checkbox"
                  name={name}
                  checked={selectedCheckboxes[name]}
                  onChange={handleCheckboxChange}
                  className="rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Growing Season Toggle */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-800">
            <input
              type="checkbox"
              name="currentGrowingSeason"
              checked={isCurrentGrowingSeason}
              onChange={handleCheckboxChange}
              className="rounded text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span>Growing Season</span>
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            disabled={!isCurrentGrowingSeason}
            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 bg-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
              >
            <option value="">Select Year</option>
              {years.map((year) => (
            <option key={year} value={year}>{year}</option>
              ))}
</select>

        </div>

        {/* Action Buttons */}
        <div className="action-buttons-container">
          <button
            onClick={handleButtonClick}
            className="action-button action-button-primary"
          >
            Send Data
          </button>
          <button
            onClick={resetSelection}
            className="action-button action-button-danger"
          >
            Clear
          </button>
        </div>
      </div>
    )}
  </div>
          </div>

        </div>

        <div className="w-full bg-white shadow-md rounded-lg mt-2 p-3 sm:p-4 min-h-[400px] sm:min-h-[500px]">
          <FeatureTable data={selectedFeature} />
        </div>

        {loading && (
          <div className="flex justify-center items-center p-4">
            <ThreeDots color="rgba(59, 130, 246, 0.5)" height={80} width={80} />
          </div>
        )}

        {renderErrorMessage && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {showErrorMessage}
          </div>
        )}

        {graphData && graphData.map((data, index) => (
          <div key={index} className="w-full bg-white shadow-md rounded-lg mt-2 p-3 sm:p-4 min-h-[400px] sm:min-h-[500px]">
            <Plot
              data={JSON.parse(data.image).data}
              layout={JSON.parse(data.image).layout}
              className="w-full h-full"
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(WaterDemand); 