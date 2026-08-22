import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { MapPin, Calendar, Plus, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const AddCityToTripModal = ({ isOpen, onClose, city }) => {
  const navigate = useNavigate();
  const { trips, updateTrip, currentUser } = useApp();

  const userTrips = trips.filter((t) => !currentUser || t.userId === currentUser.id);

  const [selectedTripId, setSelectedTripId] = useState(userTrips[0]?.id || '');
  const [arrivalDate, setArrivalDate] = useState('2026-11-01');
  const [departureDate, setDepartureDate] = useState('2026-11-05');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !city) return null;

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

  const handleConfirmAdd = () => {
    setErrorMsg('');

    if (!selectedTripId) {
      setErrorMsg('Please select a trip or create a new trip.');
      return;
    }

    if (new Date(departureDate) <= new Date(arrivalDate)) {
      setErrorMsg('Departure date must be after arrival date.');
      return;
    }

    const targetTrip = trips.find((t) => t.id === selectedTripId);
    if (!targetTrip) return;

    const newLeg = {
      cityId: city.id,
      cityName: city.name,
      arrivalDate,
      departureDate,
      days: stayDays,
      assignedActivities: []
    };

    const updatedCities = [...(targetTrip.cities || []), newLeg];

    updateTrip(targetTrip.id, {
      cities: updatedCities
    });

    onClose();
    // Route to that trip's Itinerary Builder
    navigate(`/trips/${targetTrip.id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${city.name} to Trip`}
      subtitle="Select a target itinerary and assign stop dates"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-5">
        {/* City Info Banner */}
        <div className="p-3 bg-sand-50 rounded-2xl border border-slate-200/60 flex items-center gap-3">
          <img
            src={city.image}
            alt={city.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900">{city.name}</h4>
            <p className="text-[11px] text-slate-500 font-medium">
              {city.region} • Est ₹{city.avgDailyCost}/day
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Select Target Trip */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Select Target Trip Itinerary
          </label>

          {userTrips.length === 0 ? (
            <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs font-medium">
              You don't have any active trips. Create one first!
            </div>
          ) : (
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {userTrips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.startDate} to {t.endDate})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Arrival & Departure Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Arrival Date"
            type="date"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            icon={Calendar}
          />
          <Input
            label="Departure Date"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            icon={Calendar}
          />
        </div>

        <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 flex items-center justify-between text-xs">
          <span className="text-brand-900 font-bold">Duration for this Stop:</span>
          <span className="font-extrabold text-brand-600">
            {stayDays} {stayDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        {/* Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          {userTrips.length === 0 ? (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                onClose();
                navigate('/trips/new');
              }}
            >
              Start New Trip
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={handleConfirmAdd}
            >
              Add to Selected Trip
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
