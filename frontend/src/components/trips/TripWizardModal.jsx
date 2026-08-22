import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { ActivityCard } from '../discovery/ActivityCard';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Calendar,
  DollarSign,
  MapPin,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

export const TripWizardModal = ({ isOpen, onClose, onCreateTrip }) => {
  const { cities, activities } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Basics
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-25');
  const [totalBudget, setTotalBudget] = useState(4500);

  // Step 2: Selected City Legs [{ cityId, cityName, days: 3 }]
  const [selectedLegs, setSelectedLegs] = useState([
    { cityId: 'city-paris', cityName: 'Paris', days: 5 },
    { cityId: 'city-london', cityName: 'London', days: 5 }
  ]);

  // Step 3: Selected Activity IDs
  const [selectedActivityIds, setSelectedActivityIds] = useState([]);

  // Calculate total days
  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 10;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 10;
  };

  const totalDays = calculateTotalDays();

  // Selected cities objects
  const selectedCityObjs = selectedLegs
    .map((leg) => cities.find((c) => c.id === leg.cityId || c.name === leg.cityName))
    .filter(Boolean);

  // Activities available for selected cities
  const availableActivities = activities.filter((a) =>
    selectedLegs.some((l) => l.cityId === a.cityId || l.cityName === a.cityName)
  );

  // Estimated budget sum calculation
  const totalLodgingEst = selectedLegs.reduce((sum, leg) => {
    const city = cities.find((c) => c.id === leg.cityId || c.name === leg.cityName);
    const dailyRate = city ? city.avgDailyCost : 250;
    return sum + dailyRate * leg.days;
  }, 0);

  const totalActivitiesEst = availableActivities
    .filter((a) => selectedActivityIds.includes(a.id))
    .reduce((sum, a) => sum + a.cost, 0);

  const totalEstimatedCost = totalLodgingEst + totalActivitiesEst;

  // Add City Leg
  const handleAddLeg = (city) => {
    if (selectedLegs.some((l) => l.cityId === city.id)) return;
    setSelectedLegs((prev) => [
      ...prev,
      { cityId: city.id, cityName: city.name, days: 3 }
    ]);
  };

  // Remove City Leg
  const handleRemoveLeg = (index) => {
    setSelectedLegs((prev) => prev.filter((_, i) => i !== index));
  };

  // Move Leg Order (Up / Down)
  const handleMoveLeg = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedLegs.length) return;

    const newLegs = [...selectedLegs];
    const temp = newLegs[index];
    newLegs[index] = newLegs[targetIndex];
    newLegs[targetIndex] = temp;
    setSelectedLegs(newLegs);
  };

  // Update Days for Leg
  const handleDaysChange = (index, days) => {
    const newLegs = [...selectedLegs];
    newLegs[index].days = Math.max(1, Number(days));
    setSelectedLegs(newLegs);
  };

  // Toggle Activity Selection
  const toggleActivitySelect = (activity) => {
    if (selectedActivityIds.includes(activity.id)) {
      setSelectedActivityIds((prev) => prev.filter((id) => id !== activity.id));
    } else {
      setSelectedActivityIds((prev) => [...prev, activity.id]);
    }
  };

  // Step 4: Submit Final Trip
  const handleSubmit = () => {
    const coverCity = selectedCityObjs[0];
    const coverImage = coverCity
      ? coverCity.image
      : 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80';

    const newTrip = {
      title: title || `${selectedLegs.map((l) => l.cityName).join(' & ')} Grand Tour`,
      startDate,
      endDate,
      totalBudget: Number(totalBudget),
      coverImage,
      status: 'Upcoming',
      cities: selectedLegs,
      selectedActivities: selectedActivityIds,
      description: `Multi-city itinerary across ${selectedLegs.map((l) => l.cityName).join(', ')}.`
    };

    onCreateTrip(newTrip);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plan New Multi-City Trip"
      subtitle="4-step itinerary wizard for global destinations"
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-6">
        {/* Wizard Progress Bar Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              {step === 1 && 'Step 1: Basic Trip Info & Dates'}
              {step === 2 && 'Step 2: Build City Route & Days'}
              {step === 3 && 'Step 3: Pick Experiences & Track Budget'}
              {step === 4 && 'Step 4: Review & Finalize Itinerary'}
            </span>
            <Badge variant="brand" size="sm">
              Step {step} of 4
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 w-full bg-slate-100 p-1 rounded-full">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-brand-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              label="Trip Title"
              placeholder="e.g. European Cultural Capitals Tour"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              icon={Compass}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                icon={Calendar}
                required
              />

              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                icon={Calendar}
                required
              />
            </div>

            <Input
              label="Target Budget ($ USD)"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              icon={DollarSign}
              helperText="Set target expenditure for stay, transport, and experiences."
              required
            />

            <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Calculated Duration:</span>
              <span className="text-sm font-extrabold text-brand-600">
                {totalDays} Days
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: ROUTE BUILDER & LEG SEQUENCING */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Route Sequence:
              </h4>

              {selectedLegs.length === 0 ? (
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">
                  Please select at least 1 city leg below.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedLegs.map((leg, index) => (
                    <div
                      key={leg.cityId || index}
                      className="flex items-center justify-between p-3 bg-sand-50 rounded-2xl border border-slate-200/80 text-xs"
                    >
                      <div className="flex items-center gap-3 font-bold text-slate-900">
                        <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span>{leg.cityName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-slate-500 font-semibold">Stay Days:</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={leg.days}
                          onChange={(e) => handleDaysChange(index, e.target.value)}
                          className="w-14 px-2 py-1 border border-slate-300 rounded-lg text-center font-bold bg-white"
                        />

                        {/* Leg Move Controls */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveLeg(index, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === selectedLegs.length - 1}
                          onClick={() => handleMoveLeg(index, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveLeg(index)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg ml-1"
                          title="Remove City"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add City Catalog Selector */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Add Global Destination Legs:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {cities.map((city) => {
                  const isAdded = selectedLegs.some((l) => l.cityId === city.id);
                  return (
                    <button
                      key={city.id}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddLeg(city)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs transition-all ${
                        isAdded
                          ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-brand-400 hover:bg-brand-50/50'
                      }`}
                    >
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="font-bold text-slate-800 truncate">{city.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ACTIVITIES & LIVE BUDGET PROGRESS BAR */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            {/* Live Budget Tracker Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col gap-2 shadow-warm-md">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-brand-300">
                  <Sparkles className="w-4 h-4 text-brand-400" /> Real-time Budget Tracker
                </span>
                <span className={totalEstimatedCost > totalBudget ? 'text-rose-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
                  Est: ${totalEstimatedCost.toLocaleString()} / Target: ${Number(totalBudget).toLocaleString()}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    totalEstimatedCost > totalBudget ? 'bg-rose-500' : 'bg-brand-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (totalEstimatedCost / (totalBudget || 1)) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Activities Selector Grid */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Recommended City Experiences:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {availableActivities.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    isSelected={selectedActivityIds.includes(act.id)}
                    onToggleSelect={toggleActivitySelect}
                    showSelectButton
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div className="p-4 bg-sand-50 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {title || `${selectedLegs.map((l) => l.cityName).join(' & ')} Grand Tour`}
                </h3>
                <Badge variant="amber">{totalDays} Days</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Dates:</span>
                  <span className="font-bold text-slate-800">{startDate} to {endDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Target Budget:</span>
                  <span className="font-extrabold text-emerald-600">${Number(totalBudget).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-xs mb-1">Route Leg Breakdown:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLegs.map((leg, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      #{idx + 1} {leg.cityName} ({leg.days}d)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          )}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={() => setStep(step + 1)}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={CheckCircle2}
              onClick={handleSubmit}
            >
              Confirm & Save Trip
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
