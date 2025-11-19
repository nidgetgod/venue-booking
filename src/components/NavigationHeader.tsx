'use client';

import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

interface NavigationHeaderProps {
  currentView: 'booking' | 'calendar';
  setCurrentView: (view: 'booking' | 'calendar') => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  setCurrentView,
}) => {
  const t = useTranslations('nav');

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="text-blue-600" />
          {t('title')}
        </h1>
        <LanguageSwitcher />
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentView('booking')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
            currentView === 'booking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Plus size={20} />
          {t('booking')}
        </button>
        <button
          onClick={() => setCurrentView('calendar')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
            currentView === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar size={20} />
          {t('records')}
        </button>
      </div>
    </div>
  );
};

export default NavigationHeader;
