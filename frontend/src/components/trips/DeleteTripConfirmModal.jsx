import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteTripConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  tripTitle = 'this trip'
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Trip Confirmation"
      subtitle="This action cannot be undone"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-900">
            Are you sure you want to delete "{tripTitle}"?
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            All itinerary days, scheduled activities, and budget data for this trip will be permanently removed.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 w-full pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={onConfirm}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
