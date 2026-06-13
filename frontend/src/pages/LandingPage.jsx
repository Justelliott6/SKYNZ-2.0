import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-black to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow effect background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl absolute"></div>
        <div className="w-96 h-96 bg-purple-500/20 rounded-full blur-3xl absolute -right-48 -top-48"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-12">
        {/* Logo Banner */}
        <div className="flex justify-center">
          <div className="bg-black border-2 border-slate-800 rounded-lg p-8 backdrop-blur-sm">
            {/* SKYNZ Arrow Logo */}
            <div className="mb-6 flex justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="drop-shadow-lg"
              >
                {/* Cyan to Purple gradient arrow */}
                <defs>
                  <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>

                {/* Outer arrow shape */}
                <path
                  d="M 20 30 L 60 30 L 80 60 L 60 90 L 20 90 L 40 60 Z"
                  fill="url(#arrowGradient)"
                  opacity="0.9"
                />

                {/* Inner arrow shape */}
                <path
                  d="M 45 50 L 70 50 L 80 60 L 70 70 L 45 70 L 55 60 Z"
                  fill="black"
                />
              </svg>
            </div>

            {/* SKYNZ Text */}
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-wider mb-3">
              SKYNZ
            </h1>

            {/* Tagline with gradient */}
            <p className="text-sm md:text-base tracking-widest">
              <span className="text-cyan-400">YOUR PAGE.</span>
              <span className="text-pink-500 mx-2">YOUR VIBE.</span>
              <span className="text-cyan-400">YOUR STAGE.</span>
            </p>
          </div>
        </div>

        {/* Enter Button */}
        <div className="flex justify-center pt-8">
          <button
            onClick={handleEnter}
            className="relative group"
          >
            {/* Outer border with dashed effect */}
            <div className="absolute inset-0 border-2 border-dashed border-yellow-400 rounded-full opacity-60 group-hover:opacity-100 transition"></div>

            {/* Button content */}
            <div className="relative bg-black border-2 border-cyan-400 rounded-full px-8 py-4 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
              <span className="text-cyan-400 font-bold text-lg tracking-widest group-hover:text-cyan-300 transition">
                ENTER SKYNZ →
              </span>
            </div>
          </button>
        </div>

        {/* Footer text */}
        <div className="pt-12 text-gray-500 text-sm italic">
          <p>Still writing code after 8 months 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
