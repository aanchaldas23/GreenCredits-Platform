import React, { useState } from "react";
import { FaEye, FaShareSquare } from "react-icons/fa"; // Make sure react-icons/fa is installed
import { useNavigate } from "react-router-dom"; // Essential for navigation

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("carbon");
  const [selectedToggle, setSelectedToggle] = useState("owned");
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [selectedCreditForDetails, setSelectedCreditForDetails] = useState(null); // State for modal

  // Correctly initialize the navigate function from react-router-dom
  const navigate = useNavigate();

  // Helper function for icons based on type
  const getTypeIcon = (type) => {
    switch (type) {
      case "Forestry": return "🌿";
      case "Renewable Energy": return "💨";
      case "Waste Management": return "♻️";
      case "Industrial Efficiency": return "🏭";
      default: return "🌱";
    }
  };

  // Updated ownedCredits data to match the image and include more items/statuses
  const ownedCredits = [
    { id: "CRC001", type: "Forestry", volume: 1500, status: "Active", date: "2023-01-15", description: "Details for CRC001: This is a verified forestry project." },
    { id: "CRC002", type: "Renewable Energy", volume: 2000, status: "Active", date: "2023-02-20", description: "Details for CRC002: Credits from a solar power plant." },
    { id: "CRC003", type: "Waste Management", volume: 500, status: "Retired", date: "2022-11-01", description: "Details for CRC003: Credits retired for Q4 2022 emissions." },
    { id: "CRC004", type: "Forestry", volume: 1000, status: "Pending Transfer", date: "2023-04-01", description: "Details for CRC004: Awaiting transfer to another entity." },
    { id: "CRC005", type: "Industrial Efficiency", volume: 750, status: "Active", date: "2023-05-12", description: "Details for CRC005: Achieved through industrial process optimization." },
    { id: "CRC006", type: "Forestry", volume: 1200, status: "Active", date: "2023-06-01", description: "Details for CRC006: From a newly certified reforestation project." },
  ];

  // marketCredits remain as is, but can be expanded similarly if needed for the marketplace view
  const marketCredits = [
    { id: "CRC007", type: "Renewable Energy", volume: 1000, status: "Available", date: "2025-05-10", description: "Available for purchase." },
    { id: "CRC008", type: "Forestry", volume: 750, status: "Available", date: "2025-05-01", description: "Available for purchase." },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/5 bg-gradient-to-b from-emerald-900 via-green-900 to-teal-900 text-white flex flex-col justify-between p-6 shadow-2xl">
        <div>
          <div className="flex items-center mb-8">
            <span className="text-3xl mr-3">🌿</span>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              GreenCredit
            </h4>
          </div>
          <ul className="space-y-3">
            <li className="cursor-pointer hover:bg-emerald-800/50 p-3 rounded-lg transition-all duration-300 flex items-center">
              <span className="mr-3 text-emerald-300">👤</span>
              Profile
            </li>
            <li className="cursor-pointer hover:bg-emerald-800/50 p-3 rounded-lg transition-all duration-300 flex items-center">
              <span className="mr-3 text-emerald-300">⚙️</span>
              Admin Panel
            </li>
            <li className="cursor-pointer hover:bg-emerald-800/50 p-3 rounded-lg transition-all duration-300 flex items-center">
              <span className="mr-3 text-emerald-300">⚙️</span>
              Settings
            </li>
            <li
              className="cursor-pointer hover:bg-emerald-800/50 p-3 rounded-lg transition-all duration-300 flex items-center"
              onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
            >
              <span className="mr-3 text-emerald-300">🤖</span>
              AI Insights {aiDropdownOpen ? "▴" : "▾"}
            </li>
            {aiDropdownOpen && (
              <ul className="ml-6 space-y-2 text-sm text-emerald-100 overflow-hidden">
                <li className="cursor-pointer hover:text-emerald-300 p-2 rounded transition-all duration-200">
                  <span className="mr-2">📈</span>
                  Emission Forecast
                </li>
                <li className="cursor-pointer hover:text-emerald-300 p-2 rounded transition-all duration-200">
                  <span className="mr-2">🔥</span>
                  Future Prediction
                </li>
                <li className="cursor-pointer hover:text-emerald-300 p-2 rounded transition-all duration-200">
                  <span className="mr-2">🌿</span>
                  Sustainability Score
                </li>
              </ul>
            )}
            <li className="cursor-pointer hover:bg-emerald-800/50 p-3 rounded-lg transition-all duration-300 flex items-center">
              <span className="mr-3 text-emerald-300">🔔</span>
              Notifications
            </li>
          </ul>
        </div>
        <div className="text-xs text-emerald-300 text-center p-4 bg-emerald-900/30 rounded-lg">
          © 2025 GreenCredit
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-8 overflow-auto bg-gray-900">
        {/* Top Navbar */}
        <div className="flex space-x-4 mb-8">
          {[
            { key: "carbon", label: "MY GREEN DASHBOARD", icon: "🌿" },
            { key: "auth", label: "AUTHENTICATION STATUS", icon: "⚙️" },
            { key: "admin", label: "LEADERBOARD", icon: "📈" }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center ${
                selectedTab === tab.key
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:border-emerald-500"
              }`}
              onClick={() => setSelectedTab(tab.key)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stat Boxes */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-6 border border-gray-700 hover:border-emerald-500 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Credits:</p>
                <h4 className="text-3xl font-bold text-emerald-400">5,500</h4>
                <p className="text-gray-500 text-xs">tCO2e</p>
              </div>
              <span className="text-4xl opacity-20">🌿</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Transferred:</p>
                <h4 className="text-3xl font-bold text-blue-400">1,500</h4>
                <p className="text-gray-500 text-xs">tCO2e</p>
              </div>
              <span className="text-4xl opacity-20">📤</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Marketplace Value:</p>
                <h4 className="text-3xl font-bold text-yellow-400">$135,000</h4>
                <p className="text-gray-500 text-xs">USD</p>
              </div>
              <span className="text-4xl opacity-20">💰</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center"
            onClick={() => navigate("/upload")} // This button now correctly navigates
          >
            <span className="mr-2">🌱</span>
            UPLOAD NEW CREDIT
          </button>
          <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 flex items-center">
            <span className="mr-2">🗑️</span>
            RETIRE/BURN CREDITS
          </button>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-800 rounded-2xl p-2 mb-8 border border-gray-700 inline-flex shadow-lg">
          <button
            className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              selectedToggle === "owned"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
            onClick={() => setSelectedToggle("owned")}
          >
            Owned Credits
          </button>
          <button
            className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              selectedToggle === "marketplace"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
            onClick={() => setSelectedToggle("marketplace")}
          >
            Credit Marketplace
          </button>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700">
          <h4 className="text-2xl font-bold mb-6 text-emerald-400 flex items-center">
            <span className="mr-3">🌿</span>
            Your Carbon Credit Portfolio
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-700/50 text-gray-300 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Volume (tCO2e)</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Issue Date</th>
                  <th className="px-6 py-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(selectedToggle === "owned" ? ownedCredits : marketCredits).map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-700 hover:bg-gray-700/30 transition-all duration-300"
                  >
                    <td className="px-6 py-4 font-mono text-emerald-300">{item.id}</td>
                    <td className="px-6 py-4 flex items-center">
                      <span className="mr-3 text-xl">{getTypeIcon(item.type)}</span>
                      {item.type}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-300">{item.volume.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : item.status === "Retired"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : item.status === "Pending Transfer"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : item.status === "Available"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.date}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          className="text-gray-400 hover:text-emerald-400 cursor-pointer text-lg transition-colors duration-300 transform hover:scale-110 bg-gray-700/50 hover:bg-emerald-500/20 rounded-lg p-2"
                          title="View Details"
                          onClick={() => setSelectedCreditForDetails(item)}
                        >
                          {/* Using direct emoji for icons as in your current code */}
                          👁️
                        </button>
                        {(selectedToggle === "owned" || item.status === "Available") && (
                          <button
                            className="text-gray-400 hover:text-blue-400 cursor-pointer text-lg transition-colors duration-300 transform hover:scale-110 bg-gray-700/50 hover:bg-blue-500/20 rounded-lg p-2"
                            title="Transfer/Trade Credit"
                            onClick={() => alert(`Initiate transfer/trade for ${item.id}`)}
                          >
                            {/* Using direct emoji for icons as in your current code */}
                            📤
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
            <span>Page 1 of 2</span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Credit Details Modal */}
      {selectedCreditForDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-1/2 max-w-lg border border-gray-700">
            <div className="flex items-center mb-6">
              <span className="mr-3 text-2xl">{getTypeIcon(selectedCreditForDetails.type)}</span>
              <h3 className="text-2xl font-bold text-emerald-400">
                Credit Details: {selectedCreditForDetails.id}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Type:</span>
                <span className="font-semibold text-white">{selectedCreditForDetails.type}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Volume:</span>
                <span className="font-semibold text-blue-400">{selectedCreditForDetails.volume.toLocaleString()} tCO2e</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedCreditForDetails.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : selectedCreditForDetails.status === "Retired"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {selectedCreditForDetails.status}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Issue Date:</span>
                <span className="font-semibold text-white">{selectedCreditForDetails.date}</span>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400 block mb-2">Description:</span>
                <p className="text-gray-300">{selectedCreditForDetails.description}</p>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setSelectedCreditForDetails(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}