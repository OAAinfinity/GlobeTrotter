import React, { useState } from 'react';
import recommendationsData from '../../data/recommendations.json';
import { HotelCard } from './HotelCard';
import { Badge } from '../common/Badge';
import { Sparkles, Building, Compass, Layers } from 'lucide-react';

export const HotelRecommendationsWidget = ({ userTravelStyle = 'Heritage & Culture' }) => {
  const archetypes = recommendationsData.archetypes;
  const archetypeKeys = Object.keys(archetypes);

  // Initialize with user's travel style or fallback
  const initialKey = archetypeKeys.includes(userTravelStyle)
    ? userTravelStyle
    : 'Heritage & Culture';

  const [activeArchetypeKey, setActiveArchetypeKey] = useState(initialKey);

  const currentArchetypeData = archetypes[activeArchetypeKey] || archetypes['Heritage & Culture'];
  const recommendedHotels = currentArchetypeData.recommendations || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Archetype Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Hotel Recommendations Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Curated Stays for "{activeArchetypeKey}"
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentArchetypeData.description}
          </p>
        </div>

        {/* Archetype Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {archetypeKeys.map((key) => {
            const isSelected = activeArchetypeKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveArchetypeKey(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-warm-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Recommended Hotels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedHotels.map((hotel, idx) => (
          <HotelCard key={idx} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};
