import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TripCard } from '../components/trips/TripCard';
import { DeleteTripConfirmModal } from '../components/trips/DeleteTripConfirmModal';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Tabs } from '../components/common/Tabs';
import { Calendar, MapPin, Plus, Search, Compass, ArrowUpDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyTripsPage = () => {
  const { trips, currentUser, deleteTrip } = useApp();

  // Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Upcoming', 'Completed'
  const [sortBy, setSortBy] = useState('date-soonest'); // 'date-soonest', 'date-latest', 'title'

  // Delete Confirmation Modal state
  const [deletingTrip, setDeletingTrip] = useState(null);

  // Filter trips for current logged-in user
  const userTrips = useMemo(() => {
    return trips.filter((t) => !currentUser || t.userId === currentUser.id);
  }, [trips, currentUser]);

  // Processed trips based on search, status filter, and date sorting
  const processedTrips = useMemo(() => {
    return userTrips
      .filter((trip) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          trip.title.toLowerCase().includes(query) ||
          (trip.cities || []).some((c) => c.cityName?.toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === 'All' || trip.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date-soonest') {
          return new Date(a.startDate || 0) - new Date(b.startDate || 0);
        }
        if (sortBy === 'date-latest') {
          return new Date(b.startDate || 0) - new Date(a.startDate || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [userTrips, searchQuery, statusFilter, sortBy]);

  // Delete Handlers
  const handleOpenDeleteModal = (trip) => {
    setDeletingTrip(trip);
  };

  const handleConfirmDelete = () => {
    if (deletingTrip) {
      deleteTrip(deletingTrip.id);
      setDeletingTrip(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-700 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Itinerary Manager ({userTrips.length} Saved)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Trips
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, manage, search, and edit your custom multi-city Indian itineraries.
          </p>
        </div>

        <Link to="/trips/new">
          <Button variant="primary" icon={Plus}>
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6">
            <Input
              placeholder="Search by trip name or city (e.g. Royal Rajasthan, Jaipur)..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date Sorting Dropdown */}
          <div className="md:col-span-6 flex items-center justify-end gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="date-soonest">Sort by Start Date (Soonest First)</option>
              <option value="date-latest">Sort by Start Date (Latest First)</option>
              <option value="title">Sort by Trip Title (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Tabs
            tabs={[
              { id: 'All', label: `All Trips (${userTrips.length})` },
              {
                id: 'Upcoming',
                label: `Upcoming (${userTrips.filter((t) => t.status === 'Upcoming').length})`
              },
              {
                id: 'Completed',
                label: `Completed (${userTrips.filter((t) => t.status === 'Completed').length})`
              }
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />

          <span className="hidden sm:block text-xs font-semibold text-slate-400">
            Showing {processedTrips.length} of {userTrips.length}
          </span>
        </div>
      </div>

      {/* Grid vs Graceful Empty State */}
      {processedTrips.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center gap-3 border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            {userTrips.length === 0
              ? "You haven't planned any trips yet — start one!"
              : 'No matching trips found'}
          </h3>

          <p className="text-xs text-slate-500 max-w-sm">
            {userTrips.length === 0
              ? 'Create your first multi-city trip itinerary with date ranges, leg sequencing, and activity planning.'
              : 'Try adjusting your search terms or clearing status filters.'}
          </p>

          {userTrips.length === 0 ? (
            <Link to="/trips/new" className="mt-2">
              <Button size="sm" variant="primary" icon={Plus}>
                Start Planning
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setSortBy('date-soonest');
              }}
            >
              Reset Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDeleteRequest={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteTripConfirmModal
        isOpen={Boolean(deletingTrip)}
        onClose={() => setDeletingTrip(null)}
        onConfirm={handleConfirmDelete}
        tripTitle={deletingTrip?.title}
      />
    </div>
  );
};
