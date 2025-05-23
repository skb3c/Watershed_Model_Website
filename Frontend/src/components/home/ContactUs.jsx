import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-sky-900 mb-4">Get in Touch</h2>
        <p className="text-lg text-sky-700 max-w-2xl mx-auto">
          Have questions or want to collaborate? We'd love to hear from you.
          Reach out and we'll respond as soon as possible.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-sky-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-100 to-blue-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-sky-900 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 bg-sky-50/30 placeholder-sky-300"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-sky-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 bg-sky-50/30 placeholder-sky-300"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="block text-sm font-medium text-sky-900 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 bg-sky-50/30 placeholder-sky-300"
              placeholder="How can we help you?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="block text-sm font-medium text-sky-900 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-sky-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 bg-sky-50/30 placeholder-sky-300 resize-none"
              placeholder="Tell us more about your inquiry..."
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 space-x-2 group"
            >
              <span>Send Message</span>
              <FaPaperPlane className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </form>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-sky-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100">
              <h4 className="font-semibold text-sky-900">Email Us</h4>
              <p className="text-sky-700 mt-1">info@mowater.org</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <h4 className="font-semibold text-blue-900">Call Us</h4>
              <p className="text-blue-700 mt-1">+1 (573) 123-4567</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100">
              <h4 className="font-semibold text-cyan-900">Visit Us</h4>
              <p className="text-cyan-700 mt-1">Columbia, MO 65201</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

