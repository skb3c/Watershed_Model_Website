import React, { useState } from "react";
import { Card, Typography, List, ListItem } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        className="fixed top-20 left-0 z-[9999] p-2.5 bg-white hover:bg-blue-500 text-black hover:text-white rounded-r-lg transition-all duration-300 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-100 shadow-2xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-72 z-[9998] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}
      >
        <Card className="h-full w-full p-6 shadow-none border-none bg-white/95 backdrop-blur-sm">
          <Typography variant="h5" className="mb-6 ml-4 text-blue-900 font-bold text-xl">
            Watershed Dashboard
          </Typography>

          <List className="space-y-1">
            {[
              { name: "Home", path: "/home" },
              { name: "MO Hydrology", path: "/Hydrology" },
              { name: "MO Forecast", path: "/Forecast" },
              { name: "Mississippi Basin", path: "/MississippiRiver" },
              { name: "Agricultural Water", path: "/WaterDemand" },
              // { name: "Climate Indices", path: "/ClimateIndices" },
              { name: "UAV Imaging", path: "/UAVImaging" },
              { name: "Instrumentation", path: "/Instrumentation" },
              { name: "Water Quality", path: "/WaterQuality" },
              { name: "Outreach & Education", path: "/OutreachEducation" },
            ].map((item, index) => (
              <ListItem 
                key={index} 
                className="hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full block px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 font-semibold bg-blue-50/80"
                        : "text-gray-700 hover:text-blue-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Card>
      </div>
    </div>
  );
}
