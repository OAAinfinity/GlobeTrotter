import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TripCard } from '../components/trips/TripCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Tabs } from '../components/common/Tabs';
import { Calendar, MapPin, Plus, Search, Compass, Briefcase, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyTripsPage = () => {
  const { trips, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Upcoming', 'Completed'

  // Filter trips for current logged-in user
  const userTrips = useMemo(() => {
    return trips.filter((t) => !currentUser || t.userId === currentUser.id);
  }, [trips, currentUser]);

  // Processed trips based on search and status filter
  const filteredTrips = useMemo(() => {
    return userTrips.filter((trip) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        trip.title.toLowerCase().includes(query) ||
        (trip.cities || []).some((c) => c.cityName?.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === 'All' || trip.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [userTrips, searchQuery, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Planned Trips ({userTrips.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your custom Indian itineraries, budgets, and scheduled activities.
          </p>
        </div>

        <Link to="/trips/new">
          <Button variant="primary" icon={Plus}>
            New Trip
          </Button>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search trip title or city (e.g. Rajasthan, Jaipur)..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          tabs={[
            { id: 'All', label: `All (${userTrips.length})` },
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
      </div>

      {/* Grid vs Empty State */}
      {filteredTrips.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center gap-3">
          <Compass className="w-12 h-12 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">
            {userTrips.length === 0 ? 'No trips created yet' : 'No matching trips found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {userTrips.length === 0
              ? 'Create your first multi-city trip itinerary using our step-by-step trip builder.'
              : 'Try clearing your search terms or status filters.'}
          </p>

          {userTrips.length === 0 ? (
            <Link to="/trips/new">
              <Button size="sm" icon={Plus}>
                Plan Your First Trip
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};
