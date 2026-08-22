import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { User, Mail, MapPin, Compass, DollarSign, Save, Sparkles, Sliders } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [travelStyle, setTravelStyle] = useState(currentUser?.travelStyle || 'Heritage & Culture');
  const [homeCity, setHomeCity] = useState(currentUser?.homeCity || 'New Delhi');
  const [budgetLevel, setBudgetLevel] = useState(currentUser?.preferences?.budgetLevel || 'Moderate');
  const [pace, setPace] = useState(currentUser?.preferences?.pace || 'Balanced');

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      bio,
      travelStyle,
      homeCity,
      preferences: {
        ...(currentUser?.preferences || {}),
        budgetLevel,
        pace
      }
    });
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Card>
          <p className="text-sm font-bold text-slate-700">Please log in to view your profile.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your traveler persona, preferred budget tiers, and itinerary settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Persona Card */}
        <div className="md:col-span-4">
          <Card className="flex flex-col items-center text-center p-6 gap-4 border-slate-200/80">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-400 shadow-warm-md"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <Badge variant="brand" icon={Compass}>
                {currentUser.travelStyle}
              </Badge>
              <Badge variant="emerald">
                ₹ {currentUser.preferences?.budgetLevel || 'Moderate'}
              </Badge>
            </div>

            <div className="text-left bg-sand-50 p-3.5 rounded-2xl border border-slate-200/60 w-full text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-500" /> Home Base: {currentUser.homeCity}
              </p>
              <p className="italic text-slate-500 font-normal mt-1">"{currentUser.bio}"</p>
            </div>
          </Card>
        </div>

        {/* Edit Preferences Form */}
        <div className="md:col-span-8">
          <Card className="p-6">
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                Edit Profile Details & Travel Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                />

                <Input
                  label="Home Base City"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  icon={MapPin}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Travel Persona & Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Heritage & Culture">Heritage & Culture</option>
                    <option value="Backpacker & Adventure">Backpacker & Adventure</option>
                    <option value="Luxury & Wellness">Luxury & Wellness</option>
                    <option value="Family Friendly">Family Friendly</option>
                    <option value="Food & Culinary Explorer">Food & Culinary Explorer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Budget Tier
                  </label>
                  <select
                    value={budgetLevel}
                    onChange={(e) => setBudgetLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Budget">₹ Budget (Backpacker / Hostels)</option>
                    <option value="Moderate">₹₹ Moderate (Comfort Hotels & Trains)</option>
                    <option value="Luxury">₹₹₹ Luxury (Palaces & Resorts)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Bio & Travel Goals</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50/70 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" icon={Save}>
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
