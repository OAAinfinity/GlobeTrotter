import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { ActivityCard } from '../discovery/ActivityCard';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Plus,
  AlertCircle
} from 'lucide-react';

export const AddEditStopModal = ({
  isOpen,
  onClose,
  stopToEdit = null,
  stopIndex = null,
  onSaveStop,
}) => {
  const { cities, activities } = useApp();

  const [step, setStep] = useState(1);

  // Form states
  const [selectedCity, setSelectedCity] = useState(null);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [arrivalDate, setArrivalDate] = useState('2026-10-15');
  const [departureDate, setDepartureDate] = useState('2026-10-19');
  const [selectedActivityIds, setSelectedActivityIds] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Initialize form when stopToEdit changes or modal opens
  useEffect(() => {
    if (stopToEdit && isOpen) {
      const cityObj = cities.find((c) => c.id === stopToEdit.cityId || c.name === stopToEdit.cityName);
      setSelectedCity(cityObj || { id: stopToEdit.cityId, name: stopToEdit.cityName });
      if (stopToEdit.arrivalDate) setArrivalDate(stopToEdit.arrivalDate);
      if (stopToEdit.departureDate) setDepartureDate(stopToEdit.departureDate);
      setSelectedActivityIds(stopToEdit.assignedActivities || []);
      setStep(1);
    } else if (isOpen) {
      setSelectedCity(null);
      setSelectedActivityIds([]);
      setErrorMsg('');
      setStep(1);
    }
  }, [stopToEdit, isOpen, cities]);

  // Calculate stay duration
  const calculateDays = () => {
    if (!arrivalDate || !departureDate) return 4;
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const stayDays = calculateDays();

  // Filter cities by search query
  const filteredCities = cities.filter((city) => {
    const q = citySearchQuery.toLowerCase().trim();
    return (
      !q ||
      city.name.toLowerCase().includes(q) ||
      city.region.toLowerCase().includes(q) ||
      city.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // City activities
  const cityActivities = selectedCity
    ? activities.filter((a) => a.cityId === selectedCity.id)
    : [];

  // Subtotal cost calculation for this stop
  const activitiesSubtotal = activities
    .filter((a) => selectedActivityIds.includes(a.id))
    .reduce((sum, a) => sum + (a.cost || 0), 0);

  const dailyRate = selectedCity ? selectedCity.avgDailyCost : 2500;
  const lodgingSubtotal = dailyRate * stayDays;
  const totalStopSubtotal = activitiesSubtotal + lodgingSubtotal;

  const toggleActivitySelect = (activity) => {
    if (selectedActivityIds.includes(activity.id)) {
      setSelectedActivityIds((prev) => prev.filter((id) => id !== activity.id));
    } else {
      setSelectedActivityIds((prev) => [...prev, activity.id]);
    }
  };

  const handleNextStep = () => {
    setErrorMsg('');

    if (step === 1) {
      if (!selectedCity) {
        setErrorMsg('Please select a destination city for this stop.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!arrivalDate || !departureDate) {
        setErrorMsg('Please select both arrival and departure dates.');
        return;
      }
      if (new Date(departureDate) <= new Date(arrivalDate)) {
        setErrorMsg('Departure date must be after arrival date.');
        return;
      }
      setStep(3);
    }
  };

  const handleSave = () => {
    const stopData = {
      cityId: selectedCity.id,
      cityName: selectedCity.name,
      arrivalDate,
      departureDate,
      days: stayDays,
      assignedActivities: selectedActivityIds,
      stopSubtotal: totalStopSubtotal
    };

    onSaveStop(stopData, stopIndex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={stopToEdit ? `Edit Stop: ${stopToEdit.cityName}` : 'Add Destination Stop'}
      subtitle="Select city, assign arrival/departure dates, and schedule experiences"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Step Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              {step === 1 && 'Step 1: Select Destination City'}
              {step === 2 && 'Step 2: Assign Arrival & Departure Dates'}
              {step === 3 && 'Step 3: Assign Activities & Review Subtotal'}
            </span>
            <Badge variant="brand" size="sm">
              Step {step} of 3
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 w-full bg-slate-100 p-1 rounded-full">
            {[1, 2, 3].map((s) => (
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

        {/* STEP 1: SELECT CITY */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Search Indian city (e.g. Jaipur, Leh, Kochi)..."
              icon={Search}
              value={citySearchQuery}
              onChange={(e) => setCitySearchQuery(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setSelectedCity(city);
                      setErrorMsg('');
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/80 ring-2 ring-brand-400/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="truncate flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {city.name}
                        </h4>
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          ₹{city.avgDailyCost}/d
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {city.region}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DATES */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {selectedCity && (
              <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-2xl border border-slate-200">
                <img
                  src={selectedCity.image}
                  alt={selectedCity.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Selected Destination: {selectedCity.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedCity.region} • Est ₹{selectedCity.avgDailyCost}/day
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Arrival Date"
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                icon={Calendar}
                required
              />

              <Input
                label="Departure Date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                icon={Calendar}
                required
              />
            </div>

            <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-center justify-between text-xs">
              <span className="text-brand-900 font-bold">Calculated Stay Duration:</span>
              <span className="text-sm font-extrabold text-brand-600">
                {stayDays} {stayDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: ACTIVITIES & SUBTOTAL */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            {/* Running Stop Subtotal Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  Stop: {selectedCity?.name} ({stayDays} Days)
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  Stop Subtotal: ₹{totalStopSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Lodging Est ({stayDays}d × ₹{dailyRate}): ₹{lodgingSubtotal.toLocaleString()}</span>
                <span>Activities ({selectedActivityIds.length}): ₹{activitiesSubtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* City Activities Selection */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Assign Experiences for {selectedCity?.name}:
              </span>

              {cityActivities.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No pre-set activities cataloged for this city. You can add custom items later!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {cityActivities.map((act) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      isSelected={selectedActivityIds.includes(act.id)}
                      onToggleSelect={toggleActivitySelect}
                      showSelectButton
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
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

          {step < 3 ? (
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
              size="md"
              icon={CheckCircle2}
              onClick={handleSave}
            >
              Save Stop
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
