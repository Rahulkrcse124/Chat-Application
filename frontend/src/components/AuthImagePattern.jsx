import React from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12">
      <div className="max-w-md text-center">
        {/* Animated grid pattern */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-16 h-16 rounded-xl bg-indigo-500/20 backdrop-blur-sm shadow-md ${
                i % 2 === 0 ? "animate-pulse" : "animate-bounce"
              }`}
            ></div>
          ))}
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-wide">
          {title}
        </h2>
        <p className="text-base text-gray-300 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;