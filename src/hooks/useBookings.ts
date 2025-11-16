import { useState, useCallback } from 'react';

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

interface BookingFormData {
  name: string;
  phone: string;
  peopleCount: string;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError('讀取預約資料失敗');
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('讀取預約資料失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(
    async (bookingData: {
      date: string;
      time: string;
      name: string;
      phone: string;
      peopleCount: string;
      isRecurring: boolean;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });

        if (response.ok) {
          await fetchBookings();
          return { success: true, message: '已完成預約，可在預約紀錄裡查詢' };
        } else {
          const data = await response.json();
          return { success: false, message: data.error || '預約失敗' };
        }
      } catch (err) {
        console.error('Booking error:', err);
        return { success: false, message: '預約失敗，請稍後再試' };
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings]
  );

  const createBatchBooking = useCallback(
    async (bookingData: {
      dates: string[];
      time: string;
      name: string;
      phone: string;
      peopleCount: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/bookings/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        if (response.ok) {
          await fetchBookings();
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.error || '預約失敗' };
        }
      } catch (err) {
        console.error('Batch booking error:', err);
        return { success: false, message: '預約失敗，請稍後再試' };
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings]
  );

  const deleteBooking = useCallback(
    async (bookingId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchBookings();
          return { success: true, message: '預約已成功取消' };
        } else {
          return { success: false, message: '取消預約失敗' };
        }
      } catch (err) {
        console.error('Cancel booking error:', err);
        return { success: false, message: '取消預約失敗，請稍後再試' };
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings]
  );

  const isTimeSlotBooked = useCallback(
    (date: string, time: string): boolean => {
      return bookings.some((booking) => {
        const bookingDate =
          typeof booking.date === 'string'
            ? booking.date.split('T')[0]
            : new Date(booking.date).toISOString().split('T')[0];
        return bookingDate === date && booking.time === time;
      });
    },
    [bookings]
  );

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    createBatchBooking,
    deleteBooking,
    isTimeSlotBooked,
  };
};
