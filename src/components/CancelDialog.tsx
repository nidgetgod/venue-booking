import React from 'react';
import { X } from 'lucide-react';

interface CancelDialogProps {
  showCancelDialog: boolean;
  confirmCancelBooking: () => void;
  setShowCancelDialog: (show: boolean) => void;
  setBookingToCancel: (id: number | null) => void;
}

const CancelDialog: React.FC<CancelDialogProps> = ({
  showCancelDialog,
  confirmCancelBooking,
  setShowCancelDialog,
  setBookingToCancel,
}) => {
  if (!showCancelDialog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <X size={32} className="text-yellow-600" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            確認取消預約
          </h3>
          
          <p className="text-gray-600 mb-6">
            您確定要取消這個預約嗎？此操作無法復原。
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowCancelDialog(false);
                setBookingToCancel(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              保留預約
            </button>
            <button
              onClick={confirmCancelBooking}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              確認取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelDialog;
