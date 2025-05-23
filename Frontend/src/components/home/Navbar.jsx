import { memo } from "react";
import logo from '/Users/yuvateja/Desktop/Watershed/Frontend/src/assets/pictures/logo.png'; // Adjust the path as necessary

function Navbar() {
  return (
    <div className="border-b border-gray-300 w-full h-16 sm:h-20" style={{ backgroundColor: '#ffc107' }}>
      <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8">
      
        <div className="flex-shrink-0">
          <img
            src={logo}
            className="h-8 w-auto sm:h-10"
            alt="Logo"
          />
        </div>


        {/* Heading Section - Responsive & Centered */}
        <div className="flex-1 text-center px-2 sm:px-4">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-black">
            <span className="block md:hidden">
              <span className="block text-xs sm:text-sm">Missouri River Basin</span>
              <span className="block text-xs sm:text-sm">Water Resources</span>
            </span>
            <span className="hidden md:block">Missouri River Basin Water Resources</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default memo(Navbar);
