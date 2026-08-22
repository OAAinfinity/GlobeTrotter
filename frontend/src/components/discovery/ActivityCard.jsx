import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Clock, MapPin, Plus, Check } from 'lucide-react';

export const ActivityCard = ({
  activity,
  isSelected = false,
  onToggleSelect,
  showSelectButton = true
}) => {
  if (!activity) return null;

  return (
    <Card
      padding="none"
      className={`overflow-hidden flex flex-col justify-between h-full border-slate-200/80 transition-all duration-300 ${
        isSelected ? 'ring-2 ring-brand-500 border-brand-500 bg-brand-50/30' : 'hover:border-brand-300'
      }`}
    >
      <div>
        {/* Cover Photo */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

          {/* Category Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge variant="brand" size="sm">
              {activity.category}
            </Badge>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-white text-[11px] font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-400" />
            {activity.cityName}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col gap-1.5">
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
            {activity.title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {activity.durationHours} hrs
            </span>
          </div>

          {activity.description && (
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mt-0.5">
              {activity.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer with Cost & Add Toggle */}
      <div className="p-4 pt-0 border-t border-slate-100/80 mt-2 flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-900">
          ${activity.cost}
        </span>

        {showSelectButton && (
          <Button
            size="xs"
            variant={isSelected ? 'emerald' : 'outline'}
            icon={isSelected ? Check : Plus}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSelect) onToggleSelect(activity);
            }}
          >
            {isSelected ? 'Scheduled' : 'Add to Trip'}
          </Button>
        )}
      </div>
    </Card>
  );
};
