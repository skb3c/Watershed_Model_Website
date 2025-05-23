import React from 'react';

function Footer() {
  return (
    <footer className="bg-yellow-500 border-t border-gray-200 shadow-sm h-16 mt-8">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 w-full">
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Missouri River Basin Water Resources. All rights reserved.
          </div>
          
          {/* Links */}
          <div className="flex space-x-4 sm:space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 