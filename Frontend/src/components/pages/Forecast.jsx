import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Plot from 'react-plotly.js';
import * as turf from '@turf/turf';
import 'react-datepicker/dist/react-datepicker.css';
// import '../../assets/css/action-buttons.css';


const MapContent = React.memo(function MapContent() {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView([38.5, -92.5], 6);

      const legend = L.control({ position: 'topright' });

      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend bg-white p-3 rounded shadow text-sm text-gray-800 border border-gray-300');
        div.innerHTML += `
          <strong>Legend</strong><br/>
          <div><span style="display:inline-block;width:12px;height:12px;background:blue;margin-right:6px;border-radius:50%;"></span>No Forecast Data</div>
          <div><span style="display:inline-block;width:12px;height:12px;background:red;margin-right:6px;"></span>Has Forecast Data</div>
        `;
        return div;
      };

      legend.addTo(map);

      // Clean up on unmount
      return () => {
        legend.remove();
      };
    }
  }, [map]);

  return null;
});


const GaugeDetails = React.memo(function GaugeDetails({ gauge, onGraphChange, onNoaaGraphChange, onCombinedGraphChange, scrollToGraph }) {
  const [gaugeDetails, setGaugeDetails] = useState(null);
  const [apiOption, setApiOption] = useState('');

  useEffect(() => {
    const fetchGaugeDetails = async () => {
      if (gauge && gauge.lid) {
        const apiURL = `http://127.0.0.1:5000/api/getReachId/${gauge.lid}`;
        try {
          const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
          if (response.ok) {
            const data = await response.json();
            setGaugeDetails(data);
          } else {
            console.error('Failed to fetch additional gauge details');
          }
        } catch (error) {
          console.error('Error fetching gauge details:', error);
        }
      }
    };
    fetchGaugeDetails();
  }, [gauge]);

  const handleApiOptionChange = async (event) => {
    const selectedOption = event.target.value;
    setApiOption(selectedOption);

    // Reset graph states if the selected option changes
    if (selectedOption !== apiOption) {
      onGraphChange(null);
      onNoaaGraphChange(null);
      onCombinedGraphChange(null);
      scrollToGraph();
    }

    if (gauge && gauge.lid) {
      if (selectedOption === 'Predicted Mu' && gaugeDetails && gaugeDetails.pedts && gaugeDetails.pedts.observed) {
        const apiURL = `http://127.0.0.1:5000/api/getProduct/${gauge.lid}/${gaugeDetails.pedts.observed}/${gauge.rch_ID}`;
        try {
          const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            onGraphChange(data);
          } else {
            console.error('Failed to fetch product details');
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      } else if (selectedOption === 'Predicted NOAA') {
        const apiURL = `http://127.0.0.1:5000/api/stageflow/${gauge.lid}`;
        try {
          const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            onNoaaGraphChange(data);
          } else {
            console.error('Failed to fetch NOAA details');
          }
        } catch (error) {
          console.error('Error fetching NOAA details:', error);
        }
      } else if (selectedOption === 'Combined MU NOAA') {
        const apiURL = `http://127.0.0.1:5000/api/combined/${gauge.lid}/${gauge.rch_ID}`;
        try {
          const response = await fetch(apiURL, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            onCombinedGraphChange(data);
          } else {
            console.error('Failed to fetch Combined details');
          }
        } catch (error) {
          console.error('Error fetching Combined details:', error);
        }
      }
    }
  };

  if (!gauge) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 p-8">
          <h3 className="text-lg font-semibold text-gray-700">No Gauge Selected</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Click on a gauge in the map to view its details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-sm font-bold text-white text-center break-words">
            {gauge.name}
          </h2>
        </div>

        <div className="p-6">
            {/* First container for gauge details */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"><strong>Lid:</strong></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gauge.lid}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"><strong>rch Id:</strong></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gauge.rch_ID}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"><strong>Sub BasinId:</strong></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gauge.Subbasin}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"><strong>Reach ID:</strong></td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {gaugeDetails?.reachId ?? 'Fetching reach ID...'}
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"><strong>USGS ID:</strong></td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {gaugeDetails?.usgsId ?? 'Fetching USGS ID...'}
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"><strong>Current Water Level:</strong></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gauge.observed} {gauge.unit}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"><strong>Flood Category:</strong></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gauge.floodCategory}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Second container for prediction selection */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-black">
                <label htmlFor="apiOptions" className="font-semibold mr-2">Select Prediction:</label>
                <select
                  id="apiOptions"
                  value={apiOption}
                  onChange={handleApiOptionChange}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">-- Select --</option>
                  <option value="Predicted Mu" disabled>Predicted Mu</option>
                  <option value="Predicted NOAA">Predicted NOAA</option>
                  <option value="Combined MU NOAA" disabled>Combined MU NOAA</option>
                </select>
              </div>
            </div>
          </div>


      </div>
    </div>
  );
});

// Moved GraphComponent outside of Forecast to prevent re-renders and for better practice
const GraphComponent = React.memo(function GraphComponent({ title, data }) {
  if (!data) return null; // Handle case where data might be null
  try {
    const parsedData = JSON.parse(data);
    return (
      <div className="graph-container w-full h-96">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <Plot
          data={parsedData.data}
          layout={parsedData.layout}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
          className="w-full h-full"
        />
      </div>
    );
  } catch (e) {
    console.error("Error parsing graph data:", e, data);
    return <div className="text-red-500">Error loading graph.</div>;
  }
});

function useProcessedGeoJSON(data, type) {
  return useMemo(() => {
    if (!data) {
      return null;
    }
    const simplified = turf.simplify(data, {
      tolerance: 0.0001,
      highQuality: true
    });
    const processed = {
      ...simplified,
      features: simplified.features.map(f => ({
        ...f,
        properties: {
          ...f.properties,
          type: type
        }
      }))
    };
    return processed;
  }, [data, type]);
}

function Forecast() {
  const [mapHeight, setMapHeight] = useState(window.innerHeight * 0.8);
  const [gaugesData, setGaugesData] = useState([]);
  const [selectedGauge, setSelectedGauge] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [noaaGraphData, setNoaaGraphData] = useState(null);
  const [combinedGraphData, setCombinedGraphData] = useState(null);
  const mapRef = useRef(null);
  const graphRef = useRef(null);
  const [boundary, setBoundary] = useState(null);
  const [streamnetwork, setStreamnetwork] = useState(null);
  const [renderErrorMessage, setRenderErrorMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');

  const handleGraphChange = (data) => setGraphData(data);
  const handleNoaaGraphChange = (data) => setNoaaGraphData(data);
  const handleCombinedGraphChange = (data) => setCombinedGraphData(data);

  const scrollToGraph = () => {
    if (graphRef.current) {
      graphRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
    weight: 1,
    opacity: 0.7
  }), []);

  useEffect(() => {
    const updateMapHeight = () => {
      setMapHeight(window.innerHeight * 0.8);
    };
    window.addEventListener('resize', updateMapHeight);
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);

  useEffect(() => {
    if (graphData || noaaGraphData || combinedGraphData) { // Corrected state variables
      const timer = setTimeout(() => {
        scrollToGraph();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [graphData, noaaGraphData, combinedGraphData]); // Corrected dependencies

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_APP_GCS_BASE_URL;
    console.log("baseUrl", baseUrl);
    
    const fetchData = async () => {
      try {
        // Fetch boundary data
        const boundaryResponse = await fetch(`${baseUrl}/Mo_Hydrology/Missouri_water_model_boundary.json`);
        if (!boundaryResponse.ok) {
          throw new Error(`Failed to fetch boundary data: ${boundaryResponse.status}`);
        }
        const boundaryData = await boundaryResponse.json();
        console.log("Boundary data loaded:", boundaryData);
        setBoundary(boundaryData);

        // Fetch stream network data
        const streamnetworkResponse = await fetch(`${baseUrl}/Mo_Hydrology/stream_network_4086.json`);
        if (!streamnetworkResponse.ok) {
          throw new Error(`Failed to fetch stream network data: ${streamnetworkResponse.status}`);
        }
        const streamnetworkData = await streamnetworkResponse.json();
        console.log("Stream network data loaded:", streamnetworkData);
        setStreamnetwork(streamnetworkData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setRenderErrorMessage(true);
        setShowErrorMessage(`Failed to load map data: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const processedBoundary = useProcessedGeoJSON(boundary, 'boundary');
  const processedStreams = useProcessedGeoJSON(streamnetwork, 'stream');

  useEffect(() => {
    const fetchGaugeData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/check', {
          method: 'GET',
        });

        if (response.ok) {
          const responseData = await response.json();
          const gauges = responseData.features.map((gauge) => ({
            latitude: gauge.geometry.coordinates[1],
            longitude: gauge.geometry.coordinates[0],
            name: gauge.properties.name,
            lid: gauge.properties.lid,
            observed: gauge.properties.status.observed.primary,
            floodCategory: gauge.properties.status.observed.floodCategory,
            Subbasin: gauge.properties.Subbasin,
            state: gauge.properties.state.name,
            rch_ID: gauge.properties.rch_ID,
            forecast_floodCategory: gauge.properties.status.forecast.floodCategory
          }));
          setGaugesData(gauges);
        } else {
          console.error('Failed to fetch gauge data');
        }
      } catch (error) {
        console.error('Error fetching gauge data:', error);
      }
    };

    fetchGaugeData();
  }, []);

  const handleGaugeClick = (gauge) => {
    setSelectedGauge(gauge);
    setSelectedPosition([gauge.latitude, gauge.longitude]);
  };

  useEffect(() => {
    // Ensure custom marker icons are correctly loaded
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex flex-col justify-start py-4 sm:py-6">
      <div className="w-full max-w-[1400px] border border-gray-200 rounded-xl sm:rounded-2xl shadow-md overflow-hidden bg-white flex flex-col mx-auto px-2 sm:px-4">
        <div className="bg-white shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
          <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
              <span className="text-blue-500">National</span> Water Model Forecasts​
            </h1>
          </div>
        </div>
         
        <div className="px-6 py-6 bg-gray-50 rounded-xl shadow-sm max-w-7xl mx-auto">
  <p className="text-base text-gray-700 leading-relaxed">
    The <span className="font-semibold">National Water Model (NWM)</span> (
    <a
      href="https://water.noaa.gov/about/nwm"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:text-blue-800 font-medium"
    >
      read about the model here
    </a>
    ), developed collaboratively and implemented by the NOAA Office of Water Prediction (
    <a
      href="https://water.noaa.gov"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:text-blue-800 font-medium"
    >
      water.noaa.gov
    </a>
    ), provides simulations of observed and forecast streamflow. The NWM offers hydrologic guidance at a fine spatial and temporal scale across the United States. It complements official NWS river forecasts at approximately 4,000 locations.
    <br /><br />
    Users can view NWM simulations and forecasts for locations in Missouri. Streamflow simulations are available at all locations identified on the map, while river flow forecast locations are separately marked. For further details about the NWM, please visit&nbsp;
    <a
      href="https://water.noaa.gov/about/nwm"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:text-blue-800 font-medium"
    >
      this page
    </a>
    .
  </p>
</div>



        <div className="flex-1 flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px]">
          <div className="relative lg:w-2/3" style={{ height: mapHeight }}>
            <MapContainer
              center={[38.5, -92.5]}
              zoom={6}
              className="h-full w-full"
              zoomControl={false}
              whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
            >
              <MapContent />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
              {processedBoundary && <GeoJSON data={processedBoundary} style={boundaryStyle} />}
              {processedStreams && <GeoJSON data={processedStreams} style={streamStyle} />}

              {gaugesData.map((gauge, index) => (
                gauge.latitude && gauge.longitude && (
                  gauge.forecast_floodCategory === 'fcst_not_current' ? (
                    <CircleMarker
                      key={index}
                      center={[gauge.latitude, gauge.longitude]}
                      radius={3}
                      color="blue"
                      fillColor="blue"
                      fillOpacity={1}
                      eventHandlers={{
                        click: () => handleGaugeClick(gauge)
                      }}
                    />
                  ) : (
                    <Rectangle
                      key={index}
                      bounds={[
                        [gauge.latitude - 0.01, gauge.longitude - 0.01],
                        [gauge.latitude + 0.01, gauge.longitude + 0.01]
                      ]}
                      color="red"
                      fillColor="red"
                      fillOpacity={1}
                      eventHandlers={{
                        click: () => handleGaugeClick(gauge)
                      }}
                    />
                  )
                )
              ))}

              {selectedPosition && (
                <Marker position={selectedPosition}>
                  <Popup>
                    <span>Selected Gauge Location</span>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <div className="w-full lg:w-1/3 p-4">
            <div className="h-full bg-white rounded-xl shadow-lg p-6">
              <GaugeDetails 
                gauge={selectedGauge}
                onGraphChange={handleGraphChange}
                onNoaaGraphChange={handleNoaaGraphChange}
                onCombinedGraphChange={handleCombinedGraphChange}
                scrollToGraph={scrollToGraph}
              />
            </div>
          </div>
        </div>
      </div>

<div ref={graphRef} className="w-full py-4 bg-white">
  <div className="px-2 sm:px-8 max-w-screen-xl mx-auto">
    {(graphData || noaaGraphData || combinedGraphData) && (
      <div className="grid grid-cols-1 gap-8">
        {graphData && graphData.primary_image && (
          <div className="w-full bg-gray-50 rounded-2xl shadow-md p-4">
            <GraphComponent title="Predicted Mu - Primary" data={graphData.primary_image} />
          </div>
        )}
        {graphData && graphData.secondary_image && (
          <div className="w-full bg-gray-50 rounded-2xl shadow-md p-4">
            <GraphComponent title="Predicted Mu - Secondary" data={graphData.secondary_image} />
          </div>
        )}
        {noaaGraphData && noaaGraphData.primary_image && (
          <div className="w-full bg-gray-50 rounded-2xl shadow-md p-4">
            <GraphComponent title="Predicted NOAA - Primary" data={noaaGraphData.primary_image} />
          </div>
        )}
        {noaaGraphData && noaaGraphData.secondary_image && (
          <div className="w-full bg-gray-50 rounded-2xl shadow-md p-4">
            <GraphComponent title="Predicted NOAA - Secondary" data={noaaGraphData.secondary_image} />
          </div>
        )}
        {combinedGraphData && combinedGraphData.primary_image && (
          <div className="w-full bg-gray-50 rounded-2xl shadow-md p-4">
            <GraphComponent title="Combined MU NOAA - Primary" data={combinedGraphData.primary_image} />
          </div>
        )}
        {combinedGraphData && combinedGraphData.secondary_image && (
          <div className="w-full bg-gray-50 rounded-2xl shadow-md p-4">
            <GraphComponent title="Combined MU NOAA - Secondary" data={combinedGraphData.secondary_image} />
          </div>
        )}
      </div>
    )}
  </div>
</div>



    </div>
  );
}

export default React.memo(Forecast);
