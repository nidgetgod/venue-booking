'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/i18n';

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedTime: string;
  timeSlots: string[];
  isTimeSlotBooked: (date: string, time: string) => boolean;
  setSelectedTime: (time: string) => void;
  selectedTimes?: string[];
  setSelectedTimes?: (times: string[]) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  selectedTime,
  timeSlots,
  isTimeSlotBooked,
  setSelectedTime,
  selectedTimes = [],
  setSelectedTimes,
}) => {
  const t = useTranslations('calendar');
  const { locale } = useLocale();

  if (!selectedDate) return null;

  const handleTimeClick = (time: string) => {
    const isBooked = isTimeSlotBooked(selectedDate, time);
    if (isBooked) return;

    // 如果有多選功能
    if (setSelectedTimes) {
      const timeIndex = timeSlots.indexOf(time);
      const currentIndices = selectedTimes.map(t => timeSlots.indexOf(t)).sort((a, b) => a - b);
      
      if (selectedTimes.includes(time)) {
        // 取消選擇
        const newTimes = selectedTimes.filter(t => t !== time);
        setSelectedTimes(newTimes);
        setSelectedTime(newTimes.length > 0 ? newTimes[0] : '');
      } else if (selectedTimes.length === 0) {
        // 第一次選擇
        setSelectedTimes([time]);
        setSelectedTime(time);
      } else {
        // 檢查是否連續
        const minIndex = Math.min(...currentIndices);
        const maxIndex = Math.max(...currentIndices);
        
        if (timeIndex === minIndex - 1 || timeIndex === maxIndex + 1) {
          // 在範圍邊界，直接添加
          const newTimes = [...selectedTimes, time];
          setSelectedTimes(newTimes);
          setSelectedTime(newTimes[0]);
        } else if (timeIndex > minIndex && timeIndex < maxIndex) {
          // 在範圍內，直接添加
          const newTimes = [...selectedTimes, time];
          setSelectedTimes(newTimes);
          setSelectedTime(newTimes[0]);
        } else {
          // 不連續，重新開始選擇
          setSelectedTimes([time]);
          setSelectedTime(time);
        }
      }
    } else {
      // 單選模式
      const isSelected = selectedTime === time;
      setSelectedTime(isSelected ? '' : time);
    }
  };

  const today = new Date();
  const isToday = selectedDate === `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const date = new Date(selectedDate);
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const localeCode = locale === 'zh-TW' ? 'zh-TW' : 'en-US';

  return (
    <div>
      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Clock size={18} />
        {t('availableSlots')} - {new Date(selectedDate).toLocaleDateString(localeCode, { 
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit', 
          weekday: 'short' 
        })}
        {isToday && (
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{t('today')}</span>
        )}
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {isWeekend ? t('weekend') : t('weekday')}
        </span>
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map(time => {
          const isBooked = isTimeSlotBooked(selectedDate, time);
          const isSelected = setSelectedTimes 
            ? selectedTimes.includes(time)
            : selectedTime === time;
          
          return (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              disabled={isBooked}
              className={`p-3 text-sm rounded-lg border transition-all ${
                isBooked 
                  ? 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed opacity-60' 
                  : isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 cursor-pointer' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
              }`}
            >
              {time}
              {isBooked && <div className="text-xs mt-1">{t('booked')}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
