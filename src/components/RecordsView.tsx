'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import BookingRecords from './BookingRecords';

interface Booking {
  id: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  peopleCount: string;
  createdAt: string;
  isRecurring: boolean;
}

interface RecordsViewProps {
  bookings: Booking[];
  cancelBooking: (id: number) => void;
}

const RecordsView: React.FC<RecordsViewProps> = ({ bookings, cancelBooking }) => {
  const t = useTranslations('records');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('title')}</h2>
      <BookingRecords bookings={bookings} cancelBooking={cancelBooking} />
    </div>
  );
};

export default RecordsView;
