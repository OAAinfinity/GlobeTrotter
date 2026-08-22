import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Tabs } from '../common/Tabs';
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Sun,
  SunMedium,
  Moon,
  Layers,
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';

export const TripItineraryView = ({ trip, cities, activities }) => {
  const [layoutMode, setLayoutMode] = useState('timeline'); // 'timeline' or 'grouped'

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

  // Create day-by-day mapping
  const daysList = [];
  let currentDayNum = 1;

  tripStops.forEach((leg) => {
    const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
    const cityName = city ? city.name : leg.cityName || 'Destination';
    const legDays = leg.days || 3;
    for (let d = 1; d <= legDays; d++) {
      daysList.push({
        dayNumber: currentDayNum,
        cityId: leg.cityId,
        cityName,
        legDay: d
      });
      currentDayNum++;
    }
  });

  if (daysList.length === 0) {
    for (let d = 1; d <= totalDays; d++) {
      daysList.push({
        dayNumber: d,
        cityId: 'city-1',
        cityName: 'Jaipur',
        legDay: d
      });
    }
  }

  // Selected activities list (catalog + custom)
  const catalogActs = activities.filter((a) =>
    trip.selectedActivities?.includes(a.id)
  );
  const customActs = trip.customActivities || [];
  const allTripActivities = [...catalogActs, ...customActs];

  return (
    <div className="flex flex-col gap-6">
      {/* Layout Toggle Bar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Structured Itinerary View
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between Day-by-Day Timeline and Grouped by City section views
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setLayoutMode('timeline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              layoutMode === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Timeline (Day-by-Day)
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('grouped')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              layoutMode === 'grouped'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Grouped by City
          </button>
        </div>
      </div>

      {/* LAYOUT A: DAY-BY-DAY TIMELINE VIEW */}
      {layoutMode === 'timeline' && (
        <div className="flex flex-col gap-6">
          {daysList.map((day) => {
            const dayActivities = allTripActivities.filter(
              (a) => a.dayNumber === day.dayNumber
            );
            const totalDayCost = dayActivities.reduce((s, a) => s + (a.cost || 0), 0);

            const morningActs = dayActivities.filter((a) => !a.timeSlot || a.timeSlot === 'Morning');
            const afternoonActs = dayActivities.filter((a) => a.timeSlot === 'Afternoon');
            const eveningActs = dayActivities.filter((a) => a.timeSlot === 'Evening');

            return (
              <Card key={day.dayNumber} padding="md" className="p-5 flex flex-col gap-4 border-slate-200/80">
                {/* Day Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center shadow-warm-sm">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Day {day.dayNumber} — <span className="text-brand-600">{day.cityName}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">Leg Day {day.legDay}</p>
                    </div>
                  </div>

                  <Badge variant="amber">
                    Day Total: ₹{totalDayCost.toLocaleString()}
                  </Badge>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Morning */}
                  <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200/50 flex flex-col gap-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-brand-500" /> Morning 🌅
                    </span>
                    {morningActs.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No events scheduled.</p>
                    ) : (
                      morningActs.map((act) => (
                        <div key={act.id} className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1 shadow-2xs">
                          <span className="font-bold text-slate-900">{act.title}</span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-bold text-emerald-600">
                              {act.cost === 0 ? 'Free' : `₹${act.cost}`}
                            </span>
                            <span>•</span>
                            <span>{act.durationHours}h</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Afternoon */}
                  <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200/50 flex flex-col gap-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <SunMedium className="w-3.5 h-3.5 text-brand-500" /> Afternoon ☀️
                    </span>
                    {afternoonActs.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No events scheduled.</p>
                    ) : (
                      afternoonActs.map((act) => (
                        <div key={act.id} className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1 shadow-2xs">
                          <span className="font-bold text-slate-900">{act.title}</span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-bold text-emerald-600">
                              {act.cost === 0 ? 'Free' : `₹${act.cost}`}
                            </span>
                            <span>•</span>
                            <span>{act.durationHours}h</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Evening */}
                  <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200/50 flex flex-col gap-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-brand-500" /> Evening 🌙
                    </span>
                    {eveningActs.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No events scheduled.</p>
                    ) : (
                      eveningActs.map((act) => (
                        <div key={act.id} className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1 shadow-2xs">
                          <span className="font-bold text-slate-900">{act.title}</span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-bold text-emerald-600">
                              {act.cost === 0 ? 'Free' : `₹${act.cost}`}
                            </span>
                            <span>•</span>
                            <span>{act.durationHours}h</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* LAYOUT B: GROUPED BY CITY SECTION VIEW */}
      {layoutMode === 'grouped' && (
        <div className="flex flex-col gap-6">
          {tripStops.map((leg, idx) => {
            const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
            const cityName = city ? city.name : leg.cityName || 'Destination';
            const cityImage = city?.image || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80';
            const dailyCost = city ? city.avgDailyCost : 2500;
            const stayDays = leg.days || 3;

            // Get all activities for this city leg
            const legActs = activities.filter((a) =>
              (leg.assignedActivities || []).includes(a.id)
            );

            const activitiesSubtotal = legActs.reduce((s, a) => s + (a.cost || 0), 0);
            const lodgingSubtotal = dailyCost * stayDays;
            const citySubtotal = lodgingSubtotal + activitiesSubtotal;

            return (
              <Card key={idx} padding="none" className="overflow-hidden border-slate-200/80">
                {/* City Section Header Banner */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cityImage}
                    alt={cityName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white z-10">
                    <Badge variant="brand">Stop #{idx + 1}</Badge>
                    <Badge variant="ocean">
                      {stayDays} {stayDays === 1 ? 'Day Stay' : 'Days Stay'}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold">{cityName}</h3>
                      <p className="text-xs text-brand-300 font-medium">
                        {leg.arrivalDate && leg.departureDate
                          ? `${leg.arrivalDate} to ${leg.departureDate}`
                          : 'Scheduled Leg'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-300 block">Section Subtotal</span>
                      <span className="text-base font-extrabold text-emerald-400">
                        ₹{citySubtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-5 flex flex-col gap-4">
                  {/* Lodging & Subtotal Summary */}
                  <div className="p-3 bg-sand-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Lodging Est ({stayDays}d × ₹{dailyCost}): <span className="font-bold text-slate-900">₹{lodgingSubtotal.toLocaleString()}</span>
                    </span>
                    <span>
                      Activities ({legActs.length}): <span className="font-bold text-brand-600">₹{activitiesSubtotal.toLocaleString()}</span>
                    </span>
                  </div>

                  {/* Activities List for City */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Activities & Experiences in {cityName}:
                    </span>

                    {legActs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No activities assigned to this city section.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {legActs.map((act) => (
                          <div
                            key={act.id}
                            className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/70 shadow-2xs"
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
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
