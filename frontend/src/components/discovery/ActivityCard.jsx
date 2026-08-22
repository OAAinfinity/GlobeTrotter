import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Clock, MapPin, Check, Plus, Sparkles } from 'lucide-react';

export const ActivityCard = ({
  activity,
  isSelected = false,
  onToggleSelect,
  showSelectButton = true,
  className = ''
}) => {
  if (!activity) return null;

  const costDisplay = activity.cost === 0 ? 'Free' : `₹${activity.cost.toLocaleString()}`;
  const categoryVariant =
    activity.category === 'Food & Culinary'
      ? 'amber'
      : activity.category === 'Adventure & Water Sports'
      ? 'rose'
      : activity.category === 'Spiritual & Culture'
      ? 'purple'
      : activity.category === 'Nature & Wildlife'
      ? 'emerald'
      : 'ocean';

  return (
    <Card
      padding="none"
      className={`overflow-hidden flex flex-col justify-between h-full border-slate-200/80 group transition-all duration-300 ${
        isSelected ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/20' : ''
      } ${className}`}
    >
      <div>
        {/* Cover Photo & Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

          {/* Category Badge Top */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={categoryVariant}>
              {activity.category}
            </Badge>
          </div>

          {/* Duration Badge Bottom */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[11px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            {activity.durationHours}h Duration
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {activity.title}
            </h4>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0">
              {costDisplay}
            </span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>
      </div>

      {/* Card Footer with Add/Remove Toggle Button */}
      {showSelectButton && (
        <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-500" />
            {activity.cityName || 'City Experience'}
          </span>

          <Button
            size="sm"
            variant={isSelected ? 'emerald' : 'primary'}
            className="text-xs font-bold transition-all"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSelect) onToggleSelect(activity);
            }}
            icon={isSelected ? Check : Plus}
          >
            {isSelected ? 'Scheduled' : 'Add to Trip'}
          </Button>
        </div>
      )}
    </Card>
  );
};
