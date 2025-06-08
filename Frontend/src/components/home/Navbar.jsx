import { memo } from "react";
import logo from '../../assets/pictures/logo.png'
import '../../assets/css/heading.css'

function Navbar() {
  return (
    <div className="border-b border-gray-300 w-full h-16 sm:h-20" style={{ backgroundColor: '#ffc107' }}>
      <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8">
      
        <div className="flex-shrink-0">
          {/* <img
            src={logo}
            className="h-8 w-auto sm:h-10"
            alt="Logo"
          /> */}
        </div>


        {/* Heading Section - Responsive & Centered */}
         <div className="heading-container">
  <h1 className="heading-title">
    {/* Desktop (≥768px) */}
    <span className="heading-desktop">
      Hydrology Lab at University of Missouri
    </span>

    {/* Mobile (<768px) */}
    <span className="heading-mobile">
      <span>Hydrology Lab at</span>
      <span>University of Missouri</span>
    </span>
  </h1>
</div>  


      </div>
    </div>
  );
}

export default memo(Navbar);
