import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TripWizardModal } from '../components/trips/TripWizardModal';
import { Calendar, MapPin, Plus, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyTripsPage = () => {
  const { trips, currentUser } = useApp();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const userTrips = trips.filter((t) => !currentUser || t.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Planned Trips ({userTrips.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your custom itineraries, budgets, and scheduled activities.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsWizardOpen(true)}>
          New Trip
        </Button>
      </div>

      {userTrips.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center gap-3">
          <Compass className="w-12 h-12 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No trips created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Create your first multi-city trip itinerary using our step-by-step wizard.
          </p>
          <Button size="sm" icon={Plus} onClick={() => setIsWizardOpen(true)}>
            Plan Your First Trip
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTrips.map((trip) => (
            <Link key={trip.id} to={`/trips/${trip.id}`} className="block group">
              <Card padding="none" className="overflow-hidden flex flex-col justify-between h-full">
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
                    Target: ₹{trip.totalBudget.toLocaleString()}
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

      {/* Trip Wizard Modal */}
      <TripWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
};
