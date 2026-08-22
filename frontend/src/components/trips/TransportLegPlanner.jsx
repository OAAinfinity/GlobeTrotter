import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Train,
  Plane,
  Car,
  Clock,
  DollarSign,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const TRANSPORT_MODES = [
  {
    id: 'train',
    name: 'Vande Bharat / Express Train',
    icon: Train,
    avgSpeed: 70, // km/h
    costPerKm: 2.5, // INR per km
    badge: 'Eco & Scenic',
    color: 'brand'
  },
  {
    id: 'flight',
    name: 'Domestic Flight',
    icon: Plane,
    avgSpeed: 500, // km/h
    costPerKm: 8.0, // INR per km
    badge: 'Fastest',
    color: 'ocean'
  },
  {
    id: 'cab',
    name: 'Private Cab / Drive',
    icon: Car,
    avgSpeed: 60, // km/h
    costPerKm: 12.0, // INR per km
    badge: 'Flexible & Direct',
    color: 'emerald'
  }
];

export const TransportLegPlanner = ({
  cityLegs = [],
  transportChoices = {}, // { 'leg-0-1': 'train' }
  onUpdateChoice
}) => {
  if (cityLegs.length < 2) {
    return (
      <Card className="text-center py-8 text-xs text-slate-500">
        Multi-city transport planning requires at least 2 city legs.
      </Card>
    );
  }

  // Helper to compute rough distance between Indian cities (km approximation)
  const estimateDistance = (cityA, cityB) => {
    // Basic hash based pseudo distance between 250km and 900km
    const charCodeSum = (cityA + cityB)
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return 250 + (charCodeSum % 650);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          Inter-City Transport & Connections Planner
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select travel modes between city legs (Train, Flight, Private Cab) with estimated durations & fares
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {cityLegs.slice(0, -1).map((leg, idx) => {
          const nextLeg = cityLegs[idx + 1];
          const legKey = `leg-${idx}-${idx + 1}`;
          const currentModeId = transportChoices[legKey] || 'train';
          const distanceKm = estimateDistance(leg.cityName, nextLeg.cityName);

          return (
            <Card key={legKey} hoverEffect={false} className="p-5 flex flex-col gap-4 border-slate-200/80">
              {/* Leg Title Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{leg.cityName}</span>
                  <ArrowRight className="w-4 h-4 text-brand-500" />
                  <span>{nextLeg.cityName}</span>
                </div>

                <Badge variant="slate">Approx {distanceKm} km</Badge>
              </div>

              {/* Transport Mode Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TRANSPORT_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = currentModeId === mode.id;

                  // Compute travel duration & estimated cost
                  const travelHours = (distanceKm / mode.avgSpeed).toFixed(1);
                  const estFare = Math.round(distanceKm * mode.costPerKm);

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onUpdateChoice(legKey, mode.id, estFare)}
                      className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-400/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-2 rounded-xl text-white ${
                              isSelected ? 'bg-brand-500' : 'bg-slate-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-brand-600" />
                          )}
                        </div>

                        <span className="text-xs font-bold text-slate-900 mt-1">
                          {mode.name}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> ~{travelHours}h
                        </span>
                        <span className="font-extrabold text-emerald-600">
                          ₹{estFare.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
