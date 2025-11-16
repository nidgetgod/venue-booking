'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { useCalendar } from '@/hooks/useCalendar';
import { generateTimeSlots, generateRecurringDates, getTodayString } from '@/utils/timeSlotUtils';
import { validateBookingForm } from '@/utils/formValidation';
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

  // Form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    peopleCount: '',
  });
  const [lastBookingInfo, setLastBookingInfo] = useState({
    name: '',
    phone: '',
    peopleCount: '',
  });

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
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

  // Initialize
  useEffect(() => {
    fetchBookings();
    setSelectedDate(getTodayString());
  }, [fetchBookings]);

  // Restore last booking info
  useEffect(() => {
    if (lastBookingInfo.name || lastBookingInfo.phone || lastBookingInfo.peopleCount) {
      setBookingForm(lastBookingInfo);
    }
  }, [lastBookingInfo]);

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

  const showDialogMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setDialogMessage(message);
    setDialogType(type);
    setShowDialog(true);
  };

  const handleBookingSubmit = async (isRecurring = false, weeks = 1) => {
    const missingFields = validateBookingForm(bookingForm, selectedDate, selectedTime);
    if (missingFields.length > 0) {
      showDialogMessage(`請填寫以下欄位：${missingFields.join('、')}`, 'error');
      return;
    }

    let result;
    if (isRecurring) {
      const dates = generateRecurringDates(selectedDate, weeks);
      result = await createBatchBooking({
        dates,
        time: selectedTime,
        name: bookingForm.name,
        phone: bookingForm.phone,
        peopleCount: bookingForm.peopleCount,
      });
    } else {
      result = await createBooking({
        date: selectedDate,
        time: selectedTime,
        name: bookingForm.name,
        phone: bookingForm.phone,
        peopleCount: bookingForm.peopleCount,
        isRecurring: false,
      });
    }

    showDialogMessage(result.message, result.success ? 'success' : 'error');

    if (result.success) {
      // Save booking info for next use
      setLastBookingInfo({
        name: bookingForm.name,
        phone: bookingForm.phone,
        peopleCount: bookingForm.peopleCount,
      });

      // Reset time selection (keep personal info)
      setSelectedDate('');
      setSelectedTime('');
      setShowRecurringModal(false);
      setRecurringWeeks(1);
    }
  };

  const handleRecurringClick = () => {
    const missingFields = validateBookingForm(bookingForm, selectedDate, selectedTime);
    if (missingFields.length > 0) {
      showDialogMessage(`請填寫以下欄位：${missingFields.join('、')}`, 'error');
      return;
    }
    setShowRecurringModal(true);
  };

  const cancelBooking = (bookingId: number) => {
    setBookingToCancel(bookingId);
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    if (bookingToCancel) {
      const result = await deleteBooking(bookingToCancel);
      showDialogMessage(result.message, result.success ? 'success' : 'error');
      setShowCancelDialog(false);
      setBookingToCancel(null);
    }
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
        <RecordsView bookings={bookings} cancelBooking={cancelBooking} />
      )}

      <BookingDialog
        showDialog={showDialog}
        dialogType={dialogType}
        dialogMessage={dialogMessage}
        setShowDialog={setShowDialog}
      />
      <CancelDialog
        showCancelDialog={showCancelDialog}
        confirmCancelBooking={confirmCancelBooking}
        setShowCancelDialog={setShowCancelDialog}
        setBookingToCancel={setBookingToCancel}
      />
      <RecurringModal
        showRecurringModal={showRecurringModal}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        recurringWeeks={recurringWeeks}
        setRecurringWeeks={setRecurringWeeks}
        isTimeSlotBooked={isTimeSlotBooked}
        handleBookingSubmit={handleBookingSubmit}
        setShowRecurringModal={setShowRecurringModal}
      />
    </div>
  );
};

export default VenueBookingApp;
