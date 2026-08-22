import React from 'react';

const variantStyles = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  ocean: 'bg-ocean-50 text-ocean-700 border-ocean-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
        variantStyles[variant] || variantStyles.brand
      } ${sizeClass} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};
