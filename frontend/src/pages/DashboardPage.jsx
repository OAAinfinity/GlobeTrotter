import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { RecentTripsRow } from '../components/dashboard/RecentTripsRow';
import { RecommendedDestinationsGrid } from '../components/dashboard/RecommendedDestinationsGrid';
import { BudgetHighlightsWidget } from '../components/dashboard/BudgetHighlightsWidget';
import { TripWizardModal } from '../components/trips/TripWizardModal';

export const DashboardPage = () => {
  const { currentUser, trips, cities } = useApp();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialCity, setWizardInitialCity] = useState(null);

  // Filter trips by current logged-in user
  const userTrips = trips.filter(
    (t) => !currentUser || t.userId === currentUser.id
  );

  const handleStartTripWithCity = (city) => {
    setWizardInitialCity(city);
    setIsWizardOpen(true);
  };

  const handlePlanNewTrip = () => {
    setWizardInitialCity(null);
    setIsWizardOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Welcome Header */}
      <DashboardHeader
        user={currentUser}
        activeTripsCount={userTrips.length}
        onPlanNewTrip={handlePlanNewTrip}
      />

      {/* Budget & Departure Highlights Summary Widget */}
      <BudgetHighlightsWidget trips={userTrips} />

      {/* Horizontally Scrollable Recent Trips Row (with Empty State) */}
      <RecentTripsRow
        trips={userTrips}
        onPlanNewTrip={handlePlanNewTrip}
      />

      {/* Recommended Destinations Grid */}
      <RecommendedDestinationsGrid
        cities={cities}
        onSelectCityForTrip={handleStartTripWithCity}
      />

      {/* Multi-City Trip Creation Wizard Modal */}
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
