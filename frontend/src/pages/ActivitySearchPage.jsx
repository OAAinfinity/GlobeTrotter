import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityCard } from '../components/discovery/ActivityCard';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Search, Compass, Sparkles, Filter, Check, MapPin, DollarSign, Calendar } from 'lucide-react';

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
  { id: 'free', label: 'Free' },
  { id: 'under30', label: 'Under $30' },
  { id: '30-60', label: '$30 - $60' },
  { id: 'over60', label: 'Over $60' }
];

const DURATION_FILTERS = [
  { id: 'all', label: 'Any Duration' },
  { id: 'quick', label: 'Quick (≤ 2 hrs)' },
  { id: 'half', label: 'Half-Day (2 - 4 hrs)' },
  { id: 'full', label: 'Full-Day (> 4 hrs)' }
];

export const ActivitySearchPage = () => {
  const { activities, trips, updateTrip, currentUser } = useApp();

  // Active Selected Trip Header Selector
  const userTrips = trips.filter((t) => !currentUser || t.userId === currentUser.id);
  const [selectedTripId, setSelectedTripId] = useState(userTrips[0]?.id || trips[0]?.id || '');

  const activeTrip = trips.find((t) => t.id === selectedTripId) || userTrips[0] || trips[0];

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCostRange, setSelectedCostRange] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  // Activity Schedule Toggle Button Handler
  const handleToggleActivityForTrip = (activity) => {
    if (!activeTrip) return;

    const currentSelectedIds = activeTrip.selectedActivities || [];
    let updatedSelectedIds = [];

    if (currentSelectedIds.includes(activity.id)) {
      updatedSelectedIds = currentSelectedIds.filter((id) => id !== activity.id);
    } else {
      updatedSelectedIds = [...currentSelectedIds, activity.id];
    }

    updateTrip(activeTrip.id, {
      selectedActivities: updatedSelectedIds
    });
  };

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        act.title.toLowerCase().includes(q) ||
        act.cityName.toLowerCase().includes(q) ||
        act.category.toLowerCase().includes(q) ||
        (act.description && act.description.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'All Categories' || act.category === selectedCategory;

      let matchesCost = true;
      if (selectedCostRange === 'free') matchesCost = act.cost === 0;
      else if (selectedCostRange === 'under30') matchesCost = act.cost > 0 && act.cost < 30;
      else if (selectedCostRange === '30-60') matchesCost = act.cost >= 30 && act.cost <= 60;
      else if (selectedCostRange === 'over60') matchesCost = act.cost > 60;

      let matchesDuration = true;
      if (selectedDuration === 'quick') matchesDuration = act.durationHours <= 2;
      else if (selectedDuration === 'half') matchesDuration = act.durationHours > 2 && act.durationHours <= 4;
      else if (selectedDuration === 'full') matchesDuration = act.durationHours > 4;

      return matchesSearch && matchesCategory && matchesCost && matchesDuration;
    });
  }, [activities, searchQuery, selectedCategory, selectedCostRange, selectedDuration]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-brand-500 to-amber-500 text-white p-6 sm:p-10 shadow-warm-lg">
        <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
          <Badge variant="amber" icon={Compass} className="bg-white/20 text-white border-white/30">
            Global Activity Search Hub
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Experiences & Activities
          </h1>
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            Filter activities by category, price, and duration across 19 global hubs. Toggle experiences directly onto your active trips!
          </p>
        </div>
      </div>

      {/* Active Trip Selector Header */}
      {activeTrip && (
        <div className="p-5 bg-sand-50 rounded-3xl border border-slate-200/80 shadow-warm-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-brand-500 text-white font-bold">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Target Trip for Scheduling:
              </span>
              <h3 className="text-base font-extrabold text-slate-900">{activeTrip.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="emerald font-extrabold">
              {(activeTrip.selectedActivities || []).length} Scheduled
            </Badge>

            {trips.length > 1 && (
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-800 focus:outline-none cursor-pointer shadow-2xs"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col gap-4">
        {/* Search Input */}
        <Input
          placeholder="Search experiences by title, city, or category (e.g. Eiffel Tower, Colosseum, Pasta, Surfing)..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Pills */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Category Filter:
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

        {/* Price & Duration Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Price Range ($):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {COST_RANGES.map((cost) => (
                <button
                  key={cost.id}
                  type="button"
                  onClick={() => setSelectedCostRange(cost.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedCostRange === cost.id
                      ? 'bg-ocean-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {cost.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Duration:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {DURATION_FILTERS.map((dur) => (
                <button
                  key={dur.id}
                  type="button"
                  onClick={() => setSelectedDuration(dur.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedDuration === dur.id
                      ? 'bg-amber-500 text-white shadow-xs font-bold'
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
            Global Experiences Catalog ({filteredActivities.length} Experiences)
          </h2>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm font-medium">
            No experiences match your search filters. Try clearing category or cost filters!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => {
              const isScheduled = (activeTrip?.selectedActivities || []).includes(act.id);
              return (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  isSelected={isScheduled}
                  onToggleSelect={handleToggleActivityForTrip}
                  showSelectButton
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
