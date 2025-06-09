import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import Plot from 'react-plotly.js';
import '../../assets/css/button-group.css'
import '../../assets/css/action-buttons.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MapContent() {
  const map = useMap();
  useEffect(() => {
    if (map) map.setView([38.5, -92.5], 6);
  }, [map]);
  return null;
}

function useProcessedGeoJSON(data, type) {
  return useMemo(() => {
    if (!data) return null;
    const simplified = turf.simplify(data, {
      tolerance: 0.0001,
      highQuality: true
    });
    return {
      ...simplified,
      features: simplified.features.map(f => ({
        ...f,
        properties: {
          ...f.properties,
          type: type
        }
      }))
    };
  }, [data, type]);
}

function ToggleButton({ activeLayer, onChange }) {
  return (
    <div className="button-group-container">
  <button
    className={`button-group-button ${
      activeLayer === 'watershed' ? 'active-watershed' : ''
    }`}
    onClick={() => onChange('watershed')}
  >
    Watersheds
  </button>
  <button
    className={`button-group-button ${
      activeLayer === 'stream' ? 'active-stream' : ''
    }`}
    onClick={() => onChange('stream')}
  >
    Streamflow
  </button>
</div>
  );
}

function convertToDMS(decimal, isLat = true) {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  const direction = isLat
    ? decimal >= 0 ? 'N' : 'S'
    : decimal >= 0 ? 'E' : 'W';

  return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

function FeatureTable({ data }) {
  const polygonDisplay = {
    Lat: 'Latitude',
    Long_: 'Longitude',
    Subbasin: 'Subbasin Id',
    Area: 'Area'
  };

  const streamNetworkDisplay = {
    Lat: 'Latitude',
    Long_: 'Longitude',
    Subbasin: 'Subbasin Id',
    from_node: 'From Node',
    to_node: 'To Node',
    AreaC: 'Area'
  };

  if (!data) return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center space-y-4 p-8">
        
        <h3 className="text-lg font-semibold text-gray-700">No Feature Selected</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Click on a feature in the map to view its detailed information
        </p>
      </div>
    </div>
  );

  const displayData = data.type === 'watershed'
  ? Object.entries(polygonDisplay).reduce((acc, [key, label]) => {
      if (data[key] !== undefined) {
        acc[label] = data[key];
      }
      return acc;
    }, {})
  : data.type === 'stream'
  ? Object.entries(streamNetworkDisplay).reduce((acc, [key, label]) => {
      if (key === 'Lat' && data.clickLat !== undefined) {
        acc[label] = Number(data.clickLat);
      } else if (key === 'Long_' && data.clickLng !== undefined) {
        acc[label] = Number(data.clickLng);
      } else if (data[key] !== undefined) {
        acc[label] = data[key];
      }
      return acc;
    }, {})
  : Object.entries(data)
      .filter(([key]) => key !== 'type')
      .reduce((acc, [key, value]) => {
        const formattedKey = key.replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        acc[formattedKey] = value;
        return acc;
      }, {});

return (
  <div className="h-full">
    <div className="bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-100 sticky top-0 shadow-sm z-10">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
            <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Value</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(displayData).map(([key, value], index) => (
            <tr key={key} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{key}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {(() => {
                  if (key === 'Latitude') return convertToDMS(value, true);
                  if (key === 'Longitude') return convertToDMS(value, false);
                  return typeof value === 'number' ? value.toLocaleString() : value;
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}


// Define formatDate function
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

function Hydrology() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [selectedLayerType, setSelectedLayerType] = useState(null);
  const [activeLayer, setActiveLayer] = useState('watershed');
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState("2019-12-31");

  const [graphData, setGraphData] = useState(null);
  const [boundary, setBoundary] = useState(null);
  const [inlet, setInlet] = useState(null);
  const [watershed, setWatershed] = useState(null);
  const [streamnetwork, setStreamnetwork] = useState(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_APP_GCS_BASE_URL;
    console.log("link",baseUrl);
    const fetchData = async () => {
      try {
        const boundaryResponse = await fetch(`${baseUrl}/Mo_Hydrology/Missouri_water_model_boundary.json`);
        const boundaryData = await boundaryResponse.json();
        setBoundary(boundaryData);

        const inletResponse = await fetch(`${baseUrl}/Mo_Hydrology/Missouri_water_model_inlet_of_rivers.json`);
        const inletData = await inletResponse.json();
        setInlet(inletData);

        const watershedResponse = await fetch(`${baseUrl}/Mo_Hydrology/watersheds_4086.json`);
        const watershedData = await watershedResponse.json();
        setWatershed(watershedData);

        const streamnetworkResponse = await fetch(`${baseUrl}/Mo_Hydrology/stream_network_4086.json`);
        const streamnetworkData = await streamnetworkResponse.json();
        setStreamnetwork(streamnetworkData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processedWatersheds = useProcessedGeoJSON(watershed, 'watershed');
  const processedBoundary = useProcessedGeoJSON(boundary, 'boundary');
  const processedInlets = useProcessedGeoJSON(inlet, 'inlet');
  const processedStreams = useProcessedGeoJSON(streamnetwork, 'stream');

  const getStyle = (feature) => {
    const type = feature.properties?.type;
    const id = feature.properties?.Subbasin ?? feature.properties?.OBJECTID;
    const isSelected = selectedLayerId === id && selectedLayerType === type;

    const baseStyle = {
      watershed: {
        color: '#3388ff',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.2,
        fillColor: '#3388ff'
      },
      boundary: {
        color: '#ff0000',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10',
        fillOpacity: 0
      },
      inlet: {
        color: '#00ff00',
        weight: 2,
        opacity: 0.7,
        radius: 6
      },
      stream: {
        color: '#0000ff',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0
      }
    };

    const style = baseStyle[type] || baseStyle.watershed;

    if (isSelected) {
      return {
        ...style,
        weight: type === 'stream' ? 4 : 3,
        color: '#ff6b6b',
        opacity: 1,
        fillOpacity: type === 'watershed' ? 0.4 : style.fillOpacity,
        fillColor: '#ff6b6b'
      };
    }

    return style;
  };

  const resetSelection = () => {
    setSelectedFeature(null);
    setSelectedLayerId(null);
    setSelectedLayerType(null);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        const featureId = feature.properties?.Subbasin ?? feature.properties?.OBJECTID;
        const featureType = feature.properties.type;

        if (featureType !== activeLayer) return;

        if (selectedLayerId === featureId && selectedLayerType === featureType) {
          resetSelection();
        } else {
          const properties = {
            ...feature.properties,
            clickLat: e.latlng.lat,
            clickLng: e.latlng.lng
          };
          setSelectedFeature(properties);
          setSelectedLayerId(featureId);
          setSelectedLayerType(featureType);
        }
      }
    });
  };

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    resetSelection();
  };

  const handleButtonClick = () => {
    if (selectedFeature && startDate && endDate) {
      let formatted_startdate = formatDate(startDate);
      let formatted_enddate = formatDate(endDate);
      const subbasinId = selectedFeature.Subbasin;
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'uid': '01' },
            body: JSON.stringify({ basinId: subbasinId.toString(), startDate: formatted_startdate, endDate: formatted_enddate })
          };
          const response = await fetch("http://127.0.0.1:5000/api/stream_flow_visualization", requestOptions);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          if (response.status === 200) {
            const data = await response.json();
            console.log("data",data);
            setGraphData(data);
          }
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      }
      fetchData();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start py-6 px-4">
      <div className="w-full max-w-10xl border border-gray-200 rounded-2xl shadow-md overflow-hidden bg-white flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
      <span className="text-blue-500">MO</span> Hydrology
      <sup className="text-sm text-gray-700 font-medium align-super">(under development)</sup>

    </h1>
  </div>
</div>

        <div className="px-4 py-4 bg-gray-50">
      <p className="text-gray-700 mb-2">
  The Missouri River Basin Model provides historical and projected streamflow forecasts from 2000 to 2019 (note: this will include forecasts in the future with an updated date range). The hydrological model was developed using the Soil and Water Assessment Toolkit (SWAT). This product is updated daily. 
  <a href="link_to_publication" className="text-blue-500 underline"> Read here for more information on our model development</a>. 
  Select a location and a date range to view the interactive hydrograph information. <span className="font-medium text-gray-800">We are currently awaiting official publication.</span>
</p>

      </div>

        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 flex lg:flex-row flex-col min-h-[600px] pb-20">
            <div className="relative flex-1 min-h-[400px] lg:min-h-0">
              <div className="absolute inset-0">
                <MapContainer 
                  center={[38.5, -92.5]} 
                  zoom={6} 
                  className="h-full w-full rounded-none"
                  zoomControl={false}
                >
                  <MapContent />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <ToggleButton activeLayer={activeLayer} onChange={handleLayerChange} />

                  {processedBoundary && (
                    <GeoJSON data={processedBoundary} style={getStyle} onEachFeature={onEachFeature} />
                  )}
                  {processedInlets && (
                    <GeoJSON data={processedInlets} style={getStyle} onEachFeature={onEachFeature} />
                  )}
                  {activeLayer === 'stream' && processedStreams && (
                    <GeoJSON data={processedStreams} style={getStyle} onEachFeature={onEachFeature} />
                  )}
                  {activeLayer === 'watershed' && processedWatersheds && (
                    <GeoJSON data={processedWatersheds} style={getStyle} onEachFeature={onEachFeature} />
                  )}
                </MapContainer>
              </div>
            </div>

            <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm border-l border-gray-200/80 flex flex-col shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200/80 bg-gray-50/50">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedFeature
                    ? `${selectedLayerType.charAt(0).toUpperCase() + selectedLayerType.slice(1)} Details`
                    : 'Feature Details'}
                </h2>
              </div>
              <div className="flex-1">
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Start and End Dates:</label>
                  <div className="flex items-center space-x-2 mt-2">
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    min="2000-01-01"
    max="2019-12-31"
    className="border border-gray-300 rounded-md p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
  <span className="text-gray-500">→</span>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    min="2000-01-01"
    max="2019-12-31"
    className="border border-gray-300 rounded-md p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>
      <div className="action-buttons-container">
            <button
              onClick={handleButtonClick}
              className="action-button action-button-primary"
              disabled
            >
              Send Data
            </button>
            <button
              onClick={resetSelection}
              className="action-button action-button-danger"
              disabled
            >
              Clear
            </button>
          </div>

                </div>
                <FeatureTable data={selectedFeature} />
              </div>
            </div>
          </div>
          {graphData && graphData.image && (
            <div className="w-full bg-white shadow-md rounded-lg mt-4 p-4 min-h-[500px]">
              <h3 className="text-xl font-bold text-center mb-4 text-black">Daily Stream Flow at Location ID: {JSON.parse(graphData.basinId)}</h3>
              <Plot
                data={JSON.parse(graphData.image).data}
                layout={JSON.parse(graphData.image).layout}
                className="w-full h-full"
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hydrology;
