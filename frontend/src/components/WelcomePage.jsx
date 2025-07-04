import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Constants
const FEATURES_DATA = [
  { title: "Verify Credits", desc: "Authenticates carbon credit certificates using AI and OCR.", icon: "🔍" },
  { title: "Decentralized Storage", desc: "Stores certificates securely on MongoDB with hash checks.", icon: "🔒" },
  { title: "Generate Metadata", desc: "Extracts structured info from uploaded PDFs via Flask microservice.", icon: "📊" },
  { title: "Blockchain Integration", desc: "Registers authenticated metadata on Hyperledger Fabric ledger.", icon: "⛓️" },
];

const STATS_DATA = [
  { value: "100+", label: "Projects Verified" },
  { value: "500K+", label: "Credits Registered" },
  { value: "30+", label: "Organizations Onboarded" }
];

// Reusable components
const FeatureCard = React.memo(({ feature }) => (
  <div
    className="bg-gray-800 border border-gray-600 rounded-xl p-8 m-2 shadow-lg transition-all duration-300 ease-in-out h-full text-center cursor-pointer hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/30"
    role="article"
    tabIndex={0}
    aria-label={`Feature: ${feature.title}`}
  >
    <div className="text-5xl mb-4" aria-hidden="true">{feature.icon}</div>
    <h3 className="text-green-500 mb-4 text-xl font-semibold">{feature.title}</h3>
    <p className="leading-relaxed opacity-90 text-sm text-gray-300">{feature.desc}</p>
  </div>
));

const StatCard = React.memo(({ stat }) => (
  <div className="text-center">
    <h3 className="text-green-500 text-4xl font-bold mb-2">{stat.value}</h3>
    <p className="text-lg opacity-90 font-medium text-gray-300">{stat.label}</p>
  </div>
));

const LoadingSpinner = () => (
  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
);

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const scrollToFunctions = useCallback(() => {
    const element = document.getElementById("functions");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleKeyDown = useCallback((e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  const navigateToLogin = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/login");
      setIsLoading(false);
    }, 500);
  }, [navigate]);

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen" style={{backgroundColor: '#1a1a1a', color: '#ffffff', minHeight: '100vh'}}>
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-600 py-4 sticky top-0 z-50 shadow-lg backdrop-blur-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-green-500">
            <a href="/" className="text-green-500 no-underline hover:text-green-400 transition-colors" aria-label="GreenCredit Home">
              GreenCredit
            </a>
          </div>
          <div className="flex items-center">
            <button
              className="px-6 py-3 border-none rounded-lg text-base cursor-pointer transition-all duration-300 font-medium no-underline inline-flex items-center justify-center bg-transparent text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={navigateToLogin}
              onKeyDown={(e) => handleKeyDown(e, navigateToLogin)}
              disabled={isLoading}
              aria-label="Go to login or registration page"
            >
              {isLoading && <LoadingSpinner />}
              Login / Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-24 text-center relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-cover bg-center -z-10" aria-hidden="true"></div>
        <div className="max-w-4xl mx-auto relative z-10 px-8">
          <h1 id="hero-title" className="text-5xl font-bold mb-4 drop-shadow-lg">
            Verify & Trade Carbon Credits
          </h1>
          <p className="text-xl mb-8 opacity-90 drop-shadow-md">
            AI + Blockchain for Transparent Climate Action
          </p>
          <button
            className="px-8 py-4 border-none rounded-lg text-lg cursor-pointer transition-all duration-300 font-medium no-underline inline-flex items-center justify-center bg-green-500 text-white hover:bg-green-600 hover:shadow-xl hover:transform hover:-translate-y-1"
            onClick={scrollToFunctions}
            onKeyDown={(e) => handleKeyDown(e, scrollToFunctions)}
            aria-label="Scroll to features section"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="functions" className="py-20 bg-gray-900 px-8" aria-labelledby="features-title">
        <div className="max-w-6xl mx-auto">
          <h2 id="features-title" className="text-center text-green-500 mb-12 text-4xl font-bold">
            What Does GreenCredit Offer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES_DATA.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 text-center bg-gray-800 px-8" aria-labelledby="stats-title">
        <div className="max-w-6xl mx-auto">
          <h3 id="stats-title" className="text-green-500 mb-8 text-3xl font-semibold">
            Trusted by sustainability advocates and climate innovators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS_DATA.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-600 bg-gray-900 opacity-80" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          &copy; {new Date().getFullYear()} GreenCredit. Built for transparency, powered by trust.
        </div>
      </footer>
    </div>
  );
}