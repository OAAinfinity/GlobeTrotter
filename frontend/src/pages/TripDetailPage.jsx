import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Tabs } from '../components/common/Tabs';
import { Modal } from '../components/common/Modal';
import { DayItineraryCard } from '../components/trips/DayItineraryCard';
import { AddActivityModal } from '../components/trips/AddActivityModal';
import { BudgetAnalytics } from '../components/trips/BudgetAnalytics';
import { TransportLegPlanner } from '../components/trips/TransportLegPlanner';
import { PackingChecklistModal } from '../components/trips/PackingChecklistModal';
import { ShareTripModal } from '../components/trips/ShareTripModal';
import {
  Calendar,
  MapPin,
  DollarSign,
  ArrowLeft,
  Share2,
  Printer,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Train,
  CheckSquare
} from 'lucide-react';

export const TripDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, cities, activities, updateTrip, deleteTrip } = useApp();

  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary', 'transport', 'budget', 'cities'
  const [selectedDayForModal, setSelectedDayForModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center flex flex-col items-center gap-4">
        <Card className="p-8 flex flex-col items-center gap-3">
          <Briefcase className="w-12 h-12 text-slate-300" />
          <h2 className="text-lg font-bold text-slate-900">Trip Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested trip itinerary does not exist or was deleted.
          </p>
          <Link to="/trips">
            <Button variant="primary" size="sm" icon={ArrowLeft}>
              Back to My Trips
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Calculate total days
  const calculateTotalDays = () => {
    if (!trip.startDate || !trip.endDate) return 7;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 7;
  };

  const totalDays = calculateTotalDays();

  // Create list of days mapped to city legs
  const daysList = [];
  let currentDayNum = 1;

  (trip.cities || []).forEach((leg) => {
    const city = cities.find((c) => c.id === leg.cityId);
    const cityName = city ? city.name : leg.cityName || 'Destination';
    for (let d = 1; d <= leg.days; d++) {
      daysList.push({
        dayNumber: currentDayNum,
        cityId: leg.cityId,
        cityName,
        legDay: d
      });
      currentDayNum++;
    }
  });

  // If daysList is empty fallback to generic days
  if (daysList.length === 0) {
    for (let d = 1; d <= totalDays; d++) {
      daysList.push({
        dayNumber: d,
        cityId: 'city-1',
        cityName: 'Jaipur',
        legDay: d
      });
    }
  }

  // Add custom activity to trip
  const handleAddActivity = (newAct, dayNum) => {
    const actWithDay = { ...newAct, dayNumber: dayNum };
    const updatedSelectedIds = [...(trip.selectedActivities || []), newAct.id];

    // Store custom activities in customActivities array on trip
    const updatedCustoms = [...(trip.customActivities || []), actWithDay];

    updateTrip(trip.id, {
      selectedActivities: updatedSelectedIds,
      customActivities: updatedCustoms
    });
  };

  // Remove activity from trip
  const handleRemoveActivity = (actId) => {
    const updatedSelectedIds = (trip.selectedActivities || []).filter(
      (id) => id !== actId
    );
    const updatedCustoms = (trip.customActivities || []).filter(
      (a) => a.id !== actId
    );

    updateTrip(trip.id, {
      selectedActivities: updatedSelectedIds,
      customActivities: updatedCustoms
    });
  };

  // Update Transport Choice
  const handleUpdateTransport = (legKey, modeId, fare) => {
    const updatedChoices = {
      ...(trip.transportChoices || {}),
      [legKey]: modeId
    };
    const updatedFares = {
      ...(trip.transportFares || {}),
      [legKey]: fare
    };

    updateTrip(trip.id, {
      transportChoices: updatedChoices,
      transportFares: updatedFares
    });
  };

  // Handle Delete Trip
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
      deleteTrip(trip.id);
      navigate('/trips');
    }
  };

  // Open add activity modal for specific day
  const handleOpenAddModal = (dayNum) => {
    setSelectedDayForModal(dayNum);
    setIsAddModalOpen(true);
  };

  // Find target city for selected day modal
  const targetDayObj = daysList.find((d) => d.dayNumber === selectedDayForModal);
  const targetCityId = targetDayObj ? targetDayObj.cityId : trip.cities?.[0]?.cityId;
  const targetCityName = targetDayObj ? targetDayObj.cityName : trip.cities?.[0]?.cityName;

  // Selected activities list (catalog + custom)
  const catalogActs = activities.filter((a) =>
    trip.selectedActivities?.includes(a.id)
  );
  const customActs = trip.customActivities || [];
  const allTripActivities = [...catalogActs, ...customActs];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Back Button & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={CheckSquare}
            onClick={() => setIsPackingModalOpen(true)}
          >
            Packing List
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Share2}
            onClick={() => setIsShareModalOpen(true)}
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => setIsExportModalOpen(true)}
          >
            Export
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-warm-lg">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge variant="emerald">{trip.status || 'Upcoming'}</Badge>
            <Badge variant="amber" icon={Calendar}>
              {trip.startDate} to {trip.endDate} ({totalDays} Days)
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {trip.title}
          </h1>

          {/* Route Legs Pill Stream */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400" /> Multi-City Route:
            </span>
            {(trip.cities || []).map((leg, idx) => (
              <span
                key={leg.cityId}
                className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20"
              >
                {leg.cityName} ({leg.days}d)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'itinerary', label: 'Day-by-Day Timeline', icon: Calendar },
          { id: 'transport', label: 'Inter-City Connections', icon: Train },
          { id: 'budget', label: 'Budget Analytics', icon: DollarSign },
          { id: 'cities', label: 'Destinations Breakdown', icon: MapPin }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: DAY-BY-DAY TIMELINE */}
      {activeTab === 'itinerary' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              Day-by-Day Itinerary Schedule ({daysList.length} Days)
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Click "+ Add Experience" on any day card to schedule activities
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {daysList.map((day) => {
              // Get activities assigned to this day number
              const dayActivities = allTripActivities.filter(
                (a) => a.dayNumber === day.dayNumber
              );

              return (
                <DayItineraryCard
                  key={day.dayNumber}
                  dayNumber={day.dayNumber}
                  cityName={day.cityName}
                  dateString={`Leg Day ${day.legDay}`}
                  activitiesForDay={dayActivities}
                  onOpenAddModal={handleOpenAddModal}
                  onRemoveActivity={handleRemoveActivity}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSPORT PLANNER */}
      {activeTab === 'transport' && (
        <TransportLegPlanner
          cityLegs={trip.cities || []}
          transportChoices={trip.transportChoices || {}}
          onUpdateChoice={handleUpdateTransport}
        />
      )}

      {/* TAB 3: BUDGET ANALYTICS */}
      {activeTab === 'budget' && (
        <BudgetAnalytics trip={trip} cities={cities} activities={activities} />
      )}

      {/* TAB 4: CITIES BREAKDOWN */}
      {activeTab === 'cities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(trip.cities || []).map((leg) => {
            const city = cities.find((c) => c.id === leg.cityId);
            if (!city) return null;
            return (
              <Card key={city.id} padding="none" className="overflow-hidden">
                <div className="relative h-44">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="ocean">{city.costDisplay}</Badge>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{city.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Allocated Duration: {leg.days} Days
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {city.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        cityId={targetCityId}
        cityName={targetCityName}
        dayNumber={selectedDayForModal || 1}
        onAddActivity={handleAddActivity}
      />

      {/* Smart Packing Checklist Modal */}
      <PackingChecklistModal
        isOpen={isPackingModalOpen}
        onClose={() => setIsPackingModalOpen(false)}
        cities={trip.cities || []}
        tripTitle={trip.title}
      />

      {/* Share Trip Modal */}
      <ShareTripModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripTitle={trip.title}
        tripId={trip.id}
      />

      {/* Export / Print Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Travel Itinerary"
        subtitle="Print or save formatted multi-city itinerary summary"
      >
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
            {`✈️ GLOBETROTTER INDIA ITINERARY: ${trip.title.toUpperCase()}\n`}
            {`Dates: ${trip.startDate} to ${trip.endDate} (${totalDays} Days)\n`}
            {`Budget Target: ₹${(trip.totalBudget || 0).toLocaleString()}\n\n`}
            {`DESTINATION LEGS:\n`}
            {(trip.cities || []).map((l, i) => `${i + 1}. ${l.cityName} — ${l.days} Days\n`).join('')}
            {`\nSCHEDULED EXPERIENCES (${allTripActivities.length}):\n`}
            {allTripActivities.map((a, i) => `${i + 1}. [Day ${a.dayNumber || 1}] ${a.title} (₹${a.cost})\n`).join('')}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.print();
              }}
              icon={Printer}
            >
              Print Page
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
              icon={CheckCircle2}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
