import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface SelectedTimeDisplayProps {
  selectedDate: string;
  selectedTime: string;
}

const SelectedTimeDisplay: React.FC<SelectedTimeDisplayProps> = ({ selectedDate, selectedTime }) => {
  if (!selectedDate || !selectedTime) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-2">已選擇時段</h4>
      <div className="text-sm text-blue-700">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} />
          {new Date(selectedDate).toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            weekday: 'long'
          })}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          {selectedTime}
        </div>
      </div>
    </div>
  );
};

export default SelectedTimeDisplay;
