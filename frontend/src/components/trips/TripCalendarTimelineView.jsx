import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  GripVertical,
  Edit3,
  Check,
  Plus,
  MoveUp,
  MoveDown,
  Sparkles,
  MapPin,
  Tag
} from 'lucide-react';

export const TripCalendarTimelineView = ({
  trip,
  cities = [],
  activities = [],
  onUpdateTrip
}) => {
  if (!trip) return null;

  const tripStops = trip.cities || [];
  const selectedActivityObjs = activities.filter((a) =>
    (trip.selectedActivities || []).includes(a.id)
  );

  // Calculate total days
  const calculateTotalDays = () => {
    if (!trip.startDate || !trip.endDate) return 7;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 7;
  };

  const totalDays = calculateTotalDays();

  // State: Active selected day index (0-indexed)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // State: Schedule mapping dayIndex -> list of activity objects
  const [daySchedules, setDaySchedules] = useState(() => {
    const initial = {};
    for (let i = 0; i < totalDays; i++) {
      // Distribute activities evenly across days
      const assigned = selectedActivityObjs.filter((_, idx) => idx % totalDays === i);
      initial[i] = assigned.map((act) => ({
        ...act,
        scheduledTime: '10:00 AM',
        customCost: act.cost
      }));
    }
    return initial;
  });

  // Inline Editing State for active day item
  const [editingItemId, setEditingItemId] = useState(null);
  const [editForm, setEditForm] = useState({ scheduledTime: '', customCost: 0, durationHours: 2 });

  // Handle Drag Reorder within day
  const handleMoveActivity = (dayIndex, actIndex, direction) => {
    const targetIndex = direction === 'up' ? actIndex - 1 : actIndex + 1;
    const dayList = [...(daySchedules[dayIndex] || [])];
    if (targetIndex < 0 || targetIndex >= dayList.length) return;

    const temp = dayList[actIndex];
    dayList[actIndex] = dayList[targetIndex];
    dayList[targetIndex] = temp;

    setDaySchedules((prev) => ({
      ...prev,
      [dayIndex]: dayList
    }));
  };

  // Start Inline Editing
  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditForm({
      scheduledTime: item.scheduledTime || '10:00 AM',
      customCost: item.customCost !== undefined ? item.customCost : item.cost,
      durationHours: item.durationHours || 2
    });
  };

  // Save Inline Edit
  const saveInlineEdit = (dayIndex, itemId) => {
    const dayList = [...(daySchedules[dayIndex] || [])];
    const updatedList = dayList.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          scheduledTime: editForm.scheduledTime,
          customCost: Number(editForm.customCost),
          durationHours: Number(editForm.durationHours)
        };
      }
      return item;
    });

    setDaySchedules((prev) => ({
      ...prev,
      [dayIndex]: updatedList
    }));

    setEditingItemId(null);
  };

  // Current active day activities
  const activeDayActivities = daySchedules[selectedDayIndex] || [];

  // Active day leg info
  const activeLeg = tripStops[0] || { cityName: 'Destination' };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-500" />
            Trip Calendar & Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Interactive day grid: click a day cell to inspect scheduled activities, reorder experiences, or perform quick inline time & cost edits
          </p>
        </div>
      </div>

      {/* Date Range Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNum = i + 1;
          const dayItems = daySchedules[i] || [];
          const isSelected = selectedDayIndex === i;

          const daySubtotal = dayItems.reduce(
            (sum, item) => sum + (item.customCost !== undefined ? item.customCost : item.cost),
            0
          );

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDayIndex(i)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/80 ring-2 ring-brand-400/30 shadow-warm-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                    isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Day {dayNum}
                </span>

                <span className="text-[10px] font-semibold text-slate-400">
                  {dayItems.length} items
                </span>
              </div>

              {/* Plotted Activity Chips */}
              <div className="flex flex-col gap-1 my-1 overflow-hidden">
                {dayItems.slice(0, 2).map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold text-slate-800 bg-white/80 border border-slate-200/60 rounded-md px-1.5 py-0.5 truncate"
                  >
                    • {item.title}
                  </span>
                ))}
                {dayItems.length > 2 && (
                  <span className="text-[9px] font-bold text-brand-600">
                    +{dayItems.length - 2} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between w-full pt-1 border-t border-slate-100/80 text-[10px]">
                <span className="text-slate-400 font-medium">Day Subtotal</span>
                <span className="font-extrabold text-slate-900">${daySubtotal}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expandable Day Detail Panel */}
      <Card className="p-6 border-slate-200/80 shadow-warm-md flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-500 text-white font-extrabold text-base flex items-center justify-center shadow-warm-xs">
              D{selectedDayIndex + 1}
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Day {selectedDayIndex + 1} Schedule & Activities
              </h3>
              <p className="text-xs text-slate-500">
                Location: {activeLeg.cityName} • Drag-to-reorder & inline time/cost editing
              </p>
            </div>
          </div>

          <Badge variant="amber" icon={Sparkles}>
            {activeDayActivities.length} Experiences Scheduled
          </Badge>
        </div>

        {/* Scheduled Items List for Active Day */}
        {activeDayActivities.length === 0 ? (
          <div className="p-8 text-center bg-sand-50 rounded-2xl border border-slate-200/60 text-slate-500 text-xs font-medium">
            No activities scheduled for Day {selectedDayIndex + 1}. Browse activities or pick another day cell!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeDayActivities.map((item, actIndex) => {
              const isEditing = editingItemId === item.id;
              const displayCost = item.customCost !== undefined ? item.customCost : item.cost;

              return (
                <div
                  key={item.id || actIndex}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Item Details */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1 pt-1">
                      <GripVertical className="w-4 h-4 cursor-grab" />
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={actIndex === 0}
                          onClick={() => handleMoveActivity(selectedDayIndex, actIndex, 'up')}
                          className="p-0.5 hover:text-slate-900 disabled:opacity-20"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={actIndex === activeDayActivities.length - 1}
                          onClick={() => handleMoveActivity(selectedDayIndex, actIndex, 'down')}
                          className="p-0.5 hover:text-slate-900 disabled:opacity-20"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                        <span className="flex items-center gap-1 text-brand-600">
                          <Clock className="w-3.5 h-3.5" /> {item.scheduledTime || '10:00 AM'} ({item.durationHours}h)
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-600 font-extrabold">${displayCost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inline Edit Form vs Action Buttons */}
                  {isEditing ? (
                    <div className="flex items-center gap-2 bg-sand-50 p-2.5 rounded-xl border border-slate-200 w-full md:w-auto">
                      <input
                        type="text"
                        placeholder="Time (e.g. 09:00 AM)"
                        value={editForm.scheduledTime}
                        onChange={(e) => setEditForm({ ...editForm, scheduledTime: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border rounded bg-white font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Cost ($)"
                        value={editForm.customCost}
                        onChange={(e) => setEditForm({ ...editForm, customCost: e.target.value })}
                        className="w-20 px-2 py-1 text-xs border rounded bg-white font-bold"
                      />
                      <Button
                        size="xs"
                        variant="emerald"
                        icon={Check}
                        onClick={() => saveInlineEdit(selectedDayIndex, item.id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        icon={Edit3}
                        onClick={() => startEditing(item)}
                      >
                        Inline Edit
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
