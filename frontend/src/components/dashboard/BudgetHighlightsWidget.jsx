import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DollarSign, Calendar, TrendingUp, Sparkles, Clock } from 'lucide-react';

export const BudgetHighlightsWidget = ({ trips = [] }) => {
  // Calculate total planned spend across all user trips
  const totalPlannedSpend = trips.reduce(
    (sum, trip) => sum + (trip.totalBudget || 0),
    0
  );

  // Calculate upcoming trip departure countdown
  const getUpcomingCountdown = () => {
    const upcomingTrips = trips
      .filter((t) => t.status === 'Upcoming' && t.startDate)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    if (upcomingTrips.length === 0) return null;

    const nextTrip = upcomingTrips[0];
    const today = new Date();
    const startDate = new Date(nextTrip.startDate);
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      tripTitle: nextTrip.title,
      daysLeft: diffDays > 0 ? diffDays : 0,
      startDate: nextTrip.startDate
    };
  };

  const countdown = getUpcomingCountdown();

  // Average spend per trip
  const avgSpendPerTrip = trips.length > 0 ? Math.round(totalPlannedSpend / trips.length) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Planned Spend Card */}
      <Card className="p-6 flex flex-col justify-between border-brand-200 bg-gradient-to-br from-brand-50/50 to-white shadow-warm-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Planned Spend
          </span>
          <div className="p-2 rounded-xl bg-brand-500 text-white shadow-warm-xs">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ${totalPlannedSpend.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Across {trips.length} saved travel {trips.length === 1 ? 'itinerary' : 'itineraries'}
          </p>
        </div>
      </Card>

      {/* Next Trip Countdown Widget */}
      <Card className="p-6 flex flex-col justify-between border-ocean-200 bg-gradient-to-br from-ocean-50/50 to-white shadow-warm-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Next Trip Departure
          </span>
          <div className="p-2 rounded-xl bg-ocean-600 text-white shadow-warm-xs">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          {countdown ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {countdown.daysLeft}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {countdown.daysLeft === 1 ? 'day remaining' : 'days remaining'}
                </span>
              </div>
              <p className="text-xs text-ocean-700 font-semibold truncate mt-1">
                "{countdown.tripTitle}"
              </p>
            </div>
          ) : (
            <div>
              <span className="text-base font-bold text-slate-700">No Upcoming Trips</span>
              <p className="text-xs text-slate-400 mt-1">Create a trip to track countdown</p>
            </div>
          )}
        </div>
      </Card>

      {/* Avg Spend & Analytics Summary */}
      <Card className="p-6 flex flex-col justify-between border-slate-200/80 shadow-warm-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Spend / Trip
          </span>
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-warm-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ${avgSpendPerTrip.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Est lodging, transport & activities
          </p>
        </div>
      </Card>
    </div>
  );
};
