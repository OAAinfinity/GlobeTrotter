import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  DollarSign,
  Calendar,
  Compass,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const BudgetHighlightsWidget = ({ trips = [] }) => {
  // Compute Total Planned Spend
  const totalPlannedSpend = trips.reduce(
    (sum, t) => sum + (Number(t.totalBudget) || 0),
    0
  );

  // Compute Total Estimated Cost
  const totalEstimatedCost = trips.reduce(
    (sum, t) => sum + (Number(t.estimatedCost) || 0),
    0
  );

  // Upcoming Trips
  const upcomingTrips = trips.filter((t) => t.status === 'Upcoming');

  // Compute Days until next trip
  const calculateDaysUntilNextTrip = () => {
    if (upcomingTrips.length === 0) return null;
    const sorted = [...upcomingTrips].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
    const nextTrip = sorted[0];
    const today = new Date();
    const start = new Date(nextTrip.startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      trip: nextTrip,
      days: diffDays > 0 ? diffDays : 0
    };
  };

  const nextTripInfo = calculateDaysUntilNextTrip();

  // Average spend per trip
  const avgSpendPerTrip =
    trips.length > 0 ? Math.round(totalPlannedSpend / trips.length) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Budget & Travel Highlights
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time summary of your planned expenditure and departure timeline
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Planned Budget */}
        <Card hoverEffect={false} className="flex flex-col justify-between border-slate-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Planned Spend
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹{totalPlannedSpend.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Across {trips.length} saved {trips.length === 1 ? 'trip' : 'trips'}
            </p>
          </div>
        </Card>

        {/* Card 2: Upcoming Trip Countdown */}
        <Card hoverEffect={false} className="flex flex-col justify-between border-slate-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Next Departure
            </span>
            <div className="w-9 h-9 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {nextTripInfo ? (
              <>
                <span className="text-2xl font-extrabold text-slate-900">
                  {nextTripInfo.days} Days Away
                </span>
                <p className="text-[11px] text-ocean-700 font-semibold truncate mt-0.5">
                  {nextTripInfo.trip.title}
                </p>
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-slate-500">No upcoming trips</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Plan a new itinerary</p>
              </>
            )}
          </div>
        </Card>

        {/* Card 3: Avg Spend per Trip */}
        <Card hoverEffect={false} className="flex flex-col justify-between border-slate-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Spend / Trip
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹{avgSpendPerTrip.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Average target budget
            </p>
          </div>
        </Card>

        {/* Card 4: Estimated Expenses */}
        <Card hoverEffect={false} className="flex flex-col justify-between border-slate-200/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Estimated Expenses
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600">
              ₹{totalEstimatedCost.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Activities & lodging estimate
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
