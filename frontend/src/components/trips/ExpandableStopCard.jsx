import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  MapPin,
  Calendar,
  DollarSign,
  Edit3,
  Trash2,
  MoveUp,
  MoveDown,
  Clock,
  Sparkles,
  Building
} from 'lucide-react';

export const ExpandableStopCard = ({
  leg,
  index,
  totalStops = 1,
  cityObj = null,
  assignedActivityObjs = [],
  onEditStop,
  onRemoveStop,
  onMoveStop,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!leg) return null;

  // Calculate lodging cost
  const stayDays = leg.days || 3;
  const avgDailyCost = cityObj ? cityObj.avgDailyCost : 200;
  const lodgingCost = stayDays * avgDailyCost;

  // Calculate activities cost
  const activitiesCost = assignedActivityObjs.reduce(
    (sum, act) => sum + (act.cost || 0),
    0
  );

  const stopSubtotalCost = lodgingCost + activitiesCost;

  return (
    <Card
      padding="none"
      className="overflow-hidden border-slate-200/80 shadow-warm-xs group transition-all duration-300"
    >
      {/* Expandable Header Bar */}
      <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Drag Handle & Move Up/Down Controls */}
          <div className="flex flex-col items-center justify-center text-slate-400 gap-0.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMoveStop(index, 'up')}
              className="p-0.5 hover:text-slate-900 disabled:opacity-20 transition-colors"
              title="Move Stop Up"
            >
              <MoveUp className="w-3.5 h-3.5" />
            </button>
            <GripVertical className="w-4 h-4 cursor-grab text-slate-300" />
            <button
              type="button"
              disabled={index === totalStops - 1}
              onClick={() => onMoveStop(index, 'down')}
              className="p-0.5 hover:text-slate-900 disabled:opacity-20 transition-colors"
              title="Move Stop Down"
            >
              <MoveDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* City Image Thumbnail */}
          {cityObj && (
            <img
              src={cityObj.image}
              alt={leg.cityName}
              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
            />
          )}

          {/* Stop Leg Title & Details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-lg bg-brand-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Stop #{index + 1}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {leg.cityName}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {stayDays} Days ({leg.arrivalDate || 'Oct 15'} to {leg.departureDate || 'Oct 19'})
              </span>
              {cityObj && (
                <span className="flex items-center gap-1 text-slate-400">
                  • {cityObj.region}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subtotal Cost & Quick Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <div className="flex flex-col text-left sm:text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Stop Subtotal
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              ${stopSubtotalCost.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="xs"
              variant="outline"
              icon={Edit3}
              onClick={() => onEditStop(leg, index)}
            >
              Edit Stop
            </Button>

            <button
              type="button"
              onClick={() => onRemoveStop(index)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Remove Stop"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors ml-1"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-5 bg-sand-50/50 flex flex-col gap-4 border-t border-slate-100">
          {/* Subtotal Breakdown Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-ocean-600" /> Lodging Est ({stayDays}d × ${avgDailyCost}):
              </span>
              <span className="font-extrabold text-slate-900">${lodgingCost.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-500" /> Experiences Est ({assignedActivityObjs.length}):
              </span>
              <span className="font-extrabold text-slate-900">${activitiesCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Assigned Experiences */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Assigned Experiences for {leg.cityName}:
            </h4>

            {assignedActivityObjs.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-white p-3 rounded-xl border border-slate-200/60">
                No experiences assigned to this city stop yet. Click "Edit Stop" to select activities!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignedActivityObjs.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/60 flex items-center gap-3"
                  >
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="truncate flex-1">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </h5>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {act.durationHours}h
                        </span>
                        <span className="font-extrabold text-emerald-600">
                          ${act.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
