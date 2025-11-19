'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BookingDialogProps {
  showDialog: boolean;
  dialogType: 'success' | 'error';
  dialogMessage: string;
  setShowDialog: (show: boolean) => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({ showDialog, dialogType, dialogMessage, setShowDialog }) => {
  const t = useTranslations('dialog');

  if (!showDialog) return null;
  
  const isCancelSuccess = dialogMessage.includes('取消') || dialogMessage.toLowerCase().includes('cancel');
  const title = dialogType === 'success' 
    ? (isCancelSuccess ? t('cancelSuccess') : t('success'))
    : t('error');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${dialogType === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {dialogType === 'success' ? (
              <Check size={32} className="text-green-600" />
            ) : (
              <X size={32} className="text-red-600" />
            )}
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${dialogType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {title}
          </h3>
          <p className="text-gray-600 mb-6">{dialogMessage}</p>
          <button
            onClick={() => setShowDialog(false)}
            className={`px-6 py-2 rounded-lg text-white font-medium cursor-pointer ${dialogType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition-colors`}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDialog;
