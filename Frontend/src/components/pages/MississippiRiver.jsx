import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import Plot from 'react-plotly.js';
import '../../assets/css/action-buttons.css'
// Import all boundary files
import arkansas from '../../assets/data/Mississippi/sub_region_boundaries/arkansas.json';
import lowerMississippi from '../../assets/data/Mississippi/sub_region_boundaries/lower_mississippi.json';
import lowerMissouri from '../../assets/data/Mississippi/sub_region_boundaries/lower_missouri.json';
import ohio from '../../assets/data/Mississippi/sub_region_boundaries/ohio.json';
import tennessee from '../../assets/data/Mississippi/sub_region_boundaries/tennessee.json';
import upperMississippi from '../../assets/data/Mississippi/sub_region_boundaries/upper_mississippi.json';
import upperMissouri from '../../assets/data/Mississippi/sub_region_boundaries/upper_missouri.json';

// Reach files (lazy loaded)
const reachFiles = {
  arkansas: () => import('../../assets/data/Mississippi/individual/arkansas_reach_5285.json'),
  lower_mississippi: () => import('../../assets/data/Mississippi/individual/lower_mississippi_reach_2675.json'),
  lower_missouri: () => import('../../assets/data/Mississippi/individual/lower_missouri_reach_5835.json'),
  ohio: () => import('../../assets/data/Mississippi/individual/ohio_reach_3139.json'),
  tennessee: () => import('../../assets/data/Mississippi/individual/tennessee_reach_904.json'),
  upper_mississippi: () => import('../../assets/data/Mississippi/individual/upper_mississippi_reach_6563.json'),
  upper_missouri: () => import('../../assets/data/Mississippi/individual/upper_missouri_reach_6977.json')
};

const boundaries = {
  arkansas,
  lower_mississippi: lowerMississippi,
  lower_missouri: lowerMissouri,
  ohio,
  tennessee,
  upper_mississippi: upperMississippi,
  upper_missouri: upperMissouri
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


// function RegionMapContent() {
//   const map = useMap();
//   useEffect(() => {
//     map.setView([38.5, -92.5], 6);
//   }, [map]);
//   return null;
// }

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
  const [reachData, setReachData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [graphData, setGraphData] = useState(null);
  const highlightedLayerRef = useRef(null);
  const mapRef = useRef(null);

  const minDate = new Date(2010, 0, 1);
  const maxDate = new Date(2019, 12, 1);

  const handleCheckboxChange = async (regionKey) => {
    if (selectedRegion === regionKey) {
      setSelectedRegion(null);
      setReachData(null);
      setSelectedFeature(null);
      setClickedLatLng(null);
      setStartDate('');
      setEndDate('');
      setGraphData(null);
      highlightedLayerRef.current = null;
      return;
    }

    setSelectedRegion(regionKey);
    const bounds = L.geoJSON(boundaries[regionKey]).getBounds();

    try {
      const data = await reachFiles[regionKey]();
      setReachData(data.default);
      setSelectedFeature(null);
      setClickedLatLng(null);
      setStartDate('');
      setEndDate('');
      setGraphData(null);

      // Center the map on the selected region with a slight delay to ensure map is ready
      if (mapRef.current && regionCenter_Coordinates[regionKey]) {
        const [lat, lng] = regionCenter_Coordinates[regionKey];
        mapRef.current.setView([lat, lng], 7, {
          animate: true,
          duration: 1
        });
      }
      
    } catch (error) {
      console.error('Failed to load reach data:', error);
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
          // const token = localStorage.getItem('token');
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
          console.error('There was a problem with the fetch operation:', error);
        }
      }
      fetchData();
    }
  };

  const resetSelection = () => {
    setSelectedFeature(null);
    setClickedLatLng(null);
    setStartDate('');
    setEndDate('');
    setGraphData(null);
    if (highlightedLayerRef.current && highlightedLayerRef.current.setStyle) {
      highlightedLayerRef.current.setStyle({
        color: 'blue',
        weight: 2,
        opacity: 0.7,
        dashArray: '3',
        fillOpacity: 0.1
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start py-6 px-4">
      <div className="w-full max-w-10xl border border-gray-200 rounded-2xl shadow-md overflow-hidden bg-white flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-blue-500">Mississippi</span> Basin
              <sup className="text-sm text-gray-700 font-medium align-super">(under development)</sup>

            </h1>
          </div>
        </div>

        <div className="px-4 py-4 bg-gray-50 max-w-7xl mx-auto w-full">
          <p className="text-gray-700 mb-2">
          The Mississippi River Basin Model provides historical Streamflow hydrographs from 2000 to 2019. Read here for more information on our model development (link to publication). Select a location and a date range to view the interactive hydrograph information.
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
                {/* <RegionMapContent /> */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {Object.entries(boundaries).map(([key, data]) => (
                  <GeoJSON key={key} data={data} style={{ color: '#444', weight: 2 }} />
                ))}

                {reachData && (
                  <GeoJSON 
                    data={reachData} 
                    style={{ color: 'blue', weight: 2 }} 
                    onEachFeature={onEachFeature} 
                  />
                )}

                {clickedLatLng && (
                  <Marker 
                    position={clickedLatLng} 
                    icon={L.icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
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
                {Object.keys(boundaries).map((region) => (
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

                              {/* <div className="action-buttons-container">
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
          </div> */}


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
