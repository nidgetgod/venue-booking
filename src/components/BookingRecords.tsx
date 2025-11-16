import React from 'react';
import { Calendar, Clock, User, Phone, Users, X } from 'lucide-react';

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

interface BookingRecordsProps {
  bookings: Booking[];
  cancelBooking: (id: number) => void;
}

const BookingRecords: React.FC<BookingRecordsProps> = ({ bookings, cancelBooking }) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
        <p>暫無預約記錄</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings
        .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
        .map(booking => (
          <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(booking.date).toLocaleDateString('zh-TW', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit',
                      weekday: 'short'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {booking.time}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 font-medium">
                    <User size={16} />
                    {booking.name}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Phone size={16} />
                    {booking.phone}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Users size={16} />
                    {booking.peopleCount} 人
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => cancelBooking(booking.id)}
                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BookingRecords;
