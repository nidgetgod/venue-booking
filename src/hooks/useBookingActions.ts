import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { validateBookingForm } from '@/utils/formValidation';
import { generateRecurringDates } from '@/utils/timeSlotUtils';

interface BookingForm {
  name: string;
  phone: string;
  peopleCount: string;
}

interface CreateBookingParams {
  date: string;
  time: string;
  name: string;
  phone: string;
  peopleCount: string;
  isRecurring: boolean;
}

interface CreateBatchBookingParams {
  dates: string[];
  time: string;
  name: string;
  phone: string;
  peopleCount: string;
}

interface BookingActionsOptions {
  createBooking: (data: CreateBookingParams) => Promise<{ success: boolean; message: string }>;
  createBatchBooking: (data: CreateBatchBookingParams) => Promise<{ success: boolean; message: string }>;
  deleteBooking: (id: number) => Promise<{ success: boolean; message: string }>;
}

export const useBookingActions = (options: BookingActionsOptions) => {
  const { createBooking, createBatchBooking, deleteBooking } = options;
  const tMessages = useTranslations('messages');
  const tFields = useTranslations('fields');

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const [showRecurringModal, setShowRecurringModal] = useState(false);

  const showDialogMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setDialogMessage(message);
    setDialogType(type);
    setShowDialog(true);
  };

  const handleBookingSubmit = async (
    bookingForm: BookingForm,
    selectedDate: string,
    selectedTime: string,
    isRecurring: boolean = false,
    weeks: number = 1
  ): Promise<{
    success: boolean;
    shouldResetForm: boolean;
  }> => {
    const missingFields = validateBookingForm(bookingForm, selectedDate, selectedTime);
    if (missingFields.length > 0) {
      const translatedFields = missingFields.map(field => tFields(field as any)).join('、');
      showDialogMessage(`${tMessages('missingFields')}：${translatedFields}`, 'error');
      return { success: false, shouldResetForm: false };
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
      setShowRecurringModal(false);
      return { success: true, shouldResetForm: true };
    }

    return { success: false, shouldResetForm: false };
  };

  const handleRecurringClick = (
    bookingForm: BookingForm,
    selectedDate: string,
    selectedTime: string
  ): boolean => {
    const missingFields = validateBookingForm(bookingForm, selectedDate, selectedTime);
    if (missingFields.length > 0) {
      const translatedFields = missingFields.map(field => tFields(field as any)).join('、');
      showDialogMessage(`${tMessages('missingFields')}：${translatedFields}`, 'error');
      return false;
    }
    setShowRecurringModal(true);
    return true;
  };

  const cancelBooking = (bookingId: number) => {
    setBookingToCancel(bookingId);
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = async (): Promise<boolean> => {
    if (bookingToCancel) {
      const result = await deleteBooking(bookingToCancel);
      showDialogMessage(result.message, result.success ? 'success' : 'error');
      setShowCancelDialog(false);
      setBookingToCancel(null);
      return result.success;
    }
    return false;
  };

  return {
    // Dialog state
    showDialog,
    setShowDialog,
    dialogMessage,
    dialogType,
    showDialogMessage,
    showCancelDialog,
    setShowCancelDialog,
    bookingToCancel,
    setBookingToCancel,
    showRecurringModal,
    setShowRecurringModal,
    // Actions
    handleBookingSubmit,
    handleRecurringClick,
    cancelBooking,
    confirmCancelBooking,
  };
};
