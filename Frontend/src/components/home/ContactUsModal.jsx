import React from 'react';

function ContactUsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative text-center text-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-2 text-lg"><strong className="font-semibold">Email Us:</strong> hydrology@missouri.edu</p>
        <p className="mb-2 text-lg"><strong className="font-semibold">Call Us:</strong> +1 (573) 882-73287</p>
        <p className="mb-4 text-lg"><strong className="font-semibold">Visit Us:</strong> Columbia, MO 65201</p>
      </div>
    </div>
  );
}

export default ContactUsModal; 