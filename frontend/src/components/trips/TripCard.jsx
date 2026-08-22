import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Calendar, MapPin, Eye, Edit3, Trash2, ArrowRight } from 'lucide-react';

export const TripCard = ({ trip, onDeleteRequest, className = '' }) => {
  const navigate = useNavigate();
  if (!trip) return null;

  const citiesCount = (trip.cities || []).length;
  const statusVariant = trip.status === 'Upcoming' ? 'emerald' : 'slate';

  const handleView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/trips/${trip.id}`);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/trips/${trip.id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteRequest) onDeleteRequest(trip);
  };

  return (
    <Card padding="none" className={`overflow-hidden flex flex-col justify-between h-full border-slate-200/80 group ${className}`}>
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={statusVariant}>
              {trip.status || 'Upcoming'}
            </Badge>
          </div>

          {/* Destination / Stops Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            {citiesCount} {citiesCount === 1 ? 'Destination' : 'Destinations / Stops'}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-2">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {trip.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{trip.startDate} to {trip.endDate}</span>
          </div>

          {trip.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer with Budget & Quick Actions */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Target Budget</span>
          <span className="text-xs font-extrabold text-slate-900">
            ${(trip.totalBudget || 0).toLocaleString()}
          </span>
        </div>

        {/* Quick Action Buttons: View / Edit / Delete */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleView}
            className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
            title="View Itinerary"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="p-2 text-slate-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-xl transition-colors"
            title="Edit Itinerary"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
