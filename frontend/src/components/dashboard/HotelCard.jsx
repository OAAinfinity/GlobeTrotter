import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Star, MapPin, Building, Trophy, Sparkles } from 'lucide-react';

export const HotelCard = ({ hotel }) => {
  if (!hotel) return null;

  return (
    <Card
      padding="none"
      className="overflow-hidden group flex flex-col justify-between h-full border-slate-200/80 hover:border-brand-300 transition-all duration-300"
    >
      <div>
        {/* City & Hotel Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={hotel.cityImage}
            alt={`${hotel.hotelName} in ${hotel.city}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Recommendation Rank & Score Badges */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-xl bg-brand-500 text-white text-xs font-extrabold shadow-warm-xs flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Rank #{hotel.rank}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <Badge variant="emerald" icon={Star}>
              {hotel.score} / 10
            </Badge>
          </div>

          {/* City Location Pill */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            {hotel.city}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
              {hotel.hotelName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="ocean" icon={Building}>
              {hotel.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* Footer with Price */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Est Rate
          </span>
          <span className="text-sm font-extrabold text-slate-900">
            ${hotel.pricePerNight}
            <span className="text-xs font-semibold text-slate-400">/night</span>
          </span>
        </div>

        <Button size="sm" variant="outline" className="text-xs font-bold">
          View Recommendation
        </Button>
      </div>
    </Card>
  );
};
