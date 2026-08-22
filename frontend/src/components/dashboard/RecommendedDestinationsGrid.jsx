import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Star, MapPin, Plus, ArrowRight, Compass } from 'lucide-react';

export const RecommendedDestinationsGrid = ({ cities = [], onSelectCity }) => {
  // Top 6 featured global cities
  const topCities = cities.slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Top Global Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Handpicked bucket-list cities with average daily costs and travel insights
          </p>
        </div>

        <a
          href="/discover"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          View All 19 Cities <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topCities.map((city) => (
          <Card
            key={city.id}
            padding="none"
            className="overflow-hidden group flex flex-col justify-between h-full border-slate-200/80 hover:border-brand-300 transition-all duration-300"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
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
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {city.name}, <span className="text-xs font-semibold text-slate-400">{city.country}</span>
                </h3>

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

            <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">
                ${city.avgDailyCost}<span className="text-xs font-normal text-slate-400">/day</span>
              </span>

              <Button
                size="sm"
                variant="primary"
                onClick={() => onSelectCity && onSelectCity(city)}
                icon={Plus}
              >
                Plan Trip
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
