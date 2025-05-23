import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

function RegionMapContent() {
  const map = useMap();
  useEffect(() => {
    map.setView([38.5, -92.5], 5.5);
  }, [map]);
  return null;
}

function FeatureTable({ data }) {
  if (!data) return null;
  return (
    <div className="h-full mt-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100 sticky top-0 shadow-sm z-10">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(data).map(([key, value], index) => (
              <tr key={key} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{key}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MississippiRiver() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [reachData, setReachData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleCheckboxChange = async (regionKey) => {
    if (selectedRegion === regionKey) {
      setSelectedRegion(null);
      setReachData(null);
      setSelectedFeature(null);
      return;
    }

    setSelectedRegion(regionKey);
    const bounds = L.geoJSON(boundaries[regionKey]).getBounds();

    try {
      const data = await reachFiles[regionKey]();
      setReachData(data.default);
      setSelectedFeature(data.default.features?.[0]?.properties || null);

      setTimeout(() => {
        document.querySelector('.leaflet-container')._leaflet_map.fitBounds(bounds);
      }, 100);
    } catch (error) {
      console.error('Failed to load reach data:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Info Section */}
      <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-blue-500">Mississippi</span> Basin
          </h1>
        </div>
      </div>

      <div className="px-4 py-4 bg-gray-50 max-w-7xl mx-auto w-full">
        <p className="text-gray-700 mb-2">
          The Mississippi River Basin Model provides historical Streamflow hydrographs from 2000 to 2019.{' '}
          <a href="#" className="text-blue-500 underline">Read here</a> for more information on our model development.
          Select a location and a date range to view the interactive hydrograph information.
        </p>
      </div>

      {/* Map + Sidebar */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        <div className="flex-1 relative min-h-[500px]">
          <MapContainer center={[38.5, -92.5]} zoom={5.5} className="h-full w-full z-0">
            <RegionMapContent />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {Object.entries(boundaries).map(([key, data]) => (
              <GeoJSON key={key} data={data} style={{ color: '#444', weight: 2 }} />
            ))}

            {reachData && <GeoJSON data={reachData} style={{ color: 'blue', weight: 2 }} />}
          </MapContainer>
        </div>

        <div className="lg:w-96 w-full bg-white p-6 shadow-lg border-l">
          <h2 className="text-lg font-semibold mb-4">Select a Region</h2>
          <div className="space-y-2">
            {Object.keys(boundaries).map((region) => (
              <div key={region} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedRegion === region}
                  onChange={() => handleCheckboxChange(region)}
                />
                <label className="capitalize text-gray-700">{region.replace(/_/g, ' ')}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streamflow Data Table */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <FeatureTable data={selectedFeature} />
      </div>
    </div>
  );
}

export default MississippiRiver;
