'use client';

import React from 'react';
import { Check, Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/i18n';

interface RecurringModalProps {
  showRecurringModal: boolean;
  selectedDate: string;
  selectedTime: string;
  recurringWeeks: number;
  setRecurringWeeks: (weeks: number) => void;
  isTimeSlotBooked: (date: string, time: string) => boolean;
  handleBookingSubmit: (isRecurring: boolean, weeks: number) => void;
  setShowRecurringModal: (show: boolean) => void;
}

const RecurringModal: React.FC<RecurringModalProps> = ({
  showRecurringModal,
  selectedDate,
  selectedTime,
  recurringWeeks,
  setRecurringWeeks,
  isTimeSlotBooked,
  handleBookingSubmit,
  setShowRecurringModal,
}) => {
  const t = useTranslations('recurring');
  const { locale } = useLocale();

  if (!showRecurringModal) return null;

  const localeCode = locale === 'zh-TW' ? 'zh-TW' : 'en-US';
  const dayNames = locale === 'zh-TW' ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <p className="text-gray-700 mb-2 font-medium">{t('slot')}</p>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} />
              {t('everyWeek')} {dayNames[new Date(selectedDate).getDay()]} - {selectedTime}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={14} />
              {t('startFrom')} {new Date(selectedDate).toLocaleDateString(localeCode, { 
                month: '2-digit', 
                day: '2-digit'
              })}
            </div>
          </div>
        </div>
        
        {/* 週數選擇器 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">{t('weeksLabel')}</label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setRecurringWeeks(Math.max(1, recurringWeeks - 1))}
              disabled={recurringWeeks <= 1}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              -
            </button>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{recurringWeeks}</div>
              <div className="text-xs text-gray-500">{t('week')}</div>
            </div>
            
            <button
              onClick={() => setRecurringWeeks(Math.min(12, recurringWeeks + 1))}
              disabled={recurringWeeks >= 12}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              +
            </button>
          </div>
          
          <div className="text-center mt-2">
            <div className="text-sm text-gray-600">
              {t('totalBookings')} <span className="font-medium text-blue-600">{recurringWeeks}</span> {t('times')}
            </div>
            <div className="text-xs text-gray-500">
              ({Math.ceil(recurringWeeks / 4)} {t('months')})
            </div>
          </div>
        </div>

        {/* 預約日期預覽 */}
        <div className="mb-6 max-h-40 overflow-y-auto">
          <h5 className="text-sm font-medium text-gray-700 mb-2">{t('preview')}</h5>
          <div className="space-y-1">
            {Array.from({length: recurringWeeks}, (_, i) => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() + (i * 7));
              const dateStr = date.toISOString().split('T')[0];
              const isConflict = isTimeSlotBooked(dateStr, selectedTime);
              
              return (
                <div 
                  key={i} 
                  className={`text-xs p-2 rounded flex justify-between items-center ${
                    isConflict ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                  }`}
                >
                  <span>
                    {date.toLocaleDateString(localeCode, { 
                      year: 'numeric',
                      month: '2-digit', 
                      day: '2-digit',
                      weekday: 'short'
                    })} {selectedTime}
                  </span>
                  {isConflict ? (
                    <span className="text-red-500">{t('conflict')}</span>
                  ) : (
                    <span className="text-green-500">{t('available')}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowRecurringModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => handleBookingSubmit(true, recurringWeeks)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check size={18} />
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecurringModal;
