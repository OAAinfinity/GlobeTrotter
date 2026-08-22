import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import {
  Calendar,
  Clock,
  DollarSign,
  Edit3,
  GripVertical,
  MoveUp,
  MoveDown,
  Check,
  X,
  Sparkles,
  MapPin,
  Sun,
  SunMedium,
  Moon,
  Trash2,
  Plus
} from 'lucide-react';

export const TripCalendarTimelineView = ({
  trip,
  cities = [],
  activities = [],
  onUpdateTrip
}) => {
  if (!trip) return null;

  const tripStops = trip.cities || [];

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

  // Create day-by-day dates list
  const daysList = useMemo(() => {
    const list = [];
    let currentDayNum = 1;
    const startDateObj = trip.startDate ? new Date(trip.startDate) : new Date();

    tripStops.forEach((leg) => {
      const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
      const cityName = city ? city.name : leg.cityName || 'Destination';
      const legDays = leg.days || 3;

      for (let d = 1; d <= legDays; d++) {
        const dateObj = new Date(startDateObj);
        dateObj.setDate(startDateObj.getDate() + (currentDayNum - 1));
        const dateString = dateObj.toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric'
        });

        list.push({
          dayNumber: currentDayNum,
          dateString,
          cityName,
          legDay: d
        });
        currentDayNum++;
      }
    });

    if (list.length === 0) {
      for (let d = 1; d <= totalDays; d++) {
        const dateObj = new Date(startDateObj);
        dateObj.setDate(startDateObj.getDate() + (d - 1));
        const dateString = dateObj.toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric'
        });
        list.push({
          dayNumber: d,
          dateString,
          cityName: 'Jaipur',
          legDay: d
        });
      }
    }

    return list;
  }, [tripStops, cities, trip.startDate, totalDays]);

  // Selected Day State
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  // Inline editing state for an activity: { id, cost, timeSlot, durationHours }
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editForm, setEditForm] = useState({ cost: 0, timeSlot: 'Morning', durationHours: 2 });

  // Drag-and-drop state for activities within a day
  const [draggedActivityIndex, setDraggedActivityIndex] = useState(null);

  // All trip activities list
  const catalogActs = activities.filter((a) =>
    trip.selectedActivities?.includes(a.id)
  );
  const customActs = trip.customActivities || [];
  const allTripActivities = [...catalogActs, ...customActs];

  // Activities for selected day
  const selectedDayObj = daysList.find((d) => d.dayNumber === selectedDayNumber) || daysList[0];
  const dayActivities = allTripActivities.filter((a) => (a.dayNumber || 1) === selectedDayNumber);

  // Start Editing Activity Inline
  const handleStartEdit = (act) => {
    setEditingActivityId(act.id);
    setEditForm({
      cost: act.cost || 0,
      timeSlot: act.timeSlot || 'Morning',
      durationHours: act.durationHours || 2
    });
  };

  // Save Inline Edit Activity
  const handleSaveInlineEdit = (actId) => {
    // Update customActivities or create custom override
    const updatedCustoms = [...(trip.customActivities || [])];
    const customIdx = updatedCustoms.findIndex((a) => a.id === actId);

    if (customIdx >= 0) {
      updatedCustoms[customIdx] = {
        ...updatedCustoms[customIdx],
        cost: Number(editForm.cost),
        timeSlot: editForm.timeSlot,
        durationHours: Number(editForm.durationHours)
      };
    } else {
      const catalogAct = activities.find((a) => a.id === actId);
      if (catalogAct) {
        updatedCustoms.push({
          ...catalogAct,
          cost: Number(editForm.cost),
          timeSlot: editForm.timeSlot,
          durationHours: Number(editForm.durationHours),
          dayNumber: selectedDayNumber
        });
      }
    }

    onUpdateTrip(trip.id, {
      customActivities: updatedCustoms
    });

    setEditingActivityId(null);
  };

  // Move Activity Up / Down within selected day
  const handleMoveActivity = (idx, direction) => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= dayActivities.length) return;

    const reorderedDayActs = [...dayActivities];
    const temp = reorderedDayActs[idx];
    reorderedDayActs[idx] = reorderedDayActs[targetIdx];
    reorderedDayActs[targetIdx] = temp;

    // Save order in trip customActivities or activity order
    const otherActs = allTripActivities.filter((a) => (a.dayNumber || 1) !== selectedDayNumber);
    const newAll = [...otherActs, ...reorderedDayActs];

    onUpdateTrip(trip.id, {
      customActivities: newAll
    });
  };

  // Drag-and-Drop Handlers for Activities within Day
  const handleDragStart = (e, idx) => {
    setDraggedActivityIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    if (draggedActivityIndex === null || draggedActivityIndex === dropIdx) return;

    const reorderedDayActs = [...dayActivities];
    const draggedItem = reorderedDayActs[draggedActivityIndex];
    reorderedDayActs.splice(draggedActivityIndex, 1);
    reorderedDayActs.splice(dropIdx, 0, draggedItem);

    setDraggedActivityIndex(null);
    const otherActs = allTripActivities.filter((a) => (a.dayNumber || 1) !== selectedDayNumber);
    const newAll = [...otherActs, ...reorderedDayActs];

    onUpdateTrip(trip.id, {
      customActivities: newAll
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Interactive Trip Calendar & Timeline Grid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any day cell to expand details, drag activities to reorder, and edit time/cost inline.
          </p>
        </div>

        <Badge variant="amber" icon={Calendar}>
          {daysList.length} Days Itinerary
        </Badge>
      </div>

      {/* CALENDAR DATE GRID (Spanning Date Range) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {daysList.map((day) => {
          const dayActs = allTripActivities.filter((a) => (a.dayNumber || 1) === day.dayNumber);
          const isSelected = selectedDayNumber === day.dayNumber;
          const totalDayActCost = dayActs.reduce((s, a) => s + (a.cost || 0), 0);

          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 min-h-36 ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/80 ring-2 ring-brand-400/30 shadow-warm-sm scale-102'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div>
                {/* Header Date & City */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-extrabold text-slate-900">
                    {day.dateString}
                  </span>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-100/70 px-1.5 py-0.5 rounded">
                    D{day.dayNumber}
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-slate-500 truncate mb-2">
                  📍 {day.cityName}
                </p>

                {/* Plotted Activity Chips */}
                <div className="flex flex-col gap-1 max-h-16 overflow-hidden">
                  {dayActs.slice(0, 2).map((act) => (
                    <div
                      key={act.id}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-800 truncate flex items-center justify-between gap-1"
                    >
                      <span className="truncate">{act.title}</span>
                      <span className="font-extrabold text-emerald-600 shrink-0">
                        ₹{act.cost}
                      </span>
                    </div>
                  ))}
                  {dayActs.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-bold">
                      +{dayActs.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Day Subtotal Summary */}
              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] mt-2">
                <span className="text-slate-400 font-medium">{dayActs.length} acts</span>
                <span className="font-extrabold text-emerald-600">₹{totalDayActCost}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* EXPANDED DAY DETAIL PANEL FOR SELECTED DAY */}
      <Card className="p-6 flex flex-col gap-5 border-brand-200 shadow-warm-sm bg-gradient-to-b from-sand-50/40 to-white">
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white font-extrabold text-sm flex items-center justify-center shadow-warm-sm">
              D{selectedDayObj?.dayNumber}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                Day {selectedDayObj?.dayNumber} Detail Panel —{' '}
                <span className="text-brand-600">{selectedDayObj?.cityName}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {selectedDayObj?.dateString} • Reorder activities or edit time/cost inline below
              </p>
            </div>
          </div>

          <Badge variant="amber">
            {dayActivities.length} {dayActivities.length === 1 ? 'Activity' : 'Activities'} Scheduled
          </Badge>
        </div>

        {/* Day Activities List with DnD & Inline Editing */}
        {dayActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs italic">
            No activities scheduled for Day {selectedDayObj?.dayNumber} ({selectedDayObj?.cityName}). Click "+ Add Experience" in the itinerary tab to add items!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Drag Handle (⣿) or Use Arrows to Reorder • Click Edit to Adjust Time & Cost:
            </span>

            {dayActivities.map((act, idx) => {
              const isEditing = editingActivityId === act.id;

              return (
                <div
                  key={act.id}
                  draggable={!isEditing}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isEditing
                      ? 'bg-brand-50/60 border-brand-300 ring-2 ring-brand-200 shadow-md'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {isEditing ? (
                    /* INLINE EDIT FORM */
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-brand-500" />
                          Inline Edit: {act.title}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            icon={Check}
                            onClick={() => handleSaveInlineEdit(act.id)}
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            icon={X}
                            onClick={() => setEditingActivityId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Time Slot / Time
                          </label>
                          <select
                            value={editForm.timeSlot}
                            onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                          >
                            <option value="Morning">Morning 🌅</option>
                            <option value="Afternoon">Afternoon ☀️</option>
                            <option value="Evening">Evening 🌙</option>
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="06:30 PM">06:30 PM</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Cost (₹ INR)
                          </label>
                          <input
                            type="number"
                            value={editForm.cost}
                            onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Duration (Hours)
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={editForm.durationHours}
                            onChange={(e) => setEditForm({ ...editForm, durationHours: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* READ CARD WITH REORDER & EDIT ACTION */
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Drag Handle */}
                        <span
                          className="p-1 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing shrink-0"
                          title="Drag to reorder within day"
                        >
                          <GripVertical className="w-4 h-4" />
                        </span>

                        <img
                          src={act.image}
                          alt={act.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100 shadow-2xs"
                        />

                        <div className="truncate flex-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {act.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-extrabold text-emerald-600">
                              {act.cost === 0 ? 'Free' : `₹${act.cost}`}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-slate-600">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {act.timeSlot || 'Morning'} ({act.durationHours}h)
                            </span>
                            <span>•</span>
                            <span className="text-brand-600 font-semibold">{act.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Reorder Up/Down */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveActivity(idx, 'up')}
                          className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === dayActivities.length - 1}
                          onClick={() => handleMoveActivity(idx, 'down')}
                          className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Inline Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(act)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors ml-1"
                          title="Quick Inline Edit Time & Cost"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
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
