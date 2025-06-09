import React from 'react';

function TermsOfServiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Terms & Conditions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <p>Welcome to the Missouri River Basin Water Resources Group. By accessing our website and utilizing the data and content provided, 
            you agree to adhere to the following terms and conditions set forth in this agreement.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">Data Accuracy and Timeliness:</h3>
          <p>Missouri River Basin Water Resources Group strives to provide accurate and up-to-date hydrological and environmental data. However, due to the dynamic nature of environmental conditions and the inherent delays in data processing and updating, we do not guarantee that the data provided will always be accurate or current.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">Purpose of Data:</h3>
          <p>The data provided by Missouri River Basin Water Resources Group is intended for informational purposes only. It is not intended as a substitute for professional advice or service in specific situations. Users are advised to consult a qualified professional before making any decisions based on the data provided here.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">User Responsibility:</h3>
          <p>You, as the user, assume all responsibility for the use of any data provided by our site. This includes the responsibility to understand the limitations of the data and to interpret the data appropriately according to your needs.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">No Endorsement:</h3>
          <p>Reference to any specific commercial product, process, or service by trade name, trademark, manufacturer, or otherwise on this site does not constitute an endorsement or recommendation by Missouri River Basin Water Resources Group.</p>
          
          <h2 className="text-2xl font-bold text-gray-800">Limitation of Liability</h2>
          
          <h3 className="text-xl font-semibold text-gray-800">General:</h3>
          <p>Missouri River Basin Water Resources Group shall not be liable for any damages that result from the use of, or the inability to use, the data and materials on this site or the performance of the products, even if Missouri River Basin Water Resources Group has been advised of the possibility of such damages.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">Data Interpretation:</h3>
          <p>Missouri River Basin Water Resources Group expressly disclaims liability for errors and omissions in the contents of this site. The decision to use, and the manner of usage of information and data provided is the sole responsibility of the user. Missouri River Basin Water Resources Group will not be responsible for any consequences resulting directly or indirectly from any action or inaction you take based on the information, data, or other material provided on this site.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">Indemnification:</h3>
          <p>You agree to indemnify, defend, and hold harmless Missouri River Basin Water Resources Group, its officers, directors, employees, agents, licensors, suppliers, and any third-party information providers to the site from and against all losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of this agreement by you or any other person accessing the site using your Internet account.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">Modification of These Terms of Use</h3>
          <p>Missouri River Basin Water Resources Group reserves the right to change the terms, conditions, and notices under which the Missouri River Basin Water Resources Group website is offered, including but not limited to the charges associated with the use of the Missouri River Basin Water Resources Group website. It is your responsibility to check periodically for any changes we may make to these terms and conditions.</p>
          
          <h3 className="text-xl font-semibold text-gray-800">Acceptance of Agreement</h3>
          <p>By using this website, you accept and agree to these terms and conditions in regard to data usage and the limitations of liability stated above. If you do not agree to these terms, please do not use our site or any data contained herein.</p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfServiceModal; 