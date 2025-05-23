import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import Layout from "./components/home/Layout";
import Home from "./components/pages/Home";
import Hydrology from "./components/pages/Hydrology";
import Forecast from './components/pages/Forecast';
import MississippiRiver from "./components/pages/MississippiRiver";
import WaterDemand from "./components/pages/WaterDemand";
import ClimateIndices from "./components/pages/ClimateIndices";
import UAVImaging from "./components/pages/UAVImaging";
import Instrumentation from "./components/pages/Instrumentation";
import WaterQuality from "./components/pages/WaterQuality";
import OutreachEducation from "./components/pages/OutreachEducation";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/Hydrology" element={<Hydrology />} />
            <Route path="/Forecast" element={<Forecast />} />
            <Route path="/MississippiRiver" element={<MississippiRiver />} />
            <Route path="/WaterDemand" element={<WaterDemand />} />
            <Route path="/ClimateIndices" element={<ClimateIndices />} />
            <Route path="/UAVImaging" element={<UAVImaging />} />
            <Route path="/Instrumentation" element={<Instrumentation />} />
            <Route path="/WaterQuality" element={<WaterQuality />} />
            <Route path="/OutreachEducation" element={<OutreachEducation />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;