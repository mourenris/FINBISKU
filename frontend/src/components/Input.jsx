import React from 'react';

const Input = ({ 
  label, 
  error, 
  id, 
  prefix,
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
      
      {prefix ? (
        <div className={`flex items-stretch rounded-input border-[1.5px] transition-all bg-white overflow-hidden
          focus-within:border-finbisku-gold-300 focus-within:ring-2 focus-within:ring-finbisku-gold-300/20
          ${error 
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' 
            : 'border-neutral-200'
          }
        `}>
          <span className="bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-500 border-r border-neutral-200 select-none flex items-center font-body whitespace-nowrap">
            {prefix}
          </span>
          <input
            id={id}
            className={`block w-full px-3.5 py-2.5 bg-white text-sm placeholder-neutral-400 font-body outline-none
              disabled:bg-neutral-100 disabled:text-neutral-400
              ${error ? 'text-red-900' : 'text-neutral-700'}
            `}
            {...props}
          />
        </div>
      ) : (
        <input
          id={id}
          className={`block w-full px-3.5 py-2.5 bg-white border-[1.5px] rounded-input text-sm placeholder-neutral-400 font-body transition-all outline-none
            focus:border-finbisku-gold-300 focus:ring-2 focus:ring-finbisku-gold-300/20
            disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:shadow-none
            ${error 
              ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-neutral-200 text-neutral-700'
            }
          `}
          {...props}
        />
      )}
      
      {error && <p className="mt-1 text-sm text-red-600 font-body">{error}</p>}
    </div>
  );
};

export default Input;
