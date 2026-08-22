import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Tabs } from '../components/common/Tabs';
import { Modal } from '../components/common/Modal';
import { DayItineraryCard } from '../components/trips/DayItineraryCard';
import { ExpandableStopCard } from '../components/trips/ExpandableStopCard';
import { TripItineraryView } from '../components/trips/TripItineraryView';
import { AddEditStopModal } from '../components/trips/AddEditStopModal';
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
  Plus,
  Briefcase,
  Train,
  CheckSquare,
  Layers,
  Eye
} from 'lucide-react';

export const TripDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, cities, activities, updateTrip, deleteTrip } = useApp();

  const [activeTab, setActiveTab] = useState('stops'); // 'stops', 'view', 'itinerary', 'transport', 'budget'
  const [selectedDayForModal, setSelectedDayForModal] = useState(null);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [editingStopIndex, setEditingStopIndex] = useState(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Drag-and-drop state for stops
  const [draggedStopIndex, setDraggedStopIndex] = useState(null);

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

  const tripStops = trip.cities || [];

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

  // Create list of days mapped to city legs for daily itinerary view
  const daysList = [];
  let currentDayNum = 1;

  tripStops.forEach((leg) => {
    const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
    const cityName = city ? city.name : leg.cityName || 'Destination';
    const legDays = leg.days || 3;
    for (let d = 1; d <= legDays; d++) {
      daysList.push({
        dayNumber: currentDayNum,
        cityId: leg.cityId,
        cityName,
        legDay: d
      });
      currentDayNum++;
    }
  });

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

  // SAVE STOP (Add or Edit)
  const handleSaveStop = (stopData, indexToEdit) => {
    let updatedStops = [...tripStops];

    if (indexToEdit !== null && indexToEdit !== undefined) {
      updatedStops[indexToEdit] = {
        ...updatedStops[indexToEdit],
        ...stopData
      };
    } else {
      updatedStops.push(stopData);
    }

    const newSelectedActs = Array.from(
      new Set(updatedStops.flatMap((s) => s.assignedActivities || []))
    );

    updateTrip(trip.id, {
      cities: updatedStops,
      selectedActivities: newSelectedActs
    });
  };

  // REMOVE STOP
  const handleRemoveStop = (indexToRemove) => {
    const updatedStops = tripStops.filter((_, idx) => idx !== indexToRemove);
    const newSelectedActs = Array.from(
      new Set(updatedStops.flatMap((s) => s.assignedActivities || []))
    );

    updateTrip(trip.id, {
      cities: updatedStops,
      selectedActivities: newSelectedActs
    });
  };

  // MOVE STOP (Up / Down)
  const handleMoveStop = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tripStops.length) return;
    const updatedStops = [...tripStops];
    const temp = updatedStops[index];
    updatedStops[index] = updatedStops[targetIndex];
    updatedStops[targetIndex] = temp;

    updateTrip(trip.id, { cities: updatedStops });
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    setDraggedStopIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedStopIndex === null || draggedStopIndex === dropIndex) return;

    const updatedStops = [...tripStops];
    const draggedItem = updatedStops[draggedStopIndex];
    updatedStops.splice(draggedStopIndex, 1);
    updatedStops.splice(dropIndex, 0, draggedItem);

    setDraggedStopIndex(null);
    updateTrip(trip.id, { cities: updatedStops });
  };

  const handleOpenEditStop = (stop, index) => {
    setEditingStop(stop);
    setEditingStopIndex(index);
    setIsStopModalOpen(true);
  };

  const handleOpenAddStop = () => {
    setEditingStop(null);
    setEditingStopIndex(null);
    setIsStopModalOpen(true);
  };

  const handleAddActivity = (newAct, dayNum) => {
    const actWithDay = { ...newAct, dayNumber: dayNum };
    const updatedSelectedIds = [...(trip.selectedActivities || []), newAct.id];
    const updatedCustoms = [...(trip.customActivities || []), actWithDay];

    updateTrip(trip.id, {
      selectedActivities: updatedSelectedIds,
      customActivities: updatedCustoms
    });
  };

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

  const handleRemoveActivityFromStop = (stopIdx, actId) => {
    const updatedStops = [...tripStops];
    const targetStop = updatedStops[stopIdx];
    if (targetStop) {
      targetStop.assignedActivities = (targetStop.assignedActivities || []).filter(
        (id) => id !== actId
      );
      updatedStops[stopIdx] = targetStop;
    }

    const newSelectedActs = Array.from(
      new Set(updatedStops.flatMap((s) => s.assignedActivities || []))
    );

    updateTrip(trip.id, {
      cities: updatedStops,
      selectedActivities: newSelectedActs
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
      deleteTrip(trip.id);
      navigate('/trips');
    }
  };

  const catalogActs = activities.filter((a) =>
    trip.selectedActivities?.includes(a.id)
  );
  const customActs = trip.customActivities || [];
  const allTripActivities = [...catalogActs, ...customActs];

  const totalStopsSubtotal = tripStops.reduce((sum, stop) => {
    const city = cities.find((c) => c.id === stop.cityId || c.name === stop.cityName);
    const daily = city ? city.avgDailyCost : 2500;
    const days = stop.days || 3;
    const lodging = daily * days;
    const stopActs = activities.filter((a) => (stop.assignedActivities || []).includes(a.id));
    const actSum = stopActs.reduce((s, a) => s + (a.cost || 0), 0);
    return sum + lodging + actSum;
  }, 0);

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
              <MapPin className="w-3.5 h-3.5 text-brand-400" /> Stops Sequence:
            </span>
            {tripStops.length === 0 ? (
              <span className="text-xs text-amber-300 font-medium italic">
                No stops added yet. Click "+ Add Stop" below!
              </span>
            ) : (
              tripStops.map((leg, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20"
                >
                  #{idx + 1} {leg.cityName} ({leg.days || 3}d)
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'stops', label: `Itinerary Builder (${tripStops.length} Stops)`, icon: Layers },
          { id: 'view', label: 'Itinerary View (Read-Only)', icon: Eye },
          { id: 'itinerary', label: 'Day-by-Day Timeline', icon: Calendar },
          { id: 'transport', label: 'Inter-City Connections', icon: Train },
          { id: 'budget', label: 'Budget Analytics', icon: DollarSign }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: ITINERARY BUILDER (STOPS LIST & DND) */}
      {activeTab === 'stops' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                Multi-Stop Itinerary Builder ({tripStops.length} Destination Legs)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add city stops, assign arrival/departure dates, pick activities, and reorder legs easily.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleOpenAddStop}
            >
              Add Stop
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-700 font-semibold">
              <span>Target Budget: <span className="font-extrabold text-slate-900">₹{(trip.totalBudget || 0).toLocaleString()}</span></span>
              <span>Running Stops Subtotal: <span className="font-extrabold text-emerald-600">₹{totalStopsSubtotal.toLocaleString()}</span></span>
            </div>
            <span className="text-slate-500 font-medium">
              Drag cards or use ⬆️ ⬇️ arrows to reorder stop legs
            </span>
          </div>

          {tripStops.length === 0 ? (
            <Card className="text-center py-16 flex flex-col items-center gap-3 border-dashed border-slate-300">
              <Layers className="w-12 h-12 text-slate-300" />
              <h3 className="text-base font-bold text-slate-900">No stops added to this trip yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Click "+ Add Stop" to choose a destination city, set arrival/departure dates, and assign experiences.
              </p>
              <Button size="sm" variant="primary" icon={Plus} onClick={handleOpenAddStop}>
                Add First Stop
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {tripStops.map((stop, idx) => {
                const cityObj = cities.find(
                  (c) => c.id === stop.cityId || c.name === stop.cityName
                );
                const assignedActs = activities.filter((a) =>
                  (stop.assignedActivities || []).includes(a.id)
                );

                return (
                  <ExpandableStopCard
                    key={idx}
                    stop={stop}
                    stopIndex={idx}
                    totalStops={tripStops.length}
                    cityObj={cityObj}
                    assignedActivitiesList={assignedActs}
                    onMoveStop={handleMoveStop}
                    onEditStop={handleOpenEditStop}
                    onRemoveStop={handleRemoveStop}
                    onOpenAddActivityModal={(index, city) => {
                      setSelectedDayForModal(index + 1);
                      setIsAddActivityModalOpen(true);
                    }}
                    onRemoveActivityFromStop={handleRemoveActivityFromStop}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ITINERARY VIEW (TIMELINE VS GROUPED BY CITY TOGGLE) */}
      {activeTab === 'view' && (
        <TripItineraryView trip={trip} cities={cities} activities={activities} />
      )}

      {/* TAB 3: DAY-BY-DAY TIMELINE */}
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
                  onOpenAddModal={(dayNum) => {
                    setSelectedDayForModal(dayNum);
                    setIsAddActivityModalOpen(true);
                  }}
                  onRemoveActivity={handleRemoveActivity}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: TRANSPORT PLANNER */}
      {activeTab === 'transport' && (
        <TransportLegPlanner
          cityLegs={tripStops}
          transportChoices={trip.transportChoices || {}}
          onUpdateChoice={(legKey, modeId, fare) => {
            const updatedChoices = { ...(trip.transportChoices || {}), [legKey]: modeId };
            const updatedFares = { ...(trip.transportFares || {}), [legKey]: fare };
            updateTrip(trip.id, { transportChoices: updatedChoices, transportFares: updatedFares });
          }}
        />
      )}

      {/* TAB 5: BUDGET ANALYTICS */}
      {activeTab === 'budget' && (
        <BudgetAnalytics trip={trip} cities={cities} activities={activities} />
      )}

      {/* Add / Edit Stop Modal */}
      <AddEditStopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        stopToEdit={editingStop}
        stopIndex={editingStopIndex}
        onSaveStop={handleSaveStop}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddActivityModalOpen}
        onClose={() => setIsAddActivityModalOpen(false)}
        cityId={tripStops[0]?.cityId || 'city-1'}
        cityName={tripStops[0]?.cityName || 'Jaipur'}
        dayNumber={selectedDayForModal || 1}
        onAddActivity={handleAddActivity}
      />

      {/* Smart Packing Checklist Modal */}
      <PackingChecklistModal
        isOpen={isPackingModalOpen}
        onClose={() => setIsPackingModalOpen(false)}
        cities={tripStops}
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
            {`DESTINATION LEGS (${tripStops.length}):\n`}
            {tripStops.map((l, i) => `${i + 1}. ${l.cityName} (${l.arrivalDate || 'Start'} to ${l.departureDate || 'End'}) — ${l.days || 3} Days\n`).join('')}
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
