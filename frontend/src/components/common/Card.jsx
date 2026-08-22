import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glass = false,
  padding = 'md',
  onClick,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-300 ${
        glass
          ? 'glass-card'
          : 'bg-white border-slate-100/80 shadow-warm-sm'
      } ${
        hoverEffect
          ? 'hover:-translate-y-1 hover:shadow-warm-md hover:border-brand-200/80'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${
        paddingStyles[padding] || paddingStyles.md
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
