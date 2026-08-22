import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Plus, Compass, Sparkles, MapPin } from 'lucide-react';

export const DashboardHeader = ({ user, activeTripsCount = 0, onPlanNewTrip }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 p-6 sm:p-10 text-white shadow-warm-lg">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="amber" className="bg-white/20 text-white border-white/30">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Back
            </Badge>
            {user?.travelStyle && (
              <span className="px-3 py-0.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
                {user.travelStyle}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Namaste, {user?.name || 'Explorer'}! 👋
          </h1>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Ready to craft your next multi-city Indian adventure? You have{' '}
            <span className="font-bold underline decoration-amber-300">
              {activeTripsCount} active {activeTripsCount === 1 ? 'trip' : 'trips'}
            </span>{' '}
            in your itinerary planner.
          </p>

          {user?.homeCity && (
            <span className="text-xs text-white/80 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" /> Home Base: {user.homeCity}
            </span>
          )}
        </div>

        {/* Prominent CTA */}
        <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="secondary"
            size="lg"
            icon={Plus}
            onClick={onPlanNewTrip}
            className="w-full md:w-auto shadow-lg hover:scale-105 transition-transform"
          >
            Plan New Trip
          </Button>
        </div>
      </div>

      {/* Decorative background overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80"
          alt="Rajasthan Heritage"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
