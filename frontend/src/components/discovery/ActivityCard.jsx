import React from 'react';
import { Clock, DollarSign, Star, CheckCircle2, Plus } from 'lucide-react';
import { Badge } from '../common/Badge';

const categoryVariantMap = {
  Sightseeing: 'brand',
  'Food & Dining': 'amber',
  Adventure: 'ocean',
  Culture: 'purple',
  Relaxation: 'emerald',
  Nightlife: 'rose',
};

export const ActivityCard = ({
  activity,
  isSelected = false,
  onToggleSelect,
  showSelectButton = false,
  className = '',
}) => {
  const variant = categoryVariantMap[activity.category] || 'slate';

  return (
    <div
      onClick={onToggleSelect ? () => onToggleSelect(activity) : undefined}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'bg-brand-50/60 border-brand-400 ring-2 ring-brand-400/30 shadow-warm-md'
          : 'bg-white border-slate-100/90 hover:border-slate-300 hover:shadow-warm-sm'
      } ${onToggleSelect ? 'cursor-pointer' : ''} ${className}`}
    >
      <div>
        <div className="relative h-36 overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5">
            <Badge variant={variant} size="sm">
              {activity.category}
            </Badge>
          </div>
          <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-amber-400 text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {activity.rating}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
            {activity.title}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between mt-1 text-xs font-semibold text-slate-600 border-t border-slate-100/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-0.5 text-slate-700 font-bold">
            {activity.cost === 0 ? 'Free' : `₹${activity.cost}`}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {activity.durationHours}h
          </span>
        </div>

        {showSelectButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSelect) onToggleSelect(activity);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-brand-500 hover:text-white text-slate-700'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
