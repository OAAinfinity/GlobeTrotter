import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  MoveUp,
  MoveDown,
  Edit3,
  Trash2,
  Plus,
  Clock,
  DollarSign,
  GripVertical
} from 'lucide-react';

export const ExpandableStopCard = ({
  stop,
  stopIndex,
  totalStops,
  cityObj,
  assignedActivitiesList = [],
  onMoveStop,
  onEditStop,
  onRemoveStop,
  onOpenAddActivityModal,
  onRemoveActivityFromStop,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!stop) return null;

  const cityName = cityObj ? cityObj.name : stop.cityName || 'Destination';
  const cityImage = cityObj?.image || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80';
  const dailyCost = cityObj ? cityObj.avgDailyCost : 2500;
  const stayDays = stop.days || 3;

  // Calculate per-stop subtotal cost
  const activitiesSubtotal = assignedActivitiesList.reduce((sum, a) => sum + (a.cost || 0), 0);
  const lodgingSubtotal = dailyCost * stayDays;
  const stopSubtotal = lodgingSubtotal + activitiesSubtotal;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, stopIndex)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, stopIndex)}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm overflow-hidden transition-all duration-300 group hover:border-brand-300"
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Drag Handle */}
          <span
            className="p-1 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing shrink-0 hidden sm:block"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </span>

          {/* Stop Number Badge */}
          <div className="w-9 h-9 rounded-2xl bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-warm-sm">
            #{stopIndex + 1}
          </div>

          {/* City Image Thumbnail */}
          <img
            src={cityImage}
            alt={cityName}
            className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-2xs"
          />

          {/* Title & Dates */}
          <div className="truncate flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {cityName}
              </h3>
              <Badge variant="brand" size="sm">
                {stayDays} {stayDays === 1 ? 'Day' : 'Days'}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-0.5">
              {stop.arrivalDate && stop.departureDate ? (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {stop.arrivalDate} to {stop.departureDate}
                </span>
              ) : (
                <span>Scheduled Stop Leg</span>
              )}
            </div>
          </div>
        </div>

        {/* Per-Stop Subtotal & Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Running Subtotal Badge */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Stop Subtotal
            </span>
            <span className="text-sm font-extrabold text-emerald-600">
              ₹{stopSubtotal.toLocaleString()}
            </span>
          </div>

          {/* Reorder Buttons */}
          <div className="flex items-center gap-0.5 border-l border-slate-200/60 pl-2">
            <button
              type="button"
              disabled={stopIndex === 0}
              onClick={() => onMoveStop(stopIndex, 'up')}
              className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
              title="Move Up"
            >
              <MoveUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={stopIndex === totalStops - 1}
              onClick={() => onMoveStop(stopIndex, 'down')}
              className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
              title="Move Down"
            >
              <MoveDown className="w-4 h-4" />
            </button>
          </div>

          {/* Edit & Remove Buttons */}
          <div className="flex items-center gap-1 border-l border-slate-200/60 pl-2">
            <button
              type="button"
              onClick={() => onEditStop(stop, stopIndex)}
              className="p-1.5 text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
              title="Edit Stop Dates & Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onRemoveStop(stopIndex)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Remove Stop"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content Body */}
      {isExpanded && (
        <div className="p-5 bg-sand-50/50 flex flex-col gap-4">
          {/* Subtotal Breakdown Bar */}
          <div className="flex items-center justify-between text-xs p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs">
            <div className="flex items-center gap-4 text-slate-600 font-semibold">
              <span>Lodging Est: <span className="font-bold text-slate-900">₹{lodgingSubtotal.toLocaleString()}</span></span>
              <span>Activities ({assignedActivitiesList.length}): <span className="font-bold text-brand-600">₹{activitiesSubtotal.toLocaleString()}</span></span>
            </div>

            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() => onOpenAddActivityModal(stopIndex, cityObj)}
            >
              Add Activity to Stop
            </Button>
          </div>

          {/* Activities List */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Scheduled Experiences for {cityName} ({assignedActivitiesList.length})
            </span>

            {assignedActivitiesList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No activities assigned to this stop yet. Click "+ Add Activity to Stop" above!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignedActivitiesList.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/70 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="truncate">
                        <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                          {act.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-bold text-emerald-600">
                            {act.cost === 0 ? 'Free' : `₹${act.cost}`}
                          </span>
                          <span>•</span>
                          <span>{act.durationHours}h</span>
                          <span>•</span>
                          <span className="text-brand-600 font-semibold">{act.category}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveActivityFromStop(stopIndex, act.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      title="Remove activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
