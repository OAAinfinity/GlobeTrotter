import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { CITY_IMAGE_MAP } from '../data/cityImageMap';
import {
  Compass,
  Calendar,
  DollarSign,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

const COVER_PRESETS = [
  {
    name: 'Paris Eiffel Tower',
    url: CITY_IMAGE_MAP.Paris
  },
  {
    name: 'London Big Ben',
    url: CITY_IMAGE_MAP.London
  },
  {
    name: 'Dubai Burj Khalifa',
    url: CITY_IMAGE_MAP.Dubai
  },
  {
    name: 'Rome Colosseum',
    url: CITY_IMAGE_MAP.Rome
  },
  {
    name: 'Tokyo Shibuya Skyline',
    url: CITY_IMAGE_MAP.Tokyo
  },
  {
    name: 'Sydney Opera House',
    url: CITY_IMAGE_MAP.Sydney
  }
];

export const CreateTripPage = () => {
  const navigate = useNavigate();
  const { addTrip, currentUser } = useApp();

  // Form Fields
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-25');
  const [description, setDescription] = useState('');
  const [totalBudget, setTotalBudget] = useState(4500);
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);

  // Validation States
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // File Upload Handler (FileReader to Data URL for instant live preview)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, coverImage: 'Image size should be less than 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        setErrors((prev) => ({ ...prev, coverImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (errors.startDate || errors.endDate) {
      setErrors((prev) => ({ ...prev, startDate: '', endDate: '' }));
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    if (errors.endDate) {
      setErrors((prev) => ({ ...prev, endDate: '' }));
    }
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Trip name is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Trip name must be at least 3 characters long';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = 'End date must be strictly after the start date';
    }

    if (!totalBudget || Number(totalBudget) <= 0) {
      newErrors.totalBudget = 'Please enter a valid target budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const newTripData = {
        title: title.trim(),
        startDate,
        endDate,
        description: description.trim(),
        totalBudget: Number(totalBudget),
        estimatedCost: 0,
        coverImage: coverImage || COVER_PRESETS[0].url,
        cities: [], // Empty stops array initially as per requirements
        selectedActivities: [],
        status: 'Upcoming'
      };

      const createdTrip = addTrip(newTripData);
      setIsLoading(false);

      // Route directly into the Itinerary Builder for the new trip
      navigate(`/trips/${createdTrip.id}`);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Top Header & Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
        </Link>
        <Badge variant="amber" icon={Sparkles}>
          New Multi-City Itinerary
        </Badge>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Trip
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Set up your trip details, date range, cover photo, and budget target. Next, you'll add city legs and schedule activities.
        </p>
      </div>

      <Card padding="lg" className="shadow-warm-md border-slate-200/80">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          {/* Trip Title */}
          <Input
            id="title"
            label="Trip Name"
            placeholder="e.g. European Cultural Capitals Tour"
            value={title}
            onChange={handleTitleChange}
            icon={Compass}
            error={errors.title}
            required
          />

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="startDate"
              type="date"
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              icon={Calendar}
              error={errors.startDate}
              required
            />

            <Input
              id="endDate"
              type="date"
              label="End Date (Must be after Start Date)"
              value={endDate}
              onChange={handleEndDateChange}
              icon={Calendar}
              error={errors.endDate}
              required
            />
          </div>

          {/* Target Budget */}
          <Input
            id="totalBudget"
            type="number"
            label="Target Budget ($ USD)"
            placeholder="4500"
            value={totalBudget}
            onChange={(e) => {
              setTotalBudget(e.target.value);
              if (errors.totalBudget) setErrors((prev) => ({ ...prev, totalBudget: '' }));
            }}
            error={errors.totalBudget}
            helperText="Overall expenditure goal for stay, food, transport, and activities."
            required
          />

          {/* Description Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Trip Description & Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add notes about your trip goals, places to see, travel companions, or packing reminders..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50/70 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Cover Photo Selection & Upload with Live Preview */}
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-brand-500" />
              Cover Photo Selection & Live Preview
            </label>

            {/* Live Image Preview Card */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
              <img
                src={coverImage}
                alt="Trip Cover Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                <div>
                  <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider block">
                    Live Cover Preview
                  </span>
                  <h4 className="text-lg font-extrabold text-white">
                    {title || 'Your Trip Title Here'}
                  </h4>
                </div>
              </div>
            </div>

            {/* Preset Buttons */}
            <div>
              <span className="text-xs text-slate-500 font-semibold block mb-2">
                Choose a Featured Global Preset:
              </span>
              <div className="flex flex-wrap gap-2">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setCoverImage(preset.url);
                      setErrors((prev) => ({ ...prev, coverImage: '' }));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      coverImage === preset.url
                        ? 'bg-brand-500 text-white border-brand-500 shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Photo Upload Input */}
            <div className="flex items-center gap-3 mt-1">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors">
                <Upload className="w-4 h-4 text-brand-500" />
                Upload Custom Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">
                Supports JPG, PNG, WebP (Max 5MB)
              </span>
            </div>

            {errors.coverImage && (
              <p className="text-xs text-rose-500 font-medium">{errors.coverImage}</p>
            )}
          </div>

          {/* Form Action Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link to="/trips">
              <Button type="button" variant="ghost" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={CheckCircle2}
            >
              Save & Build Itinerary
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
