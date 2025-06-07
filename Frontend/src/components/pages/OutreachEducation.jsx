import React from 'react';
import YoutubeEmbed from './YoutubeEmbed';
import { FaBook, FaCertificate, FaUniversity } from 'react-icons/fa';

function OutreachEducation() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-sky-600 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6 tracking-tight">
            Outreach & Education
          </h1>
          <p className="text-xl text-sky-100 max-w-3xl mx-auto">
            Advancing knowledge through courses, certificates, and research opportunities
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-gradient-to-b from-white to-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-sky-100 rounded-full mb-6 ring-2 ring-sky-200 ring-opacity-50">
              <FaBook className="h-8 w-8 text-sky-600" />
            </div>
            <h2 className="text-3xl font-bold text-sky-900 sm:text-4xl mb-4">
                Relevant courses offered at Mizzou
            </h2>
            <p className="text-lg text-sky-700 max-w-3xl mx-auto">
              Explore our specialized courses in environmental science and remote sensing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
              <h3 className="text-2xl font-semibold text-sky-900 mb-4">
                <a 
                  href='https://generaleducation.missouri.edu/course/env_sc-4560/' 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sky-600 hover:underline"
                >
                  Observing the Earth from Space
                </a>
              </h3>
              <p className="text-gray-600 font-medium mb-4">
                (BIOL_EN 4560/7560, ENV_SC 4560/7560)
              </p>
              <p className="text-gray-700 leading-relaxed">
                This course provides an understanding of the theory and application of earth observing satellite remote sensing as a tool for environmental engineering and science. The topics include the fundamentals of electromagnetic radiation, satellite and sensor technology, integration of satellite and GIS data and digital image analysis.
              </p>
            </div>

            {/* Course 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
              <h3 className="text-2xl font-semibold text-sky-900 mb-4">
                <a 
                  href='https://generaleducation.missouri.edu/course/env_sc-4450/' 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sky-600 hover:underline"
                >
                  Environmental Hydrology
                </a>
              </h3>
              <p className="text-gray-600 font-medium mb-4">
                (BIOL_EN 4450/7450, ENV_SC 4450/7450)
              </p>
              <p className="text-gray-700 leading-relaxed">
                This course provides an understanding of the roles of natural processes and anthropogenic factors influencing the occurrence and movement of water. Students will learn the quantitative basis of hydrology, which will help them appreciate the scientific approach to understanding observed phenomena.
              </p>
            </div>

             {/* Course 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
              <h3 className="text-2xl font-semibold text-sky-900 mb-4">
                <a 
                  href='https://catalog.missouri.edu/collegeofengineering/additionalcertificatesminors/minor-engineering-sustainability/' 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sky-600 hover:underline"
                >
                 Watershed Modeling Using GIS
                </a>
              </h3>
              <p className="text-gray-600 font-medium mb-4">
                (BIOL_EN 4350, CV_ENG 4720)
              </p>
              <p className="text-gray-700 leading-relaxed">
                This course discusses about watershed evaluation using AVSWAT for hydrology, sediment yield, water quality; includes USLE, MUSLE, WEPP. Procedures for model calibration/sensitivity data analysis.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-gradient-to-b from-sky-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
            <div className="aspect-w-16 aspect-h-9 w-full">
              <YoutubeEmbed embedId="-2-Wa2qEBWQ" />
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="bg-gradient-to-b from-white to-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-emerald-100 rounded-full mb-6 ring-2 ring-emerald-200 ring-opacity-50">
              <FaCertificate className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-900 sm:text-4xl mb-4">
              Certificates and Minors
            </h2>
            <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
              Expand your academic credentials with our specialized programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Certificate 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-100">
              <div className="inline-block p-3 bg-emerald-50 rounded-lg mb-4">
                <FaUniversity className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-3">
                <a 
                  href='https://catalog.missouri.edu/collegeofengineering/additionalcertificatesminors/minor-agricultural-engineering/' 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 hover:underline"
                >
                  Agricultural Engineering
                </a>
              </h3>
              <p className="text-gray-600">
                Provides additional information about the minor in Agricultural Engineering.
              </p>
            </div>

            {/* Certificate 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-100">
              <div className="inline-block p-3 bg-emerald-50 rounded-lg mb-4">
                <FaUniversity className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-3">
                <a 
                  href='https://catalog.missouri.edu/collegeofagriculturefoodandnaturalresources/environmentalsciences/minor-environmental-sciences/' 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 hover:underline"
                >
                  Environmental Sciences
                </a>
              </h3>
              <p className="text-gray-600">
                Provides additional information about the minor in Environmental Sciences.
              </p>
            </div>

            {/* Certificate 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-100">
              <div className="inline-block p-3 bg-emerald-50 rounded-lg mb-4">
                <FaUniversity className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-3">
                <a 
                  href='https://catalog.missouri.edu/collegeofagriculturefoodandnaturalresources/additionalcertificatesminors/cert-sustainability/' 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 hover:underline"
                >
                  Certificate in Engineering Sustainability
                </a>
              </h3>
              <p className="text-gray-600">
                Provides additional information about the Certificate in Sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OutreachEducation;