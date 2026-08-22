import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Star, MapPin, Plus, Sparkles, ArrowRight } from 'lucide-react';

export const RecommendedDestinationsGrid = ({
  cities = [],
  onSelectCityForTrip
}) => {
  // Take top 6 cities sorted by popularity
  const topCities = [...cities]
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Recommended Destinations in India
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Top-rated spots based on seasonal weather, popularity, and culture
          </p>
        </div>

        <Link
          to="/discover"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          Browse All ({cities.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topCities.map((city) => (
          <Card
            key={city.id}
            padding="none"
            className="overflow-hidden group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <Badge variant="amber" icon={Star}>
                    {city.popularityScore}
                  </Badge>
                  <Badge variant="ocean">{city.costDisplay}</Badge>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  {city.region}
                </div>
              </div>

              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {city.name}
                  </h3>
                  <span className="text-xs font-extrabold text-slate-700 bg-sand-100 px-2 py-0.5 rounded-lg">
                    ₹{city.avgDailyCost}/day
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {city.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-1">
                  {city.tags.slice(0, 3).map((tag) => (
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

            <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                Best: {city.bestSeason}
              </span>

              <Button
                size="sm"
                variant="ghost"
                className="text-xs font-bold text-brand-600 hover:bg-brand-50"
                onClick={() => onSelectCityForTrip(city)}
              >
                <Plus className="w-3.5 h-3.5" /> Start Trip
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
