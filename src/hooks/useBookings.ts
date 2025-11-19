import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

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

export const useBookings = () => {
  const t = useTranslations('messages');
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
        setError(t('fetchError'));
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(t('fetchErrorRetry'));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
          return { success: true, message: t('bookingSuccess') };
        } else {
          const data = await response.json();
          return { success: false, message: data.error || t('bookingFailed') };
        }
      } catch (err) {
        console.error('Booking error:', err);
        return { success: false, message: t('bookingError') };
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings, t]
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
          const { successCount, conflictCount, conflicts } = data;
          let message = '';
          if (conflictCount > 0) {
            const conflictDates = conflicts.map((date: string) => `${date} ${bookingData.time}`).join('、');
            message = t('batchBookingSuccessWithConflicts', { 
              successCount, 
              conflictCount, 
              datesTimes: conflictDates 
            });
          } else {
            message = t('batchBookingSuccess', { count: successCount });
          }
          return { success: true, message };
        } else {
          return { success: false, message: data.error || t('bookingFailed') };
        }
      } catch (err) {
        console.error('Batch booking error:', err);
        return { success: false, message: t('bookingError') };
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings, t]
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
          return { success: true, message: t('cancelSuccess') };
        } else {
          return { success: false, message: t('cancelFailed') };
        }
      } catch (err) {
        console.error('Cancel booking error:', err);
        return { success: false, message: t('cancelError') };
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings, t]
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
