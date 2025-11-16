import React from 'react';
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
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">預約記錄</h2>
      <BookingRecords bookings={bookings} cancelBooking={cancelBooking} />
    </div>
  );
};

export default RecordsView;
