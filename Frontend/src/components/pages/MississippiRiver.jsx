import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import Plot from 'react-plotly.js';
import '../../assets/css/action-buttons.css'

// GCS Base URL from environment variables
const GCS_BASE_URL = import.meta.env.VITE_APP_GCS_BASE_URL;

// Define the base paths for GCS data
const GCS_BOUNDARY_PATH = 'Mississippi_Basin/sub_region_boundaries/';
const GCS_REACH_PATH = 'Mississippi_Basin/';

// Map region keys to their respective GCS filenames
const regionBoundaryFilenames = {
  arkansas: 'arkansas.json',
  lower_mississippi: 'lower_mississippi.json',
  lower_missouri: 'lower_missouri.json',
  ohio: 'ohio.json',
  tennessee: 'tennessee.json',
  upper_mississippi: 'upper_mississippi.json',
  upper_missouri: 'upper_missouri.json',
};

const regionReachFilenames = {
  arkansas: 'arkansas_reach_5285.json',
  lower_mississippi: 'lower_mississippi_reach_2675.json',
  lower_missouri: 'lower_missouri_reach_5835.json',
  ohio: 'ohio_reach_3139.json',
  tennessee: 'tennessee_reach_904.json',
  upper_mississippi: 'upper_mississippi_reach_6563.json',
  upper_missouri: 'upper_missouri_reach_6977.json',
};

const regionCenter_Coordinates = {
  arkansas: [36.06960999598668, -98.06396484375001],
  tennessee: [35.40585697862099, -85.02490864415324],
  ohio: [38.7886749295411, -83.44540899827076],
  lower_mississippi: [33.80772903151984, -90.85815742839955],
  upper_missouri: [46.19690352098946, -104.73394649787234],
  lower_missouri: [40.53269348488626, -98.68122161083134],
  upper_mississippi: [43.31057560763997, -91.68957909571034]
};

function convertToDMS(decimal, isLatitude) {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  const direction = isLatitude
    ? decimal >= 0 ? "North" : "South"
    : decimal >= 0 ? "East" : "West";

  return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

function FeatureTable({ data }) {
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
    OBJECTID: 'Object ID',
    Subbasin: 'Subbasin'
  };

  const filteredEntries = Object.entries(fieldsToShow)
    .filter(([key]) => data[key] !== undefined)
    .map(([key, label]) => {
      let value = data[key];
      if (key === 'Lat') {
        value = convertToDMS(value, true);
      } else if (key === 'Long_') {
        value = convertToDMS(value, false);
      }
      return [label, value];
    });

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
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MississippiRiver() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [boundaryData, setBoundaryData] = useState(null); // State for boundary GeoJSON for selected region
  const [allBoundaries, setAllBoundaries] = useState({}); // State for all boundary GeoJSONs
  const [reachData, setReachData] = useState(null);       // State for reach GeoJSON
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null);     // State for errors
  const highlightedLayerRef = useRef(null);
  const mapRef = useRef(null);

  const minDate = new Date(2010, 0, 1);
  const maxDate = new Date(2019, 12, 1);

  // Helper function to fetch data from GCS
  const fetchData = useCallback(async (regionKey, type) => {
    setLoading(true);
    setError(null);
    let url = '';
    if (type === 'boundary') {
      url = `${GCS_BASE_URL}/${GCS_BOUNDARY_PATH}${regionBoundaryFilenames[regionKey]}`;
    } else if (type === 'reach') {
      url = `${GCS_BASE_URL}/${GCS_REACH_PATH}${regionReachFilenames[regionKey]}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (e) {
      console.error(`Failed to fetch ${type} data for ${regionKey}:`, e);
      setError(`Failed to load ${type} data: ${e.message}`);
      setLoading(false);
      return null;
    }
  }, [GCS_BASE_URL]);

  // Fetch all boundaries on component mount
  useEffect(() => {
    const loadAllBoundaries = async () => {
      const boundariesMap = {};
      for (const regionKey of Object.keys(regionBoundaryFilenames)) {
        const data = await fetchData(regionKey, 'boundary');
        if (data) {
          boundariesMap[regionKey] = data;
        }
      }
      setAllBoundaries(boundariesMap);
    };
    loadAllBoundaries();
  }, [fetchData]);

  const handleCheckboxChange = async (regionKey) => {
    if (selectedRegion === regionKey) {
      setSelectedRegion(null);
      // setBoundaryData(null); // Boundaries will always be shown
      setReachData(null); // Clear reach data when deselected
      setSelectedFeature(null);
      setClickedLatLng(null);
      setStartDate('');
      setEndDate('');
      setGraphData(null);
      highlightedLayerRef.current = null;
      return;
    }

    setSelectedRegion(regionKey);
    setSelectedFeature(null);
    setClickedLatLng(null);
    setStartDate('');
    setEndDate('');
    setGraphData(null);

    // Fetch only reach data for the selected region
    // const boundaryGeoJSON = await fetchData(regionKey, 'boundary'); // Not needed as all boundaries are loaded
    const reachGeoJSON = await fetchData(regionKey, 'reach');

    // setBoundaryData(boundaryGeoJSON); // Not needed as all boundaries are loaded
    setReachData(reachGeoJSON);

    // Center the map on the selected region
    if (mapRef.current && regionCenter_Coordinates[regionKey]) {
      const [lat, lng] = regionCenter_Coordinates[regionKey];
      mapRef.current.setView([lat, lng], 7, {
        animate: true,
        duration: 1
      });
    }
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        const enrichedProperties = {
          ...feature.properties,
          Lat: e.latlng.lat,
          Long_: e.latlng.lng
        };
        console.log("Properties of clicked feature:", enrichedProperties);
        setSelectedFeature(enrichedProperties);
        setClickedLatLng(e.latlng);

        if (highlightedLayerRef.current && highlightedLayerRef.current.setStyle) {
          highlightedLayerRef.current.setStyle({
            color: 'blue',
            weight: 2,
            opacity: 0.7,
            dashArray: '3',
            fillOpacity: 0.1
          });
        }

        layer.setStyle({
          color: 'red',
          weight: 4,
          opacity: 1,
          dashArray: '',
          fillOpacity: 0.3
        });

        highlightedLayerRef.current = layer;
        mapRef.current?.panTo(e.latlng);
      }
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
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
            body: JSON.stringify({ 
              basinId: selectedFeature.Subbasin.toString(), 
              startDate: formatted_startdate, 
              endDate: formatted_enddate, 
              subBasinName: selectedRegion.toString() 
            })
          };
          console.log("requestOptions", requestOptions);
          const response = await fetch("http://127.0.0.1:5000/api/mississippi/stream_flow_visualization", requestOptions);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          if (response.status === 200) {
            const data = await response.json();
            console.log("data", data);
            setGraphData(data);
          }
        } catch (error) {
          console.error('Error fetching graph data:', error);
        }
      };
      fetchData();
    }
  };

  const resetSelection = () => {
    setSelectedRegion(null);
    setReachData(null);
    setSelectedFeature(null);
    setClickedLatLng(null);
    setStartDate('');
    setEndDate('');
    setGraphData(null);
    highlightedLayerRef.current = null;
  };

  const boundaryStyle = useMemo(() => ({
    color: 'rgba(0, 0, 255, 0.3)',
    weight: 2,
    opacity: 0.5,
    fillColor: 'blue',
    fillOpacity: 0.1
  }), []);

  const streamStyle = useMemo(() => ({
    color: 'rgba(0, 0, 255, 0.5)',
    weight: 3,
    opacity: 0.7
  }), []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start py-6 px-4">
      <div className="w-full max-w-10xl border border-gray-200 rounded-2xl shadow-md overflow-hidden bg-white flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-blue-500">Mississippi</span> River Basin
              <sup className="text-sm text-gray-700 font-medium align-super">(under development)</sup>

            </h1>
          </div>
        </div>
        <div className="px-6 py-6 bg-gray-50 rounded-xl shadow-sm max-w-7xl mx-auto">
  <p className="text-base text-gray-700 leading-relaxed">
    <span className="font-semibold">The Mississippi River Basin (MRB)</span> watershed simulation model provides historical streamflow hydrographs from 1980 to the present at nearly 30,000 stream segments.
    The model simulates the water cycle using mathematical representations of key processes. MRB model simulations include physical processes such as infiltration, evapotranspiration, runoff, and the movement of water through subsurface flow pathways, which vary significantly with topography, soil types, vegetation, and land management. It also incorporates important management decisions related to agriculture, point and non-point source pollution, and reservoir operations.
    <a
      href="https://your-publication-link.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-blue-600 underline hover:text-blue-800 font-medium"
    >
      Read more about our model development
    </a>
    .
    Select a location and a date range to view the interactive hydrograph information.
  </p>
</div>


        <div className="flex-1 flex lg:flex-row flex-col min-h-[600px] pb-8">
          <div className="relative flex-1 min-h-[400px] lg:min-h-0">
            <div className="absolute inset-0">
              <MapContainer 
                center={[38.5, -92.5]} 
                zoom={6} 
                className="h-full w-full rounded-none" 
                zoomControl={false} 
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {Object.values(allBoundaries).map((boundary, index) => (
                  <GeoJSON 
                    key={index} // Consider a more stable key if possible from boundary data
                    data={boundary} 
                    style={boundaryStyle} 
                    // onEachFeature={onEachFeature} 
                  />
                ))}

                {reachData && (
                  <GeoJSON 
                    data={reachData} 
                    style={streamStyle} 
                    onEachFeature={onEachFeature} 
                  />
                )}

                {clickedLatLng && (
                  <Marker 
                    position={clickedLatLng} 
                    icon={new L.Icon({
                      iconUrl: markerIconPng,
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                    })}
                  >
                    <Popup>Selected Stream</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm border-l border-gray-200/80 flex flex-col shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200/80 bg-gray-50/50">
              <h2 className="text-lg font-medium text-gray-900">Select a Region</h2>
            </div>
            <div className="flex-1 p-4 space-y-6">
              <div className="grid grid-cols-1 gap-2">
                {Object.keys(regionCenter_Coordinates).map((region) => (
                  <div key={region} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={selectedRegion === region}
                      onChange={() => handleCheckboxChange(region)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label className="ml-3 capitalize text-gray-700 cursor-pointer select-none">{region.replace(/_/g, ' ')}</label>
                  </div>
                ))}
              </div>

              {selectedFeature && (
                <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Start and End Dates:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={minDate.toISOString().split('T')[0]}
                        max={maxDate.toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={minDate.toISOString().split('T')[0]}
                        max={maxDate.toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
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
                      
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full bg-white shadow-md rounded-lg mt-2 p-4 min-h-[500px]">
          <FeatureTable data={selectedFeature} />
        </div>

        {graphData && graphData.image && (
          <div className="w-full bg-white shadow-md rounded-lg mt-2 p-4 min-h-[500px]">
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
  );
}

export default MississippiRiver;
