import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ActivityCard } from './ActivityCard';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Compass,
  Plus,
  Sparkles,
  Info
} from 'lucide-react';

export const CityDetailModal = ({
  city,
  isOpen,
  onClose,
  onStartTripWithCity,
}) => {
  const { activities } = useApp();

  if (!city) return null;

  const cityActivities = activities.filter((act) => act.cityId === city.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="-m-6 -mt-6 flex flex-col gap-6">
        {/* Hero Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Badges Top */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Badge variant="amber" icon={Star}>
                {city.popularityScore} Score
              </Badge>
              <Badge variant="ocean">{city.costDisplay}</Badge>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
              {city.region}
            </div>
          </div>

          {/* Title & Location Bottom */}
          <div className="absolute bottom-4 left-6 right-6 text-white z-10">
            <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              {city.country}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {city.name}
            </h2>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sand-50 p-4 rounded-2xl border border-slate-200/60">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Avg Daily Expense
              </span>
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-0.5">
                ₹{city.avgDailyCost}/day
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Best Season
              </span>
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-brand-500" />
                {city.bestSeason}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Cost Index
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {city.costDisplay} ({city.costIndex}/4)
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Activities
              </span>
              <span className="text-sm font-extrabold text-brand-600">
                {cityActivities.length} Featured
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-500" /> About {city.name}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {city.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {city.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Top Activities in City */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Curated Activities in {city.name}
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {cityActivities.length} available
              </span>
            </div>

            {cityActivities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No mock activities available for this city yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cityActivities.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => {
                onClose();
                if (onStartTripWithCity) onStartTripWithCity(city);
              }}
            >
              Start New Trip with {city.name}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
