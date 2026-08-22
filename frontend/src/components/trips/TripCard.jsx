import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export const TripCard = ({ trip, className = '' }) => {
  if (!trip) return null;

  const citiesCount = (trip.cities || []).length;
  const statusVariant = trip.status === 'Upcoming' ? 'emerald' : 'slate';

  return (
    <Link to={`/trips/${trip.id}`} className={`block group shrink-0 ${className}`}>
      <Card padding="none" className="overflow-hidden flex flex-col justify-between h-full border-slate-200/80">
        <div>
          {/* Cover Image & Badges */}
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={trip.coverImage}
              alt={trip.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            <div className="absolute top-3 right-3">
              <Badge variant={statusVariant}>
                {trip.status || 'Upcoming'}
              </Badge>
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              {citiesCount} {citiesCount === 1 ? 'City Leg' : 'City Legs'}
            </div>
          </div>

          {/* Title & Dates */}
          <div className="p-5 flex flex-col gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {trip.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{trip.startDate} to {trip.endDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Budget & Arrow */}
        <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">
            Budget: <span className="font-extrabold text-slate-900">₹{(trip.totalBudget || 0).toLocaleString()}</span>
          </span>

          <span className="text-xs font-bold text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Itinerary <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
