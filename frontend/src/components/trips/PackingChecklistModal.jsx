import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { CheckSquare, Square, Plus, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PackingChecklistModal = ({
  isOpen,
  onClose,
  cities = [],
  tripTitle = 'My Trip'
}) => {
  // Pre-seed smart recommendations based on trip cities
  const cityNames = cities.map((c) => c.cityName?.toLowerCase() || '');

  const hasHimalayas = cityNames.some((c) => c.includes('ladakh') || c.includes('manali') || c.includes('rishikesh'));
  const hasBeaches = cityNames.some((c) => c.includes('goa') || c.includes('kochi'));
  const hasHeritage = cityNames.some((c) => c.includes('jaipur') || c.includes('varanasi') || c.includes('agra') || c.includes('amritsar'));

  const initialItems = [
    // Essentials
    { id: 1, category: 'Documents & Wallet', label: 'Government Photo ID (Aadhaar / Passport / Driving License)', checked: true },
    { id: 2, category: 'Documents & Wallet', label: 'Train / Flight Ticket Printouts & Hotel Vouchers', checked: true },
    { id: 3, category: 'Tech & Power', label: 'Phone Charger & Portable Power Bank (10000mAh+)', checked: false },
    { id: 4, category: 'Medicines & Health', label: 'First Aid Kit, Motion Sickness & ORS Packets', checked: false },

    // Weather Specific
    ...(hasHimalayas
      ? [
          { id: 5, category: 'Clothing & Wear', label: 'Heavy Woolen Jacket / Thermal Innerwear (Himalayan Cold)', checked: false },
          { id: 6, category: 'Clothing & Wear', label: 'UV Sunglasses & High SPF Sunscreen (High Altitude)', checked: false }
        ]
      : []),
    ...(hasBeaches
      ? [
          { id: 7, category: 'Clothing & Wear', label: 'Cotton Beachwear, Flip-Flops & Waterproof Phone Pouch', checked: false },
          { id: 8, category: 'Health & Beauty', label: 'Mosquito Repellent Cream / Spray', checked: false }
        ]
      : []),
    ...(hasHeritage
      ? [
          { id: 9, category: 'Clothing & Wear', label: 'Modest Temple Attire & Easy Slip-On Footwear for Ghats/Temples', checked: false },
          { id: 10, category: 'Clothing & Wear', label: 'Cotton Scarves / Dupatta for Sun Protection', checked: false }
        ]
      : [])
  ];

  const [items, setItems] = useState(initialItems);
  const [newItemText, setNewItemText] = useState('');

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        category: 'Custom Item',
        label: newItemText.trim(),
        checked: false
      }
    ]);
    setNewItemText('');
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const percentage = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart India Packing Assistant"
      subtitle={`Tailored packing recommendations for "${tripTitle}"`}
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-5">
        {/* Progress Bar Header */}
        <div className="p-4 bg-sand-50 rounded-2xl border border-slate-200/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Packing Progress
            </span>
            <span className="text-brand-600">
              {checkedCount} / {items.length} Items Packed ({percentage}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Add Custom Item */}
        <form onSubmit={handleAddItem} className="flex items-center gap-2">
          <Input
            placeholder="Add custom packing item (e.g. Camera tripod)..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <Button type="submit" variant="primary" size="md" icon={Plus}>
            Add
          </Button>
        </form>

        {/* Checklist */}
        <div className="max-h-72 overflow-y-auto pr-1 flex flex-col gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all ${
                item.checked
                  ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300 font-semibold'
              }`}
            >
              {item.checked ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className="flex-1">{item.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                {item.category}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} icon={CheckCircle2}>
            Done Packing
          </Button>
        </div>
      </div>
    </Modal>
  );
};
