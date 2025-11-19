'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useBookings } from '@/hooks/useBookings';
import { useCalendar } from '@/hooks/useCalendar';
import { useBookingActions } from '@/hooks/useBookingActions';
import { generateTimeSlots, getTodayString } from '@/utils/timeSlotUtils';
import { WEEK_DAYS_ZH, WEEK_DAYS_EN } from '@/constants/calendar';
import { useLocale } from '@/i18n';
import NavigationHeader from './NavigationHeader';
import BookingView from './BookingView';
import RecordsView from './RecordsView';
import BookingDialog from './BookingDialog';
import CancelDialog from './CancelDialog';
import RecurringModal from './RecurringModal';

const VenueBookingApp: React.FC = () => {
  const { locale } = useLocale();
  const tMessages = useTranslations('messages');
  const tFields = useTranslations('fields');
  
  // View state
  const [currentView, setCurrentView] = useState<'booking' | 'calendar'>('booking');

  // Form state - Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  
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
  const weekDays = useMemo(() => locale === 'zh-TW' ? WEEK_DAYS_ZH : WEEK_DAYS_EN, [locale]);

  const hasAvailableSlots = (dateStr: string): boolean => {
    const slots = generateTimeSlots(dateStr);
    return slots.some((time) => !isTimeSlotBooked(dateStr, time));
  };

  // Handlers
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime('');
    setSelectedTimes([]);
  };

  const handleBookingSubmit = async (isRecurring = false, weeks = 1) => {
    // 如果有多選時段（包括單個時段），需要逐個預約
    if (selectedTimes.length >= 1 && !isRecurring) {
      // 檢查表單
      const { validateBookingForm } = await import('@/utils/formValidation');
      const missingFields = validateBookingForm(bookingForm, selectedDate, selectedTimes[0]);
      if (missingFields.length > 0) {
        const translatedFields = missingFields.map(field => tFields(field as 'name' | 'phone' | 'peopleCount' | 'date' | 'time')).join('、');
        bookingActions.showDialogMessage(`${tMessages('missingFields')}：${translatedFields}`, 'error');
        return;
      }
      
      // 逐個預約每個時段
      let successCount = 0;
      const failedTimes: string[] = [];
      
      for (const time of selectedTimes) {
        const result = await createBooking({
          date: selectedDate,
          time: time,
          name: bookingForm.name,
          phone: bookingForm.phone,
          peopleCount: bookingForm.peopleCount,
          isRecurring: false,
        });
        
        if (result.success) {
          successCount++;
        } else {
          failedTimes.push(time);
        }
      }
      
      if (successCount > 0) {
        setLastBookingInfo({
          name: bookingForm.name,
          phone: bookingForm.phone,
          peopleCount: bookingForm.peopleCount,
        });
        setSelectedDate('');
        setSelectedTime('');
        setSelectedTimes([]);
        
        // 單個時段成功，使用簡單訊息
        if (selectedTimes.length === 1 && failedTimes.length === 0) {
          bookingActions.showDialogMessage(tMessages('bookingSuccess'), 'success');
        } else {
          const message = failedTimes.length > 0
            ? tMessages('multiSlotSuccessWithFailures', { successCount, failedTimes: failedTimes.join('、') })
            : tMessages('multiSlotSuccess', { count: successCount });
          bookingActions.showDialogMessage(message, 'success');
        }
      } else {
        bookingActions.showDialogMessage(tMessages('bookingFailed'), 'error');
      }
      
      return;
    }
    
    // 連續預約（使用 selectedTime）
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
      setSelectedTimes([]);
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
          weekDays={weekDays}
          calendarDays={calendarDays}
          handleDateSelect={handleDateSelect}
          navigateMonth={navigateMonth}
          hasAvailableSlots={hasAvailableSlots}
          timeSlots={timeSlots}
          isTimeSlotBooked={isTimeSlotBooked}
          setSelectedTime={setSelectedTime}
          selectedTimes={selectedTimes}
          setSelectedTimes={setSelectedTimes}
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
