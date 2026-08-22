import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Share2, Copy, Check, Mail, QrCode, Users, ExternalLink, Globe } from 'lucide-react';

export const ShareTripModal = ({
  isOpen,
  onClose,
  tripTitle = 'My Trip',
  tripId = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [companionEmail, setCompanionEmail] = useState('');
  const [invitedList, setInvitedList] = useState([]);

  const shareableUrl = `https://globetrotter.in/public/trips/${tripId || 'demo'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!companionEmail.trim()) return;

    setInvitedList((prev) => [...prev, companionEmail.trim()]);
    setCompanionEmail('');
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Public Trip Itinerary"
      subtitle={`Share read-only link or co-plan "${tripTitle}"`}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-5">
        {/* 1-Click Copy Link */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Public Shareable Link</label>
            <Link
              to={`/public/trips/${tripId}`}
              onClick={onClose}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Page
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none font-mono"
            />
            <Button
              type="button"
              variant={copied ? 'emerald' : 'primary'}
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="p-4 bg-sand-50 rounded-2xl border border-slate-200/60 flex items-center gap-4">
          <div className="w-16 h-16 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
            <QrCode className="w-12 h-12 text-slate-800" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Mobile QR Code Scan</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Scan this code with a smartphone camera to view the public read-only itinerary live.
            </p>
          </div>
        </div>

        {/* Invite Companions Form */}
        <form onSubmit={handleInvite} className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-brand-500" /> Invite Co-Travelers by Email
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="friend@domain.com"
              icon={Mail}
              value={companionEmail}
              onChange={(e) => setCompanionEmail(e.target.value)}
            />
            <Button type="submit" variant="outline" size="sm">
              Invite
            </Button>
          </div>

          {invitedList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {invitedList.map((email, idx) => (
                <Badge key={idx} variant="brand" size="sm">
                  {email} (Invited)
                </Badge>
              ))}
            </div>
          )}
        </form>

        <div className="pt-2 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
