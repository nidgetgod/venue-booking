import { useState, useMemo } from 'react';

export interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export const useCalendar = (selectedDate: string) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < new Date(todayYear, todayMonth, todayDate);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      days.push({
        date,
        dateStr,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isToday:
          date.getFullYear() === todayYear &&
          date.getMonth() === todayMonth &&
          date.getDate() === todayDate,
        isSelected: dateStr === selectedDate,
      });
    }

    return days;
  }, [currentMonth, selectedDate]);

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return {
    currentMonth,
    calendarDays,
    navigateMonth,
  };
};
