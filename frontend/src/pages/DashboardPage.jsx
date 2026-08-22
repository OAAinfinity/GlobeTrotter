import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { RecentTripsRow } from '../components/dashboard/RecentTripsRow';
import { RecommendedDestinationsGrid } from '../components/dashboard/RecommendedDestinationsGrid';
import { BudgetHighlightsWidget } from '../components/dashboard/BudgetHighlightsWidget';
import { HotelRecommendationsWidget } from '../components/dashboard/HotelRecommendationsWidget';
import { TripWizardModal } from '../components/trips/TripWizardModal';
import { Sparkles, Building, MapPin } from 'lucide-react';

export const DashboardPage = () => {
  const { currentUser, trips, cities, addTrip } = useApp();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // User's active trips
  const userTrips = trips.filter(
    (t) => !currentUser || t.userId === currentUser.id
  );

  const handleCreateTrip = (tripData) => {
    addTrip(tripData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Welcome Banner Header */}
      <DashboardHeader
        user={currentUser}
        activeTripsCount={userTrips.length}
        onPlanNewTrip={() => setIsWizardOpen(true)}
      />

      {/* Budget Summary & Countdown Highlights */}
      <BudgetHighlightsWidget trips={userTrips} />

      {/* Dynamic Hotel Recommendations Driven by JSON Dataset */}
      <HotelRecommendationsWidget userTravelStyle={currentUser?.travelStyle} />

      {/* Recent Trips Row with Horizontal Scrolling & Empty State */}
      <RecentTripsRow
        trips={userTrips}
        onPlanTripClick={() => setIsWizardOpen(true)}
      />

      {/* Recommended Destinations Grid from the 19 Global Cities */}
      <RecommendedDestinationsGrid
        cities={cities}
        onSelectCity={(city) => setIsWizardOpen(true)}
      />

      {/* Multi-City Trip Creation Wizard Modal */}
      <TripWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
    </div>
  );
};
