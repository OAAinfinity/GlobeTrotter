import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { TripCard } from '../trips/TripCard';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Compass, Plus, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

export const RecentTripsRow = ({ trips = [], onPlanNewTrip }) => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-500" />
            Recent Trips ({trips.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Horizontally scrollable list of your saved multi-city itineraries
          </p>
        </div>

        {trips.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/trips"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
            >
              View All Trips ➔
            </Link>
          </div>
        )}
      </div>

      {/* Empty State vs Horizontal Scroll Container */}
      {trips.length === 0 ? (
        <Card className="text-center py-12 flex flex-col items-center gap-3 border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No trips created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            You don’t have any saved multi-city itineraries. Select destinations from our catalog or start fresh!
          </p>
          <Button size="sm" variant="primary" icon={Plus} onClick={onPlanNewTrip}>
            Plan Your First Trip
          </Button>
        </Card>
      ) : (
        <div
          ref={scrollRef}
          className="flex items-center gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {trips.map((trip) => (
            <div key={trip.id} className="w-[300px] sm:w-[340px] snap-start shrink-0">
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
