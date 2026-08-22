import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Tabs } from '../common/Tabs';
import { ActivityCard } from '../discovery/ActivityCard';
import { useApp } from '../../context/AppContext';
import { Plus, Sparkles, Clock, DollarSign, Tag, CheckCircle2 } from 'lucide-react';

export const AddActivityModal = ({
  isOpen,
  onClose,
  cityId,
  cityName,
  dayNumber,
  onAddActivity,
}) => {
  const { activities } = useApp();
  const [tab, setTab] = useState('catalog'); // 'catalog' or 'custom'

  // Custom activity form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sightseeing');
  const [cost, setCost] = useState(25);
  const [duration, setDuration] = useState(2.0);
  const [slot, setSlot] = useState('Morning'); // Morning, Afternoon, Evening

  const cityActivities = activities.filter((a) => a.cityId === cityId);

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const customActivity = {
      id: `custom-act-${Date.now()}`,
      title,
      category,
      cost: Number(cost) || 0,
      durationHours: Number(duration) || 1,
      rating: 5.0,
      image:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
      description: 'Custom activity added to itinerary.',
      cityId,
      timeSlot: slot
    };

    onAddActivity(customActivity, dayNumber);
    onClose();
  };

  const handleSelectCatalogActivity = (activity) => {
    onAddActivity({ ...activity, timeSlot: slot }, dayNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Experience to Day ${dayNumber}`}
      subtitle={`Selecting activity for ${cityName || 'City Leg'}`}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        <Tabs
          tabs={[
            { id: 'catalog', label: 'City Activity Catalog', icon: Sparkles },
            { id: 'custom', label: '+ Create Custom Activity', icon: Plus }
          ]}
          activeTab={tab}
          onChange={setTab}
        />

        {/* Time Slot Picker */}
        <div className="flex items-center gap-2 bg-sand-50 p-2 rounded-xl border border-slate-200/60">
          <span className="text-xs font-bold text-slate-500 mr-1">Time Slot:</span>
          {['Morning', 'Afternoon', 'Evening'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSlot(s)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                slot === s
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s === 'Morning' && '🌅 Morning'}
              {s === 'Afternoon' && '☀️ Afternoon'}
              {s === 'Evening' && '🌙 Evening'}
            </button>
          ))}
        </div>

        {tab === 'catalog' ? (
          <div>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              Click any catalog experience to add it directly to Day {dayNumber} ({slot}):
            </p>
            {cityActivities.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No pre-set activities found for this city. Switch to "+ Create Custom Activity" tab to add your own!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {cityActivities.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onToggleSelect={() => handleSelectCatalogActivity(act)}
                    showSelectButton
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreateCustom} className="flex flex-col gap-4">
            <Input
              label="Activity Title"
              placeholder="e.g. Traditional Tea Tasting at Local Cafe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Culture">Culture</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Nightlife">Nightlife</option>
                </select>
              </div>

              <Input
                label="Cost (₹ INR)"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />

              <Input
                label="Duration (Hours)"
                type="number"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                icon={Clock}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={Plus}>
                Add to Itinerary
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
