import React from 'react';

export const Tabs = ({
  tabs, // [{ id: 'login', label: 'Log In', icon: Icon, badge: count }]
  activeTab,
  onChange,
  className = '',
  variant = 'pill', // 'pill' or 'underline'
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 p-1.5 rounded-2xl ${
        variant === 'pill'
          ? 'bg-slate-100/80 border border-slate-200/60'
          : 'border-b border-slate-200 rounded-none bg-transparent p-0'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm transition-all border-b-2 ${
                isActive
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-sm rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
