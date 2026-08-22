import React from 'react';

const variantStyles = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-warm-sm hover:shadow-warm-md focus:ring-brand-400',
  secondary:
    'bg-ocean-600 hover:bg-ocean-700 text-white shadow-sm hover:shadow focus:ring-ocean-400',
  outline:
    'bg-white/80 hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-xs focus:ring-brand-400',
  ghost:
    'bg-transparent hover:bg-slate-100/70 text-slate-600 hover:text-slate-900 focus:ring-slate-300',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-400',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon: Icon,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
