import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface NavigationHeaderProps {
  currentView: 'booking' | 'calendar';
  setCurrentView: (view: 'booking' | 'calendar') => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  setCurrentView,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="text-blue-600" />
        場地租借系統
      </h1>
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentView('booking')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            currentView === 'booking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Plus size={20} />
          預約租借
        </button>
        <button
          onClick={() => setCurrentView('calendar')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            currentView === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar size={20} />
          預約記錄
        </button>
      </div>
    </div>
  );
};

export default NavigationHeader;
