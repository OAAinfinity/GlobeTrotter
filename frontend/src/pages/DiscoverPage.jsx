import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CityCard } from '../components/discovery/CityCard';
import { CityDetailModal } from '../components/discovery/CityDetailModal';
import { AddCityToTripModal } from '../components/discovery/AddCityToTripModal';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Search, Compass, Sparkles, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const REGIONS = [
  'All Regions',
  'North India',
  'South India',
  'West India',
  'East & North-East',
  'Himalayan Region'
];

const COST_LEVELS = [
  { id: 'all', label: 'All Budgets' },
  { id: '1', label: 'Budget (₹)' },
  { id: '2', label: 'Moderate (₹₹)' },
  { id: '3', label: 'Expensive (₹₹₹)' },
  { id: '4', label: 'Luxury (₹₹₹₹)' }
];

export const DiscoverPage = () => {
  const { cities } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCostIndex, setSelectedCostIndex] = useState('all');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'cost-asc', 'cost-desc', 'name'

  // Modals state
  const [selectedCityForDetail, setSelectedCityForDetail] = useState(null);
  const [selectedCityForAdd, setSelectedCityForAdd] = useState(null);

  // Processed cities based on search, region, cost index, and sorting
  const processedCities = useMemo(() => {
    return cities
      .filter((city) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          city.name.toLowerCase().includes(query) ||
          city.region.toLowerCase().includes(query) ||
          city.tags.some((t) => t.toLowerCase().includes(query));

        const matchesRegion =
          selectedRegion === 'All Regions' || city.region === selectedRegion;

        const matchesCost =
          selectedCostIndex === 'all' ||
          city.costIndex === Number(selectedCostIndex);

        return matchesSearch && matchesRegion && matchesCost;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') return b.popularityScore - a.popularityScore;
        if (sortBy === 'cost-asc') return a.avgDailyCost - b.avgDailyCost;
        if (sortBy === 'cost-desc') return b.avgDailyCost - a.avgDailyCost;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [cities, searchQuery, selectedRegion, selectedCostIndex, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ocean-700 via-ocean-600 to-teal-500 text-white p-6 sm:p-10 shadow-warm-lg">
        <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
          <Badge variant="emerald" icon={Compass} className="bg-white/20 text-white border-white/30">
            Explore 15+ Indian Travel Hubs
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover Indian Destinations
          </h1>
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            Search top-rated Indian cities, filter by regional vibe or cost budget, and add destinations directly to your multi-city trip itineraries.
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80"
            alt="Kerala Backwaters"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col gap-4">
        {/* Search Bar & Sort Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8">
            <Input
              placeholder="Search Indian cities, states, or tags (e.g. Jaipur, Kerala, Forts, Beaches)..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="cost-asc">Cost: Low to High</option>
              <option value="cost-desc">Cost: High to Low</option>
              <option value="name">City Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Filter by Region:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-brand-500 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Cost Index Pills */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Filter by Budget Tier:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {COST_LEVELS.map((cost) => (
              <button
                key={cost.id}
                type="button"
                onClick={() => setSelectedCostIndex(cost.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedCostIndex === cost.id
                    ? 'bg-ocean-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cost.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of City Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-500" />
            Destinations Catalog ({processedCities.length} Cities)
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Click any card to inspect details or "+ Add to Trip" to schedule
          </span>
        </div>

        {processedCities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm font-medium">
            No cities match your search filters. Try resetting region or budget filters!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedCities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onClick={() => setSelectedCityForDetail(city)}
                onOpenAddModal={(cityToSelect) => setSelectedCityForAdd(cityToSelect)}
              />
            ))}
          </div>
        )}
      </div>

      {/* City Detail Modal */}
      <CityDetailModal
        isOpen={Boolean(selectedCityForDetail)}
        onClose={() => setSelectedCityForDetail(null)}
        city={selectedCityForDetail}
      />

      {/* Add City to Trip Modal */}
      <AddCityToTripModal
        isOpen={Boolean(selectedCityForAdd)}
        onClose={() => setSelectedCityForAdd(null)}
        city={selectedCityForAdd}
      />
    </div>
  );
};
