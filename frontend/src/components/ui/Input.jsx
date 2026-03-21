import React from 'react';

const Input = ({ 
  label, 
  placeholder, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  icon: Icon, 
  required = false,
  className = '',
  name
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] ml-1">
          {label} {required && <span className="text-[#dc2626] font-normal">*</span>}
        </label>
      )}
      <div className="relative group/input">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#3b82f6] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full h-[44px] bg-white border-2 border-slate-100 rounded-xl transition-all font-semibold text-sm placeholder:text-[#94a3b8] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_10px_20px_-10px_rgba(59,130,246,0.12)]
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error ? 'border-[#dc2626] focus:border-[#dc2626]' : ''}
          `}
        />
      </div>
      {error && <p className="text-[11px] text-[#dc2626] font-semibold ml-1">{error}</p>}
    </div>
  );
};

export default Input;
