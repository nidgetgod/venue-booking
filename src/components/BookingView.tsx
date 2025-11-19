'use client';

import React from 'react';
import { User, Clock, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/i18n';
import { getLegendItems } from '@/constants/calendar';
import { getTodayString } from '@/utils/timeSlotUtils';
import BookingForm from './BookingForm';
import SelectedTimeDisplay from './SelectedTimeDisplay';
import VenueAnnouncement from './VenueAnnouncement';
import CalendarSelector from './CalendarSelector';
import TimeSlotSelector from './TimeSlotSelector';

interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface BookingViewProps {
  bookingForm: { name: string; phone: string; peopleCount: string };
  lastBookingInfo: { name: string; phone: string; peopleCount: string };
  setBookingForm: (form: { name: string; phone: string; peopleCount: string }) => void;
  setLastBookingInfo: (info: { name: string; phone: string; peopleCount: string }) => void;
  selectedDate: string;
  selectedTime: string;
  selectedTimes: string[];
  setSelectedTimes: (times: string[]) => void;
  currentMonth: Date;
  weekDays: string[];
  calendarDays: CalendarDay[];
  handleDateSelect: (dateStr: string) => void;
  navigateMonth: (direction: number) => void;
  hasAvailableSlots: (dateStr: string) => boolean;
  timeSlots: string[];
  isTimeSlotBooked: (date: string, time: string) => boolean;
  setSelectedTime: (time: string) => void;
  handleBookingSubmit: (isRecurring: boolean, weeks: number) => Promise<void>;
  handleRecurringClick: () => void;
}

const BookingView: React.FC<BookingViewProps> = ({
  bookingForm,
  lastBookingInfo,
  setBookingForm,
  setLastBookingInfo,
  selectedDate,
  selectedTime,
  selectedTimes,
  setSelectedTimes,
  currentMonth,
  weekDays,
  calendarDays,
  handleDateSelect,
  navigateMonth,
  hasAvailableSlots,
  timeSlots,
  isTimeSlotBooked,
  setSelectedTime,
  handleBookingSubmit,
  handleRecurringClick,
}) => {
  const tForm = useTranslations('form');
  const tCalendar = useTranslations('calendar');
  const tBooking = useTranslations('booking');
  
  const isToday = selectedDate === getTodayString();
  const legendItems = getLegendItems((key: string) => tCalendar(key as any));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* 左側：租借人資訊 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <User size={20} />
          {tForm('userInfo')}
        </h2>
        <BookingForm
          bookingForm={bookingForm}
          lastBookingInfo={lastBookingInfo}
          setBookingForm={setBookingForm}
          setLastBookingInfo={setLastBookingInfo}
        />
        <SelectedTimeDisplay 
          selectedDate={selectedDate} 
          selectedTime={selectedTime}
          selectedTimes={selectedTimes}
        />
        <VenueAnnouncement />
      </div>

      {/* 右側：日曆時段選擇 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Clock size={20} />
          {tCalendar('selectDateTime')}
        </h2>
        <CalendarSelector
          currentMonth={currentMonth}
          weekDays={weekDays}
          calendarDays={calendarDays}
          handleDateSelect={handleDateSelect}
          navigateMonth={navigateMonth}
          hasAvailableSlots={hasAvailableSlots}
        />
        <TimeSlotSelector
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          timeSlots={timeSlots}
          isTimeSlotBooked={isTimeSlotBooked}
          setSelectedTime={setSelectedTime}
          selectedTimes={selectedTimes}
          setSelectedTimes={setSelectedTimes}
        />

        {/* 圖例說明 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-700 mb-2">{tCalendar('legend')}</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${item.color} rounded`}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          {isToday && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              {tCalendar('autoSelectToday')}
            </div>
          )}
        </div>

        {/* 預約按鈕 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleBookingSubmit(false, 1)}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check size={20} />
            {tBooking('singleBook')}
          </button>
          <button
            onClick={handleRecurringClick}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarIcon size={20} />
            {tBooking('recurringBook')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingView;
