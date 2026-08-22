import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Share2, Copy, Check, Mail, QrCode, Users, Sparkles } from 'lucide-react';

export const ShareTripModal = ({
  isOpen,
  onClose,
  tripTitle = 'My Trip',
  tripId = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [companionEmail, setCompanionEmail] = useState('');
  const [invitedList, setInvitedList] = useState([]);

  const shareableUrl = `https://globetrotter.in/trips/${tripId || 'demo'}?share=true`;

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
      title="Share Trip & Co-Plan"
      subtitle={`Invite travel companions to view or collaborate on "${tripTitle}"`}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-5">
        {/* 1-Click Copy Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Shareable Trip Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none"
            />
            <Button
              type="button"
              variant={copied ? 'secondary' : 'primary'}
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
            <h4 className="text-xs font-bold text-slate-900">Mobile Scan QR Code</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Scan this code with a mobile camera to open the itinerary live on your phone.
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
