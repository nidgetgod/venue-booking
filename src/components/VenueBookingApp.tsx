'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { useCalendar } from '@/hooks/useCalendar';
import { useBookingActions } from '@/hooks/useBookingActions';
import { generateTimeSlots, getTodayString } from '@/utils/timeSlotUtils';
import { WEEK_DAYS } from '@/constants/calendar';
import NavigationHeader from './NavigationHeader';
import BookingView from './BookingView';
import RecordsView from './RecordsView';
import BookingDialog from './BookingDialog';
import CancelDialog from './CancelDialog';
import RecurringModal from './RecurringModal';

const VenueBookingApp: React.FC = () => {
  // View state
  const [currentView, setCurrentView] = useState<'booking' | 'calendar'>('booking');

  // Form state - Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedTime, setSelectedTime] = useState('');
  
  // Load last booking info from localStorage on mount
  const getInitialBookingInfo = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastBookingInfo');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { name: '', phone: '', peopleCount: '' };
        }
      }
    }
    return { name: '', phone: '', peopleCount: '' };
  };

  const [bookingForm, setBookingForm] = useState(getInitialBookingInfo());
  const [lastBookingInfo, setLastBookingInfo] = useState(getInitialBookingInfo());
  const [recurringWeeks, setRecurringWeeks] = useState(1);

  // Custom hooks
  const {
    bookings,
    fetchBookings,
    createBooking,
    createBatchBooking,
    deleteBooking,
    isTimeSlotBooked,
  } = useBookings();

  const { currentMonth, calendarDays, navigateMonth } = useCalendar(selectedDate);

  const bookingActions = useBookingActions({
    createBooking,
    createBatchBooking,
    deleteBooking,
  });

  // Initialize
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Memoized values
  const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate]);

  const hasAvailableSlots = (dateStr: string): boolean => {
    const slots = generateTimeSlots(dateStr);
    return slots.some((time) => !isTimeSlotBooked(dateStr, time));
  };

  // Handlers
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime('');
  };

  const handleBookingSubmit = async (isRecurring = false, weeks = 1) => {
    const result = await bookingActions.handleBookingSubmit(
      bookingForm,
      selectedDate,
      selectedTime,
      isRecurring,
      weeks
    );

    if (result.shouldResetForm) {
      // Save booking info for next use
      setLastBookingInfo({
        name: bookingForm.name,
        phone: bookingForm.phone,
        peopleCount: bookingForm.peopleCount,
      });

      // Reset time selection (keep personal info)
      setSelectedDate('');
      setSelectedTime('');
      setRecurringWeeks(1);
    }
  };

  const handleRecurringClick = () => {
    bookingActions.handleRecurringClick(bookingForm, selectedDate, selectedTime);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <NavigationHeader currentView={currentView} setCurrentView={setCurrentView} />

      {currentView === 'booking' && (
        <BookingView
          bookingForm={bookingForm}
          lastBookingInfo={lastBookingInfo}
          setBookingForm={setBookingForm}
          setLastBookingInfo={setLastBookingInfo}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          currentMonth={currentMonth}
          weekDays={WEEK_DAYS}
          calendarDays={calendarDays}
          handleDateSelect={handleDateSelect}
          navigateMonth={navigateMonth}
          hasAvailableSlots={hasAvailableSlots}
          timeSlots={timeSlots}
          isTimeSlotBooked={isTimeSlotBooked}
          setSelectedTime={setSelectedTime}
          handleBookingSubmit={handleBookingSubmit}
          handleRecurringClick={handleRecurringClick}
        />
      )}

      {currentView === 'calendar' && (
        <RecordsView bookings={bookings} cancelBooking={bookingActions.cancelBooking} />
      )}

      <BookingDialog
        showDialog={bookingActions.showDialog}
        dialogType={bookingActions.dialogType}
        dialogMessage={bookingActions.dialogMessage}
        setShowDialog={bookingActions.setShowDialog}
      />
      <CancelDialog
        showCancelDialog={bookingActions.showCancelDialog}
        confirmCancelBooking={bookingActions.confirmCancelBooking}
        setShowCancelDialog={bookingActions.setShowCancelDialog}
        setBookingToCancel={bookingActions.setBookingToCancel}
      />
      <RecurringModal
        showRecurringModal={bookingActions.showRecurringModal}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        recurringWeeks={recurringWeeks}
        setRecurringWeeks={setRecurringWeeks}
        isTimeSlotBooked={isTimeSlotBooked}
        handleBookingSubmit={handleBookingSubmit}
        setShowRecurringModal={bookingActions.setShowRecurringModal}
      />
    </div>
  );
};

export default VenueBookingApp;
