import React from 'react'
import { memo } from 'react'
import Slide_show from '../home/Slide_show'
import ContactUs from '../home/ContactUs'
import { FaWater, FaChartLine, FaLeaf, FaMicroscope,FaRobot, FaGraduationCap } from 'react-icons/fa'

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section with Slideshow */}
      <section className="w-full">
        <Slide_show />
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-sky-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sky-900 sm:text-5xl mb-4 tracking-tight">
              Our Resources
            </h2>
            <p className="text-lg text-sky-700 max-w-3xl mx-auto">
              Comprehensive water resource management and research services for Missouri's future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-sky-200 rounded-full mb-6 ring-2 ring-sky-300 ring-opacity-50">
                <FaWater className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-3">Water Quality Monitoring</h3>
              <p className="text-sky-700">Real-time monitoring and analysis of water quality parameters across Missouri</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-emerald-200 rounded-full mb-6 ring-2 ring-emerald-300 ring-opacity-50">
                <FaChartLine className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-3">Flow Forecasting</h3>
              <p className="text-emerald-700">Advanced modeling and prediction of stream flows and water levels</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-cyan-200 rounded-full mb-6 ring-2 ring-cyan-300 ring-opacity-50">
                <FaLeaf className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-900 mb-3">Agricultural Support</h3>
              <p className="text-cyan-700">Supporting sustainable agricultural practices through water management</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-blue-200 rounded-full mb-6 ring-2 ring-blue-300 ring-opacity-50">
                <FaMicroscope className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Research & Innovation</h3>
              <p className="text-blue-700">Cutting-edge research in water resources and environmental science</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-purple-200 rounded-full mb-6 ring-2 ring-purple-300 ring-opacity-50">
                <FaRobot className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">ChatBot Functionality</h3>
              <p className="text-purple-700">Interactive chatbot trained on agricultural resources to answer your questions</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-amber-200 rounded-full mb-6 ring-2 ring-amber-300 ring-opacity-50">
                <FaGraduationCap className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Outreach and Education</h3>
              <p className="text-amber-700">Details of courses, certifications, and educational programs available at MIZZOU</p>
            </div>

          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="bg-gradient-to-b from-sky-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Statement */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
              <h3 className="text-3xl font-bold text-sky-900 mb-6">Our Mission</h3>
              <p className="text-sky-800 leading-relaxed mb-6 text-lg">
                Welcome to our resource hub, where the vital waters of Missouri meet innovation and stewardship. 
                Our agricultural landscapes and burgeoning communities face the dual challenges of navigating water
                management practices amidst an ever-changing climate and evolving landscapes.
              </p>
              <p className="text-sky-800 leading-relaxed text-lg">
                Understanding stream flow, water quality, and agricultural water demand is more than a technical endeavor—it's 
                essential for crafting policies and strategies that ensure our resilience in the heart of America.
              </p>
            </div>

            {/* Latest Updates */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
              <h3 className="text-3xl font-bold text-sky-900 mb-6">Upcoming Events</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-sky-500 pl-6 py-2 bg-sky-50 rounded-r-lg">
                  <h4 className="font-semibold text-sky-900 text-lg">New Research Publication</h4>
                  <p className="text-sky-700">Latest findings on Missouri River Basin water quality trends</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-50 rounded-r-lg">
                  <h4 className="font-semibold text-emerald-900 text-lg">Upcoming Workshop</h4>
                  <p className="text-emerald-700">Join us for a workshop on sustainable water management practices</p>
                </div>
                <div className="border-l-4 border-cyan-500 pl-6 py-2 bg-cyan-50 rounded-r-lg">
                  <h4 className="font-semibold text-cyan-900 text-lg">Community Update</h4>
                  <p className="text-cyan-700">Recent developments in local water conservation efforts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-section bg-gradient-to-b from-white to-sky-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactUs />
        </div>
      </div>
    </div>
  )
}

export default memo(Home);