import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Building,
  Sparkles,
  LayoutGrid,
  ListOrdered
} from 'lucide-react';

export const TripItineraryView = ({
  trip,
  cities = [],
  activities = []
}) => {
  const [layoutMode, setLayoutMode] = useState('timeline'); // 'timeline' or 'cities'

  if (!trip) return null;

  const tripStops = trip.cities || [];
  const selectedActivityObjs = activities.filter((a) =>
    (trip.selectedActivities || []).includes(a.id)
  );

  const calculateTotalDays = () => {
    if (!trip.startDate || !trip.endDate) return 7;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 7;
  };

  const totalDays = calculateTotalDays();

  // Estimate total lodging subtotal
  const lodgingSubtotal = tripStops.reduce((sum, leg) => {
    const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
    const rate = city ? city.avgDailyCost : 200;
    return sum + rate * (leg.days || 3);
  }, 0);

  // Estimate total activities subtotal
  const activitiesSubtotal = selectedActivityObjs.reduce(
    (sum, a) => sum + (a.cost || 0),
    0
  );

  const totalEstCost = lodgingSubtotal + activitiesSubtotal;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Layout Toggle Controls */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-warm-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Structured Read-Only Itinerary View
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between day-by-day timeline view and city stops sections
          </p>
        </div>

        {/* Layout Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => setLayoutMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              layoutMode === 'timeline'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" /> Timeline View (Day-by-Day)
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('cities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              layoutMode === 'cities'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Grouped by City
          </button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3 border-slate-200/80">
          <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
            <span className="text-sm font-extrabold text-slate-900">{totalDays} Days ({tripStops.length} Stops)</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border-slate-200/80">
          <div className="p-2.5 rounded-2xl bg-ocean-50 text-ocean-600 font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lodging Subtotal</span>
            <span className="text-sm font-extrabold text-slate-900">${lodgingSubtotal.toLocaleString()}</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border-slate-200/80">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Estimated Cost</span>
            <span className="text-sm font-extrabold text-emerald-600">${totalEstCost.toLocaleString()}</span>
          </div>
        </Card>
      </div>

      {/* VIEW 1: TIMELINE VIEW (DAY-BY-DAY) */}
      {layoutMode === 'timeline' && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: totalDays }, (_, i) => {
            const dayNum = i + 1;
            const currentLegIndex = Math.min(
              Math.floor((i / totalDays) * tripStops.length),
              tripStops.length - 1
            );
            const currentLeg = tripStops[currentLegIndex] || { cityName: 'Destination' };

            const dayActivities = selectedActivityObjs.filter(
              (_, idx) => idx % totalDays === i
            );

            return (
              <Card key={i} className="p-5 border-slate-200/80 flex flex-col gap-4 shadow-warm-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-brand-500 text-white rounded-xl text-xs font-extrabold shadow-xs">
                      Day {dayNum}
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" /> {currentLeg.cityName}
                    </span>
                  </div>
                  <Badge variant="amber">{dayActivities.length} Activities</Badge>
                </div>

                {/* Day Schedule Activities */}
                {dayActivities.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    Free exploration & leisure day in {currentLeg.cityName}.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dayActivities.map((act, actIdx) => (
                      <div
                        key={actIdx}
                        className="p-3 bg-sand-50 rounded-2xl border border-slate-200/60 flex items-center gap-3"
                      >
                        <img
                          src={act.image}
                          alt={act.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="truncate flex-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {act.title}
                          </h4>
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
              </Card>
            );
          })}
        </div>
      )}

      {/* VIEW 2: GROUPED BY CITY VIEW */}
      {layoutMode === 'cities' && (
        <div className="flex flex-col gap-6">
          {tripStops.map((leg, idx) => {
            const cityObj = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
            const cityActivities = selectedActivityObjs.filter(
              (a) => a.cityId === leg.cityId || a.cityName === leg.cityName
            );

            return (
              <Card key={idx} padding="none" className="overflow-hidden border-slate-200/80 shadow-warm-xs">
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={cityObj ? cityObj.image : 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
                    alt={leg.cityName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />

                  <div className="absolute bottom-4 left-6 z-10 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-300">
                      Stop #{idx + 1}
                    </span>
                    <h3 className="text-2xl font-extrabold">{leg.cityName}</h3>
                  </div>

                  <div className="absolute top-4 right-6 z-10">
                    <Badge variant="amber">{leg.days || 3} Days Stay</Badge>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Scheduled Experiences in {leg.cityName}:
                  </h4>

                  {cityActivities.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No activities selected for this city stop.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cityActivities.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 bg-sand-50 rounded-2xl border border-slate-200/60 flex items-center gap-3"
                        >
                          <img
                            src={act.image}
                            alt={act.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="truncate flex-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {act.title}
                            </h4>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mt-1">
                              <span>{act.durationHours} hrs</span>
                              <span className="font-extrabold text-emerald-600">${act.cost}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
