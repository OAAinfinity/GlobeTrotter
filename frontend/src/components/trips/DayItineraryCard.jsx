import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Sun,
  SunMedium,
  Moon,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  MapPin
} from 'lucide-react';

export const DayItineraryCard = ({
  dayNumber,
  cityName,
  dateString,
  activitiesForDay = [],
  onOpenAddModal,
  onRemoveActivity,
}) => {
  // Slots
  const morningActivities = activitiesForDay.filter(
    (a) => !a.timeSlot || a.timeSlot === 'Morning'
  );
  const afternoonActivities = activitiesForDay.filter(
    (a) => a.timeSlot === 'Afternoon'
  );
  const eveningActivities = activitiesForDay.filter(
    (a) => a.timeSlot === 'Evening'
  );

  const totalDayCost = activitiesForDay.reduce((sum, a) => sum + (a.cost || 0), 0);

  const renderSlot = (title, icon, items) => {
    const Icon = icon;
    return (
      <div className="flex flex-col gap-2 p-3 bg-slate-50/70 rounded-2xl border border-slate-200/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-brand-500" />
            {title}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {items.length} {items.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic py-1">No activities scheduled for this slot.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {items.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {act.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-emerald-600">
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
                  onClick={() => onRemoveActivity(act.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove activity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm p-5 flex flex-col gap-4">
      {/* Day Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white font-extrabold text-sm flex items-center justify-center shadow-warm-sm">
            D{dayNumber}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Day {dayNumber} — <span className="text-brand-600">{cityName}</span>
            </h3>
            {dateString && (
              <p className="text-xs text-slate-400 font-medium">{dateString}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber">
            Day Total: ₹{totalDayCost}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            icon={Plus}
            onClick={() => onOpenAddModal(dayNumber)}
          >
            Add Experience
          </Button>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {renderSlot('Morning 🌅', Sun, morningActivities)}
        {renderSlot('Afternoon ☀️', SunMedium, afternoonActivities)}
        {renderSlot('Evening 🌙', Moon, eveningActivities)}
      </div>
    </div>
  );
};
