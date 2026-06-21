import React from 'react';

const Select = ({ 
  label, 
  error, 
  id, 
  options = [], 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1 font-display">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`block w-full px-3.5 py-2.5 bg-white border-[1.5px] rounded-input text-sm font-body transition-all outline-none
          focus:border-finbisku-gold-300 focus:ring-2 focus:ring-finbisku-gold-300/20
          disabled:bg-neutral-100 disabled:text-neutral-400
          ${error 
            ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-neutral-200 text-neutral-700'
          }
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 font-body">{error}</p>}
    </div>
  );
};

export default Select;
