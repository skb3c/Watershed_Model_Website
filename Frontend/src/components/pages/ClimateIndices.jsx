import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { ThreeDots } from 'react-loader-spinner';
import 'react-datepicker/dist/react-datepicker.css';
import Plot from 'react-plotly.js';
import '../../assets/css/action-buttons.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../../assets/css/Climate_Indicies_Content.css';

const MapContent = React.memo(function MapContent() {
  const map = useMap();
  useEffect(() => {
    if (map) map.setView([38.5, -92.5], 6);
  }, [map]);
  return null;
});

const convertToDMS = (decimal, isLatitude) => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLatitude ? (decimal >= 0 ? "North" : "South") : (decimal >= 0 ? "East" : "West");
  return `${degrees}°${minutes}'${seconds}" ${direction}`;
};

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

const CheckboxPanel = React.memo(function CheckboxPanel({ selectedCheckboxes, handleCheckboxChange, handleButtonClick, handleClearClick, loading, renderErrorMessage, showErrorMessage }) {
  const checkboxTooltips = {
    SDII: 'Simple Precipitation Intensity Index',
    RX5: 'Maximum 5-day Precipitation',
    RR1: 'Number of Rainy Days with Precipitation >= 1mm',
    RX1: 'Maximum 1-day Precipitation',
    R10: 'Annual count of days when precipitation is greater than or equal to 10mm',
    R20: 'Annual count of days when precipitation is greater than or equal to 20mm',
    PRCPTOT: 'Total Precipitation',
    CDD: 'Maximum number of consecutive days with less than 1mm of precipitation per day',
    CWD: 'Maximum number of consecutive days with more than or equal to 1mm of precipitation per day'
  };

  return (
    <div className="h-full bg-white rounded-xl shadow-lg p-6">
      <h4 className="text-lg font-semibold text-gray-700 mb-4">Select at most three variables:</h4>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(checkboxTooltips).map(([key, label]) => (
          <label 
            key={key} 
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer group border border-gray-100"
          >
            <input
              type="checkbox"
              checked={selectedCheckboxes[key] || false}
              onChange={() => handleCheckboxChange(key)}
              className="rounded text-blue-600 border-gray-300 focus:ring-blue-500 h-4 w-4"
            />
            <span 
              className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-150 cursor-help"
              title={label}
            >
              {key}
            </span>
          </label>
        ))}
      </div>

      <div className="action-buttons-container">
        <button 
          onClick={handleButtonClick} 
          className="action-button action-button-primary"
        >
          Send Data
        </button>
        <button 
          onClick={handleClearClick} 
          className="action-button action-button-danger"
        >
          Clear
        </button>
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <ThreeDots color="rgba(59, 130, 246, 0.5)" height={80} width={80} />
        </div>
      )}

      {renderErrorMessage && (
        <div className="text-red-600 text-sm mt-4 border border-red-300 rounded-lg p-3 bg-red-50 shadow-sm">
          {showErrorMessage}
        </div>
      )}
    </div>
  );
});

function ClimateIndices() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({
    SDII: false,
    RX5: false,
    RR1: false,
    RX1: false,
    R10: false,
    R20: false,
    PRCPTOT: false,
    CDD: false,
    CWD: false
  });
  const [loading, setLoading] = useState(false);
  const [renderErrorMessage, setRenderErrorMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const highlightedLayerRef = useRef(null);
  const mapRef = useRef(null);

  const geoJSONStyle = useMemo(() => ({
    color: 'rgba(255, 0, 0, 0.3)',
    weight: 1,
    opacity: 0.3,
    fillColor: 'red',
    fillOpacity: 0.05
  }), []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('https://storage.googleapis.com/miz_hydrology/Frontend_Data/Agricultural_Water/NLDAS_land_pixels.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch GeoJSON');
        const data = await response.json();
        if (isMounted) setGeojsonData(data);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    };
    fetchGeoJSON();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const onEachFeature = useCallback((feature, layer) => {
    layer.on({
      click: (e) => {
        const enriched = { ...feature.properties, Lat: e.latlng.lat, Long_: e.latlng.lng };
        setSelectedFeature(enriched);
        setClickedLatLng(e.latlng);
        if (highlightedLayerRef.current?.setStyle) highlightedLayerRef.current.setStyle(geoJSONStyle);
        layer.setStyle({ color: 'red', weight: 4, opacity: 1, fillOpacity: 0.3 });
        highlightedLayerRef.current = layer;
        mapRef.current?.flyTo(e.latlng, mapRef.current.getZoom(), { animate: true, duration: 1.5 });
      }
    });
  }, [geoJSONStyle]);

  const handleCheckboxChange = (name) => {
    const numSelected = Object.values(selectedCheckboxes).filter(checkbox => checkbox).length;
    if (!selectedCheckboxes[name] && numSelected < 3) {
      setSelectedCheckboxes(prevState => ({
        ...prevState,
        [name]: true
      }));
    } else if (selectedCheckboxes[name]) {
      setSelectedCheckboxes(prevState => ({
        ...prevState,
        [name]: false
      }));
    }
  };

  const handleButtonClick = async () => {
    setGraphData(null);
    const areAnySelected = Object.values(selectedCheckboxes).some((checkbox) => checkbox);
    if(areAnySelected){
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'uid': '01',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            latitude: selectedFeature.Lat.toString(),
            longitude: selectedFeature.Long_.toString(),
            ...selectedCheckboxes
          })
        };
        const response = await fetch("http://127.0.0.1:5000/api/Climate_Indices_Visualization", requestOptions);
        const responseData = await response.json();
        
        if(!responseData.error){
          console.log("responseData",responseData);
          setGraphData(responseData);
        } else {
          throw new Error(responseData.errorMessage);
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
    } else {
      setRenderErrorMessage(true);
      setShowErrorMessage("Select any of the above checkboxes");
      setTimeout(() => {
        setRenderErrorMessage(false);
        setShowErrorMessage("");
      }, 5000);
    }
  };

  const handleClearClick = () => {
    setSelectedFeature(null);
    setSelectedCheckboxes({
      SDII: false,
      RX5: false,
      RR1: false,
      RX1: false,
      R10: false,
      R20: false,
      PRCPTOT: false,
      CDD: false,
      CWD: false
    });
    setGraphData(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start py-4 sm:py-6 px-2 sm:px-4">
      <div className="w-full max-w-[1400px] border border-gray-200 rounded-xl sm:rounded-2xl shadow-md overflow-hidden bg-white flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
          <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
              <span className="text-blue-500">Climate</span> Indices
            </h1>
          </div>
        </div>

        <div className="px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 w-full">
          <p className="text-sm sm:text-base text-gray-700 mb-2">
          Climate indices are quantitative, standardized measures derived from climate data to represent key features of the climate system over a specified period. These indices can capture the behavior of temperature, precipitation, atmospheric pressure patterns, oceanic conditions, and other climatic variables. They are used to monitor climate variability, identify climate change trends, and assess the potential impacts of climate anomalies on various sectors, including water sustainability. Hover over indices to view the description. Select and area and up to 5 parameters to view the yearly variations since 1980. For more information on climate indices, click here (link to Atanas paper).
</p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px]">
          <div className="relative lg:w-2/3">
            <MapContainer
              center={[38.5, -92.5]}
              zoom={6}
              className="h-full w-full"
              zoomControl={false}
              whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
            >
              <MapContent />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {geojsonData && <GeoJSON data={geojsonData} style={geoJSONStyle} onEachFeature={onEachFeature} />} 
              {clickedLatLng && (
                <Marker position={clickedLatLng} icon={L.icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                  <Popup>Selected Location</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <div className="w-full lg:w-1/3 p-4">
            <CheckboxPanel
              selectedCheckboxes={selectedCheckboxes}
              handleCheckboxChange={handleCheckboxChange}
              handleButtonClick={handleButtonClick}
              handleClearClick={handleClearClick}
              loading={loading}
              renderErrorMessage={renderErrorMessage}
              showErrorMessage={showErrorMessage}
            />
          </div>
        </div>

        <div className="w-full p-4">
          <FeatureTable data={selectedFeature} />
        </div>

        {graphData && (
          <div className="w-full p-4 space-y-4">
            {Object.entries(graphData.images).map(([key, imageData]) => (
              <div key={key} className="w-full bg-white shadow-md rounded-lg p-3 sm:p-4 min-h-[400px] sm:min-h-[500px]">
                <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-black">
                  {key.replace('_image', '')} at Selected Location
                </h3>
                <Plot
                  data={JSON.parse(imageData).data}
                  layout={JSON.parse(imageData).layout}
                  className="w-full h-full"
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ClimateIndices); 