import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Cari...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-neutral-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3.5 py-2.5 border-[1.5px] border-neutral-200 rounded-input text-sm placeholder-neutral-400 font-body outline-none transition-all focus:border-finbisku-gold-300 focus:ring-2 focus:ring-finbisku-gold-300/20"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
