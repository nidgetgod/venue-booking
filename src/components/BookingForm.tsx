'use client';

import React from 'react';
import { IMaskInput } from 'react-imask';
import { useTranslations } from 'next-intl';

interface BookingFormProps {
  bookingForm: {
    name: string;
    phone: string;
    peopleCount: string;
  };
  lastBookingInfo: {
    name: string;
    phone: string;
    peopleCount: string;
  };
  setBookingForm: (form: { name: string; phone: string; peopleCount: string }) => void;
  setLastBookingInfo: (info: { name: string; phone: string; peopleCount: string }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ bookingForm, lastBookingInfo, setBookingForm, setLastBookingInfo }) => {
  const t = useTranslations('form');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t('name')}
          {lastBookingInfo.name && (
            <span className="text-xs text-green-600 ml-2">✓ {t('useLastInfo')}</span>
          )}
        </label>
        <input
          type="text"
          value={bookingForm.name}
          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('namePlaceholder')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t('phone')}
          {lastBookingInfo.phone && (
            <span className="text-xs text-green-600 ml-2">✓ {t('useLastInfo')}</span>
          )}
        </label>
        <IMaskInput
          mask="0000-000-000"
          value={bookingForm.phone}
          onAccept={(value) => setBookingForm({ ...bookingForm, phone: value })}
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('phonePlaceholder')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {t('peopleCount')}
          {lastBookingInfo.peopleCount && (
            <span className="text-xs text-green-600 ml-2">✓ {t('useLastInfo')}</span>
          )}
        </label>
        <input
          type="number"
          min="1"
          value={bookingForm.peopleCount}
          onChange={(e) => setBookingForm({ ...bookingForm, peopleCount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('peopleCountPlaceholder')}
        />
      </div>
    </div>
  );
};

export default BookingForm;
