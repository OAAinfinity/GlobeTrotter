import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MoveUp,
  MoveDown,
  AlertCircle
} from 'lucide-react';

export const TripWizardModal = ({
  isOpen,
  onClose,
  initialCity = null,
}) => {
  const navigate = useNavigate();
  const { cities, activities, addTrip } = useApp();

  const [step, setStep] = useState(1);

  // Step 1 State
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-23');
  const [totalBudget, setTotalBudget] = useState(35000);

  // Step 2 State: Selected cities array with stay duration
  const [selectedCityLegs, setSelectedCityLegs] = useState([]);

  // Step 3 State: Selected activity IDs array
  const [selectedActivityIds, setSelectedActivityIds] = useState([]);

  // Error & Validation
  const [errorMsg, setErrorMsg] = useState('');

  // Initialize pre-selected city if passed
  useEffect(() => {
    if (initialCity && isOpen) {
      setTitle(`Trip to ${initialCity.name} & Beyond`);
      setSelectedCityLegs([{ cityId: initialCity.id, cityName: initialCity.name, days: 4 }]);
    }
  }, [initialCity, isOpen]);

  // Calculate total days from date range
  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 7;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 7;
  };

  const totalTripDays = calculateTotalDays();

  // Sum of allocated days across legs
  const allocatedDays = selectedCityLegs.reduce((sum, leg) => sum + (Number(leg.days) || 0), 0);

  // Calculate total estimated costs
  const activitiesCost = activities
    .filter((a) => selectedActivityIds.includes(a.id))
    .reduce((sum, a) => sum + a.cost, 0);

  // Estimate daily accommodation/food cost per city
  const estimatedStayCost = selectedCityLegs.reduce((sum, leg) => {
    const city = cities.find((c) => c.id === leg.cityId);
    const daily = city ? city.avgDailyCost : 2500;
    return sum + daily * leg.days;
  }, 0);

  const totalEstimatedCost = activitiesCost + estimatedStayCost;

  // Handle City Select/Deselect in Step 2
  const toggleCitySelect = (city) => {
    const exists = selectedCityLegs.find((leg) => leg.cityId === city.id);
    if (exists) {
      setSelectedCityLegs((prev) => prev.filter((leg) => leg.cityId !== city.id));
    } else {
      setSelectedCityLegs((prev) => [
        ...prev,
        { cityId: city.id, cityName: city.name, days: 3 }
      ]);
    }
  };

  // Re-order Leg Up / Down
  const moveLeg = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedCityLegs.length) return;
    const updated = [...selectedCityLegs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSelectedCityLegs(updated);
  };

  // Days per leg change
  const handleDaysChange = (cityId, daysValue) => {
    setSelectedCityLegs((prev) =>
      prev.map((leg) =>
        leg.cityId === cityId ? { ...leg, days: Math.max(1, Number(daysValue)) } : leg
      )
    );
  };

  // Toggle Activity Selection in Step 3
  const toggleActivity = (activity) => {
    if (selectedActivityIds.includes(activity.id)) {
      setSelectedActivityIds((prev) => prev.filter((id) => id !== activity.id));
    } else {
      setSelectedActivityIds((prev) => [...prev, activity.id]);
    }
  };

  // Step Validation & Navigation
  const handleNextStep = () => {
    setErrorMsg('');

    if (step === 1) {
      if (!title.trim()) {
        setErrorMsg('Please enter a name for your trip.');
        return;
      }
      if (new Date(startDate) >= new Date(endDate)) {
        setErrorMsg('End Date must be after Start Date.');
        return;
      }
      if (totalBudget <= 0) {
        setErrorMsg('Please enter a valid target budget.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedCityLegs.length < 2) {
        setErrorMsg('Please select at least 2 cities to build a multi-city trip!');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  // Submit & Save Trip
  const handleCreateTrip = () => {
    const primaryCity = cities.find((c) => c.id === selectedCityLegs[0]?.cityId);
    const coverImage = primaryCity?.image || cities[0]?.image;

    const newTrip = {
      title,
      startDate,
      endDate,
      totalBudget: Number(totalBudget),
      estimatedCost: totalEstimatedCost,
      coverImage,
      cities: selectedCityLegs,
      selectedActivities: selectedActivityIds
    };

    addTrip(newTrip);
    onClose();
    navigate('/trips');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex flex-col gap-6">
        {/* Wizard Header Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {step === 1 && 'Step 1: Trip Basics'}
                {step === 2 && 'Step 2: Choose & Order Cities'}
                {step === 3 && 'Step 3: Select Activities'}
                {step === 4 && 'Step 4: Review & Create Trip'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 1 && 'Set dates, title, and target budget (₹ INR)'}
                {step === 2 && 'Pick 2+ Indian cities and sequence your route legs'}
                {step === 3 && 'Pick experiences per city with live cost tracking'}
                {step === 4 && 'Confirm your multi-city itinerary details'}
              </p>
            </div>
            <Badge variant="brand" size="sm">
              Step {step} of 4
            </Badge>
          </div>

          {/* Stepper Dots */}
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

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              label="Trip Title"
              placeholder="e.g. Royal Rajasthan & Golden Triangle Tour"
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

            <div className="bg-sand-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span>Calculated Trip Duration:</span>
              <span className="font-extrabold text-slate-900">{totalTripDays} Days</span>
            </div>

            <Input
              label="Total Target Budget (₹ INR)"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              helperText="This budget limit will track your estimated stay, transport, and activity expenses in Rupees."
              required
            />
          </div>
        )}

        {/* STEP 2: CITIES & ROUTE LEGS */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Select Cities from Catalog ({selectedCityLegs.length} Selected)
                </span>
                <span className="text-xs text-brand-600 font-semibold">
                  Min 2 cities required
                </span>
              </div>

              {/* City Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {cities.map((city) => {
                  const isSelected = selectedCityLegs.some((l) => l.cityId === city.id);
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => toggleCitySelect(city)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <div className="truncate">
                        <p className="truncate font-bold">{city.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{city.region}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Route Sequence & Days Allocation */}
            {selectedCityLegs.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Route Sequence & Stay Duration
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      allocatedDays === totalTripDays ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    Allocated: {allocatedDays} / {totalTripDays} Days
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {selectedCityLegs.map((leg, idx) => (
                    <div
                      key={leg.cityId}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{leg.cityName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={leg.days}
                            onChange={(e) => handleDaysChange(leg.cityId, e.target.value)}
                            className="w-14 px-2 py-1 text-xs font-bold text-center border border-slate-200 rounded-lg focus:border-brand-500 focus:outline-none"
                          />
                          <span className="text-xs text-slate-500">Days</span>
                        </div>

                        {/* Move Up/Down Controls */}
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveLeg(idx, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selectedCityLegs.length - 1}
                            onClick={() => moveLeg(idx, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCityLegs((prev) =>
                              prev.filter((l) => l.cityId !== leg.cityId)
                            )
                          }
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ACTIVITIES PICKER */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            {/* Live Budget Counter */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Target Budget: ₹{totalBudget.toLocaleString()}</span>
                <span
                  className={`font-bold ${
                    totalEstimatedCost > totalBudget ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  Estimated Total: ₹{totalEstimatedCost.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    totalEstimatedCost > totalBudget ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (totalEstimatedCost / totalBudget) * 100)}%`
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Activities: ₹{activitiesCost.toLocaleString()}</span>
                <span>Est. Stay/Food: ₹{estimatedStayCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Activities grouped by chosen cities */}
            <div className="max-h-72 overflow-y-auto pr-1 flex flex-col gap-5">
              {selectedCityLegs.map((leg) => {
                const legActivities = activities.filter((a) => a.cityId === leg.cityId);
                return (
                  <div key={leg.cityId} className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      {leg.cityName} Experiences ({legActivities.length})
                    </h4>

                    {legActivities.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No activities cataloged for this city.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {legActivities.map((act) => (
                          <ActivityCard
                            key={act.id}
                            activity={act}
                            isSelected={selectedActivityIds.includes(act.id)}
                            onToggleSelect={toggleActivity}
                            showSelectButton
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div className="p-5 rounded-2xl bg-sand-50 border border-slate-200/70 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{title}</h4>
                  <p className="text-xs text-slate-500">
                    {startDate} to {endDate} ({totalTripDays} Days)
                  </p>
                </div>
                <Badge variant="emerald">Ready to Create</Badge>
              </div>

              {/* Route Summary */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Multi-City India Route:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCityLegs.map((leg, idx) => (
                    <React.Fragment key={leg.cityId}>
                      <span className="px-3 py-1 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                        {leg.cityName} ({leg.days}d)
                      </span>
                      {idx < selectedCityLegs.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block">Target Budget</span>
                  <span className="font-extrabold text-slate-900">₹{totalBudget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Selected Activities</span>
                  <span className="font-extrabold text-brand-600">
                    {selectedActivityIds.length} Picked
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Est Total Cost</span>
                  <span className="font-extrabold text-emerald-600">
                    ₹{totalEstimatedCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
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
              onClick={handleNextStep}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              icon={CheckCircle2}
              onClick={handleCreateTrip}
            >
              Confirm & Save Trip
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
