import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Star, MapPin, Plus } from 'lucide-react';

export const CityCard = ({ city, onOpenAddModal, onClick }) => {
  if (!city) return null;

  // Cost index level label mapping
  const costLabelMap = {
    1: { label: 'Budget ($)', variant: 'emerald' },
    2: { label: 'Moderate ($$)', variant: 'brand' },
    3: { label: 'Expensive ($$$)', variant: 'amber' },
    4: { label: 'Luxury ($$$$)', variant: 'rose' }
  };

  const costMeta = costLabelMap[city.costIndex] || costLabelMap[2];

  return (
    <Card
      padding="none"
      className="overflow-hidden group flex flex-col justify-between h-full border-slate-200/80 hover:border-brand-300 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div>
        {/* Cover Photo & Badges */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Badges Top */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <Badge variant="amber" icon={Star}>
              {city.popularityScore}
            </Badge>
            <Badge variant={costMeta.variant}>
              {costMeta.label}
            </Badge>
          </div>

          {/* Region Tag Bottom */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            {city.region}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              {city.name}, <span className="text-xs font-semibold text-slate-400">{city.country}</span>
            </h3>
            <span className="text-xs font-extrabold text-slate-700 bg-sand-100 px-2 py-0.5 rounded-lg">
              ${city.avgDailyCost}/day
            </span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {city.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {city.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer with Add to Trip Action */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400">
          Best Season: {city.bestSeason}
        </span>

        <Button
          size="sm"
          variant="primary"
          className="text-xs font-bold"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenAddModal) onOpenAddModal(city);
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Add to Trip
        </Button>
      </div>
    </Card>
  );
};
