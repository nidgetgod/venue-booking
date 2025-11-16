import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedTime: string;
  timeSlots: string[];
  isTimeSlotBooked: (date: string, time: string) => boolean;
  setSelectedTime: (time: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  selectedTime,
  timeSlots,
  isTimeSlotBooked,
  setSelectedTime,
}) => {
  if (!selectedDate) return null;

  const today = new Date();
  const isToday = selectedDate === `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const date = new Date(selectedDate);
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <div>
      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Clock size={18} />
        可用時段 - {new Date(selectedDate).toLocaleDateString('zh-TW', { 
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit', 
          weekday: 'short' 
        })}
        {isToday && (
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">今天</span>
        )}
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {isWeekend ? '假日 6:00-18:00' : '平日 6:00-21:00'}
        </span>
      </h4>
      
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {timeSlots.map(time => {
          const isBooked = isTimeSlotBooked(selectedDate, time);
          const isSelected = selectedTime === time;
          
          return (
            <button
              key={time}
              onClick={() => !isBooked && setSelectedTime(time)}
              disabled={isBooked}
              className={`p-3 text-sm rounded-lg border transition-all ${
                isBooked 
                  ? 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed opacity-60' 
                  : isSelected 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              {time}
              {isBooked && <div className="text-xs mt-1">已預約</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
