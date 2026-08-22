import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { User, Mail, MapPin, Compass, Heart, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [travelStyle, setTravelStyle] = useState(currentUser?.travelStyle || '');
  const [homeCity, setHomeCity] = useState(currentUser?.homeCity || '');

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, bio, travelStyle, homeCity });
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
          Manage your traveler persona, bio, and trip preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Card */}
        <div className="md:col-span-4">
          <Card className="flex flex-col items-center text-center p-6 gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-400 shadow-warm-md"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>
            <Badge variant="brand" icon={Compass}>
              {currentUser.travelStyle}
            </Badge>
            <p className="text-xs text-slate-600 italic bg-sand-100 p-3 rounded-xl w-full">
              "{currentUser.bio}"
            </p>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8">
          <Card className="p-6">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Edit Profile Details
              </h3>

              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
              />

              <Input
                label="Home City"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                icon={MapPin}
              />

              <Input
                label="Travel Style"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                icon={Compass}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50/70 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" icon={Save}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
