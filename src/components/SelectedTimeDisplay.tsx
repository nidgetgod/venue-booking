'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/i18n';

interface SelectedTimeDisplayProps {
  selectedDate: string;
  selectedTime: string;
  selectedTimes?: string[];
}

const SelectedTimeDisplay: React.FC<SelectedTimeDisplayProps> = ({ 
  selectedDate, 
  selectedTime,
  selectedTimes = []
}) => {
  const t = useTranslations('time');
  const { locale } = useLocale();

  const timesToDisplay = selectedTimes.length > 0 ? selectedTimes : (selectedTime ? [selectedTime] : []);
  
  if (!selectedDate || timesToDisplay.length === 0) return null;

  const localeCode = locale === 'zh-TW' ? 'zh-TW' : 'en-US';

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-2">{t('selectedSlot')}</h4>
      <div className="text-sm text-blue-700">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} />
          {new Date(selectedDate).toLocaleDateString(localeCode, { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            weekday: 'long'
          })}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <div className="flex flex-wrap gap-1">
            {timesToDisplay.sort().map((time, index) => (
              <span key={time}>
                {time}
                {index < timesToDisplay.length - 1 && '、'}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedTimeDisplay;
