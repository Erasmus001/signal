
import React from 'react';

const EmptyStateIllustration: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Background soft shapes */}
      <div className="absolute inset-0 bg-gray-50/50 rounded-full scale-90 blur-xl" />
      
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-sm"
      >
        {/* Abstract Radar/Search Rings */}
        <circle cx="60" cy="60" r="40" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="25" stroke="#F3F4F6" strokeWidth="1.5" />
        
        {/* Floating Signal Particles */}
        <rect x="85" y="35" width="4" height="4" rx="1" fill="#D1D5DB" className="animate-pulse" />
        <rect x="30" y="80" width="3" height="3" rx="0.5" fill="#E5E7EB" />
        <rect x="25" y="40" width="5" height="5" rx="1.5" fill="#F3F4F6" />
        
        {/* Stylized Magnifying Glass / Radar Handle */}
        <path
          d="M75 75L90 90"
          stroke="#9CA3AF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="60"
          cy="60"
          r="18"
          fill="white"
          stroke="#374151"
          strokeWidth="2"
        />
        
        {/* Inner Glass Detail */}
        <path
          d="M52 55C52 53.3431 53.3431 52 55 52H65C66.6569 52 68 53.3431 68 55V65C68 66.6569 66.6569 68 65 68H55C53.3431 68 52 66.6569 52 65V55Z"
          fill="#F9FAFB"
        />
        <rect x="56" y="58" width="8" height="1.5" rx="0.75" fill="#E5E7EB" />
        <rect x="56" y="62" width="5" height="1.5" rx="0.75" fill="#E5E7EB" />
      </svg>
    </div>
  );
};

export default EmptyStateIllustration;
