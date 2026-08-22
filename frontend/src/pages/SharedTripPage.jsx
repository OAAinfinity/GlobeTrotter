import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TripItineraryView } from '../components/trips/TripItineraryView';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Share2,
  Copy,
  Check,
  Globe,
  Calendar,
  MapPin,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Users,
  CheckCircle2,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';

export const SharedTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, cities, activities, addTrip, currentUser, users } = useApp();

  const [copied, setCopied] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const trip = trips.find((t) => t.id === tripId) || trips[0];

  if (!trip) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Card className="p-8 flex flex-col items-center gap-3">
          <Globe className="w-12 h-12 text-slate-300" />
          <h2 className="text-lg font-bold text-slate-900">Public Itinerary Not Found</h2>
          <p className="text-xs text-slate-500">
            This shared trip link may have expired or been removed.
          </p>
          <Link to="/discover">
            <Button variant="primary" size="sm">
              Explore Destinations
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Creator details
  const creator = users.find((u) => u.id === trip.userId) || users[0];

  // Shareable URL
  const publicUrl = `https://globetrotter.in/public/trips/${trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Mock Social Share Handlers
  const handleSocialShare = (platform) => {
    let targetUrl = '';
    const text = encodeURIComponent(`Check out this travel itinerary: "${trip.title}" on GlobeTrotter India!`);

    if (platform === 'whatsapp') {
      targetUrl = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(publicUrl)}`;
    } else if (platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(publicUrl)}`;
    } else if (platform === 'facebook') {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
    } else if (platform === 'email') {
      targetUrl = `mailto:?subject=${encodeURIComponent(trip.title)}&body=${text}%20${encodeURIComponent(publicUrl)}`;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  };

  // Clone / Copy Trip to My Itineraries
  const handleCopyTripToMyAccount = () => {
    setIsCloning(true);

    setTimeout(() => {
      const clonedTrip = {
        ...trip,
        id: `trip-${Date.now()}`,
        userId: currentUser?.id || 'user-1',
        title: `${trip.title} (Copy)`,
        createdAt: new Date().toISOString(),
        status: 'Upcoming'
      };

      addTrip(clonedTrip);
      setIsCloning(false);

      // Redirect to My Trips
      navigate('/trips');
    }, 400);
  };

  const tripStops = trip.cities || [];

  // Calculate total days
  const calculateTotalDays = () => {
    if (!trip.startDate || !trip.endDate) return 7;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 7;
  };

  const totalDays = calculateTotalDays();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        <Badge variant="emerald" icon={Globe}>
          Public Read-Only Itinerary
        </Badge>
      </div>

      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-warm-lg">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 flex flex-col gap-5 max-w-4xl">
          {/* Creator Tag & Badges */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-400"
              />
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-semibold">Created by</span>
                <span className="text-sm font-bold text-white">{creator.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="amber" icon={Calendar}>
                {trip.startDate} to {trip.endDate} ({totalDays} Days)
              </Badge>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {trip.title}
          </h1>

          {trip.description && (
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {trip.description}
            </p>
          )}

          {/* Route Legs Pill Stream */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400" /> Route Sequence:
            </span>
            {tripStops.map((leg, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20"
              >
                #{idx + 1} {leg.cityName} ({leg.days || 3}d)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sharing & Clone Toolbar Bar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-warm-sm flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Shareable Link Input */}
        <div className="flex-1 flex flex-col gap-1 w-full">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Shareable Public Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none font-mono"
            />
            <Button
              type="button"
              variant={copied ? 'emerald' : 'outline'}
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopyLink}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>

        {/* Social Share Buttons & Copy Trip CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-between md:justify-end">
          {/* Social Icons */}
          <div className="flex items-center gap-1.5 border-r border-slate-200/80 pr-3">
            <button
              type="button"
              onClick={() => handleSocialShare('whatsapp')}
              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Twitter / X SVG Icon */}
            <button
              type="button"
              onClick={() => handleSocialShare('twitter')}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
              title="Share on Twitter / X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            {/* Facebook SVG Icon */}
            <button
              type="button"
              onClick={() => handleSocialShare('facebook')}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare('email')}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              title="Share via Email"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

          {/* Prominent Copy Trip to My Account CTA */}
          <Button
            variant="primary"
            size="md"
            icon={Copy}
            isLoading={isCloning}
            onClick={handleCopyTripToMyAccount}
            className="shadow-warm-sm"
          >
            Copy Trip to My Itineraries
          </Button>
        </div>
      </div>

      {/* Pure Read-Only Itinerary Breakdown (NO Edit Controls) */}
      <TripItineraryView trip={trip} cities={cities} activities={activities} />
    </div>
  );
};
