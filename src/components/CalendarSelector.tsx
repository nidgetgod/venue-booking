import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface CalendarSelectorProps {
  currentMonth: Date;
  weekDays: string[];
  calendarDays: CalendarDay[];
  selectedDate: string;
  handleDateSelect: (dateStr: string) => void;
  navigateMonth: (direction: number) => void;
  hasAvailableSlots: (dateStr: string) => boolean;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  currentMonth,
  weekDays,
  calendarDays,
  selectedDate,
  handleDateSelect,
  navigateMonth,
  hasAvailableSlots,
}) => {
  return (
    <div>
      {/* 月份導航 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}
        </h3>
        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight size={20} />
        </button>
      </div>
      {/* 星期標題 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
        ))}
      </div>
      {/* 日曆格子 */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((day, index) => {
          const hasSlots = day.isCurrentMonth && !day.isPast && hasAvailableSlots(day.dateStr);
          const isSelectable = day.isCurrentMonth && !day.isPast;
          return (
            <button
              key={index}
              onClick={() => isSelectable && handleDateSelect(day.dateStr)}
              disabled={!isSelectable}
              className={`h-12 text-sm rounded-lg transition-all relative ${day.isCurrentMonth ? day.isPast ? 'text-gray-300 cursor-not-allowed' : hasSlots ? day.isSelected ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-green-100 border border-green-200' : 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-300'} ${day.isToday ? 'ring-2 ring-orange-400' : ''}`}
            >
              {day.day}
              {/* 可用時段指示器 */}
              {hasSlots && !day.isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarSelector;
