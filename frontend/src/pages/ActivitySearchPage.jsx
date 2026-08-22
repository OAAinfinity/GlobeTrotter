import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityCard } from '../components/discovery/ActivityCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import {
  Search,
  Sparkles,
  Filter,
  Clock,
  DollarSign,
  Compass,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All Categories',
  'Sightseeing & Heritage',
  'Food & Culinary',
  'Spiritual & Culture',
  'Adventure & Water Sports',
  'Nature & Wildlife'
];

const COST_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'free', label: 'Free (₹0)' },
  { id: 'under-1000', label: 'Under ₹1,000' },
  { id: '1000-3000', label: '₹1,000 - ₹3,000' },
  { id: 'over-3000', label: 'Over ₹3,000' }
];

const DURATIONS = [
  { id: 'all', label: 'All Durations' },
  { id: 'short', label: 'Quick (< 2h)' },
  { id: 'medium', label: 'Half-Day (2 - 4h)' },
  { id: 'long', label: 'Full-Day (> 4h)' }
];

export const ActivitySearchPage = () => {
  const { activities, trips, updateTrip, currentUser } = useApp();

  const userTrips = trips.filter((t) => !currentUser || t.userId === currentUser.id);

  // Selected Trip State
  const [selectedTripId, setSelectedTripId] = useState(userTrips[0]?.id || '');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCostRange, setSelectedCostRange] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  const selectedTrip = trips.find((t) => t.id === selectedTripId);
  const selectedActivityIds = selectedTrip?.selectedActivities || [];

  // Toggle Activity Selection in Trip
  const handleToggleActivity = (activity) => {
    if (!selectedTrip) return;

    let updatedIds;
    if (selectedActivityIds.includes(activity.id)) {
      updatedIds = selectedActivityIds.filter((id) => id !== activity.id);
    } else {
      updatedIds = [...selectedActivityIds, activity.id];
    }

    updateTrip(selectedTrip.id, {
      selectedActivities: updatedIds
    });
  };

  // Processed Activities based on Search, Category, Cost Range, and Duration
  const processedActivities = useMemo(() => {
    return activities.filter((act) => {
      // Keyword Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        act.title.toLowerCase().includes(query) ||
        act.description.toLowerCase().includes(query) ||
        (act.cityName && act.cityName.toLowerCase().includes(query)) ||
        act.category.toLowerCase().includes(query);

      // Category Filter
      const matchesCategory =
        selectedCategory === 'All Categories' || act.category === selectedCategory;

      // Cost Range Filter
      let matchesCost = true;
      if (selectedCostRange === 'free') matchesCost = act.cost === 0;
      else if (selectedCostRange === 'under-1000') matchesCost = act.cost > 0 && act.cost < 1000;
      else if (selectedCostRange === '1000-3000') matchesCost = act.cost >= 1000 && act.cost <= 3000;
      else if (selectedCostRange === 'over-3000') matchesCost = act.cost > 3000;

      // Duration Filter
      let matchesDuration = true;
      if (selectedDuration === 'short') matchesDuration = act.durationHours < 2;
      else if (selectedDuration === 'medium') matchesDuration = act.durationHours >= 2 && act.durationHours <= 4;
      else if (selectedDuration === 'long') matchesDuration = act.durationHours > 4;

      return matchesSearch && matchesCategory && matchesCost && matchesDuration;
    });
  }, [activities, searchQuery, selectedCategory, selectedCostRange, selectedDuration]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-amber-500 to-amber-600 text-white p-6 sm:p-10 shadow-warm-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <Badge variant="amber" icon={Sparkles} className="bg-white/20 text-white border-white/30">
              Activity & Experience Search
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Explore Experiences Across India
            </h1>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Search 25+ curated Indian experiences, filter by category, price, or duration, and toggle additions live into your travel itineraries.
            </p>
          </div>

          {/* Trip Selector Header Widget */}
          {userTrips.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col gap-2 w-full md:w-80 shrink-0">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-amber-300" /> Active Target Trip
              </span>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 focus:outline-none cursor-pointer"
              >
                {userTrips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.selectedActivities?.length || 0} Scheduled)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col gap-5">
        {/* Search Input */}
        <Input
          placeholder="Search activities by title, city, or keywords (e.g. Amber Fort, Boat Ride, Sadhya, Rafting)..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Pills */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Filter by Activity Type:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cost Range & Duration Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Cost Range */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Cost Range (₹ INR):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {COST_RANGES.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setSelectedCostRange(range.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedCostRange === range.id
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {DURATIONS.map((dur) => (
                <button
                  key={dur.id}
                  type="button"
                  onClick={() => setSelectedDuration(dur.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedDuration === dur.id
                      ? 'bg-ocean-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Activity Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-500" />
            Activities Catalog ({processedActivities.length} Experiences)
          </h2>

          {selectedTrip && (
            <span className="text-xs text-brand-600 font-bold">
              Editing: {selectedTrip.title} ({selectedActivityIds.length} Scheduled)
            </span>
          )}
        </div>

        {processedActivities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm font-medium">
            No activities match your search filters. Try resetting category, cost range, or duration filters!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedActivities.map((act) => {
              const isScheduled = selectedActivityIds.includes(act.id);

              return (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  isSelected={isScheduled}
                  onToggleSelect={handleToggleActivity}
                  showSelectButton={Boolean(selectedTrip)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
