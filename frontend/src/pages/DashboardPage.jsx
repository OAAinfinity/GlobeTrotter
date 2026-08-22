import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Plus, MapPin, Calendar, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const DashboardPage = () => {
  const { currentUser, trips, cities } = useApp();

  const userTrips = trips.filter((t) => !currentUser || t.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 p-6 sm:p-10 text-white shadow-warm-lg">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="amber" className="bg-white/20 text-white border-white/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Welcome Back
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {currentUser?.name || 'Explorer'}! 👋
          </h1>
          <p className="text-white/90 text-sm sm:text-base mt-2 leading-relaxed">
            Ready to craft your next multi-city adventure? You have{' '}
            <span className="font-bold underline decoration-amber-300">{userTrips.length} active trips</span> in your planner.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/discover">
              <Button variant="secondary" icon={Plus}>
                Discover Cities
              </Button>
            </Link>
            <Link to="/trips">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                View All Trips
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background image overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hoverEffect={false} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Trips</p>
            <p className="text-2xl font-extrabold text-slate-900">{userTrips.length}</p>
          </div>
        </Card>

        <Card hoverEffect={false} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-ocean-100 text-ocean-600 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Destinations Catalog</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {cities.length} Cities
            </p>
          </div>
        </Card>

        <Card hoverEffect={false} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Travel Persona</p>
            <p className="text-sm font-bold text-slate-900">
              {currentUser?.travelStyle || 'Explorer'}
            </p>
          </div>
        </Card>
      </div>

      {/* Trips Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Your Active & Planned Trips</h2>
          <Link to="/trips" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All ({userTrips.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {userTrips.length === 0 ? (
          <Card className="text-center py-12 flex flex-col items-center gap-3">
            <Compass className="w-12 h-12 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No trips planned yet</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Discover catalog cities and build your first multi-city itinerary.
            </p>
            <Link to="/discover">
              <Button size="sm" icon={Plus}>Start Planning</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTrips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`} className="block group">
                <Card padding="none" className="overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={trip.coverImage}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant={trip.status === 'Upcoming' ? 'emerald' : 'slate'}>
                          {trip.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {trip.startDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {(trip.cities || []).length} Cities
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">
                      Budget: ₹{trip.totalBudget.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Itinerary <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
