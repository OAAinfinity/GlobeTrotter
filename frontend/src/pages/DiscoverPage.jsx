import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CityDetailModal } from '../components/discovery/CityDetailModal';
import { TripWizardModal } from '../components/trips/TripWizardModal';
import {
  Search,
  Star,
  MapPin,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Compass
} from 'lucide-react';

export const DiscoverPage = () => {
  const { cities } = useApp();

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCostIndex, setSelectedCostIndex] = useState('All'); // 'All', 1, 2, 3, 4
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'cost-asc', 'cost-desc', 'name'

  // Modal States
  const [selectedCityForDetail, setSelectedCityForDetail] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialCity, setWizardInitialCity] = useState(null);

  const regions = [
    'All',
    'North India',
    'South India',
    'West India',
    'East & North-East',
    'Himalayan Region'
  ];

  const costFilters = [
    { label: 'All Budgets', value: 'All' },
    { label: '₹ Budget', value: 1 },
    { label: '₹₹ Moderate', value: 2 },
    { label: '₹₹₹ Premium', value: 3 },
    { label: '₹₹₹₹ Luxury', value: 4 }
  ];

  // Filtering & Sorting Logic
  const processedCities = useMemo(() => {
    return cities
      .filter((city) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          city.name.toLowerCase().includes(query) ||
          city.country.toLowerCase().includes(query) ||
          city.tags.some((t) => t.toLowerCase().includes(query));

        const matchesRegion =
          selectedRegion === 'All' || city.region === selectedRegion;

        const matchesCost =
          selectedCostIndex === 'All' || city.costIndex === Number(selectedCostIndex);

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

  const handleStartTripWithCity = (city) => {
    setWizardInitialCity(city);
    setIsWizardOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-700 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Incredible India Catalog ({cities.length} Destinations)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Destinations Across India
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Explore royal fortresses, tropical backwaters, Himalayan passes, spiritual ghats, and beach retreats. Compare daily budgets and plan your itinerary.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setWizardInitialCity(null);
            setIsWizardOpen(true);
          }}
        >
          Plan Multi-City India Trip
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6">
            <Input
              placeholder="Search by city (e.g. Jaipur), state (Rajasthan), or tag (Ghats)..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Cost Index Filter */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {costFilters.map((cost) => (
                <button
                  key={cost.label}
                  onClick={() => setSelectedCostIndex(cost.value)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                    selectedCostIndex === cost.value
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cost.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 flex items-center justify-end">
            <div className="relative w-full flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="popularity">Sort by Most Popular</option>
                <option value="cost-asc">Sort by Daily Cost (Low to High)</option>
                <option value="cost-desc">Sort by Daily Cost (High to Low)</option>
                <option value="name">Sort by Name (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Region:
          </span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRegion === reg
                  ? 'bg-brand-500 text-white shadow-sm font-bold'
                  : 'bg-sand-100 text-slate-600 hover:bg-sand-200'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Results Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          Showing <span className="font-bold text-slate-900">{processedCities.length}</span> of {cities.length} Indian destinations
        </span>
        {searchQuery || selectedRegion !== 'All' || selectedCostIndex !== 'All' ? (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('All');
              setSelectedCostIndex('All');
              setSortBy('popularity');
            }}
            className="text-brand-600 hover:underline font-bold"
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      {/* City Catalog Grid */}
      {processedCities.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center gap-3">
          <Sparkles className="w-12 h-12 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No destinations found</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Try adjusting your search keywords, budget filters, or region selection.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('All');
              setSelectedCostIndex('All');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedCities.map((city) => (
            <Card
              key={city.id}
              padding="none"
              className="overflow-hidden group flex flex-col justify-between"
              onClick={() => setSelectedCityForDetail(city)}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-52 overflow-hidden">
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

                {/* Body Content */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {city.name}
                    </h3>
                    <span className="text-xs font-extrabold text-slate-700 bg-sand-100 px-2 py-0.5 rounded-lg">
                      ₹{city.avgDailyCost}/day
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

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  Best: {city.bestSeason}
                </span>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs font-bold text-brand-600 hover:bg-brand-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartTripWithCity(city);
                  }}
                >
                  <Plus className="w-3.5 h-3.5" /> Start Trip
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* City Detail Modal */}
      <CityDetailModal
        city={selectedCityForDetail}
        isOpen={Boolean(selectedCityForDetail)}
        onClose={() => setSelectedCityForDetail(null)}
        onStartTripWithCity={handleStartTripWithCity}
      />

      {/* Trip Wizard Modal */}
      <TripWizardModal
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardInitialCity(null);
        }}
        initialCity={wizardInitialCity}
      />
    </div>
  );
};
