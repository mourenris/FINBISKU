import React from 'react';

const Logo = ({ className = 'h-8 w-8', ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="-10 -15 270 195" 
      className={className} 
      {...props}
    >
      <defs>
        <linearGradient id="barGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A6230"/>
          <stop offset="100%" stopColor="#9C7E37"/>
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1F4D2C"/>
          <stop offset="38%" stopColor="#6E6B2E"/>
          <stop offset="100%" stopColor="#E3B43A"/>
        </linearGradient>
        <linearGradient id="smallLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A9842F"/>
          <stop offset="100%" stopColor="#E8C24A"/>
        </linearGradient>
      </defs>
      
      <rect x="0" y="104" width="32" height="55" rx="15" fill="#2F7D32" opacity="0.4"/>
      <rect x="41" y="66" width="32" height="94" rx="15" fill="#2F7D32" opacity="0.8"/>
      <rect x="82" y="22" width="31" height="138" rx="15" fill="url(#barGrad)"/>
      <path d="M123 158 C116 110 122 55 152 18 C165 3 188 -3 205 8 C220 17 222 38 210 58 C192 88 165 118 140 142 C132 149 127 154 123 158 Z" fill="url(#leafGrad)"/>
      <path d="M127 152 C133 112 146 68 173 30" stroke="#F4E7B8" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
};

export default Logo;
