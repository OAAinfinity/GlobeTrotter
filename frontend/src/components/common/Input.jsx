import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  error,
  helperText,
  type = 'text',
  icon: Icon,
  endIcon: EndIcon,
  className = '',
  id,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          className={`w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50/70 border transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:bg-white ${
            Icon ? 'pl-10' : ''
          } ${isPasswordType || EndIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-rose-900'
              : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-900'
          }`}
          {...props}
        />

        {isPasswordType ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : EndIcon ? (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none">
            <EndIcon className="w-4 h-4" />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
