import { renderHook, act } from '@testing-library/react';
import { useCalendar } from '../useCalendar';

describe('useCalendar', () => {
  it('initializes with current month', () => {
    const { result } = renderHook(() => useCalendar('2025-11-20'));
    
    expect(result.current.currentMonth).toBeInstanceOf(Date);
    expect(result.current.calendarDays).toHaveLength(42); // 6 weeks × 7 days
  });

  it('generates correct calendar days', () => {
    const { result } = renderHook(() => useCalendar('2025-11-20'));
    
    const days = result.current.calendarDays;
    expect(days.every(day => day.date instanceof Date)).toBe(true);
    expect(days.every(day => typeof day.dateStr === 'string')).toBe(true);
  });

  it('marks selected date correctly', () => {
    const { result } = renderHook(() => useCalendar('2025-11-20'));
    
    const selectedDay = result.current.calendarDays.find(day => day.isSelected);
    expect(selectedDay?.dateStr).toBe('2025-11-20');
  });

  it('navigates to previous month', () => {
    const { result } = renderHook(() => useCalendar('2025-11-20'));
    const initialMonth = result.current.currentMonth.getMonth();
    
    act(() => {
      result.current.navigateMonth(-1);
    });
    
    const newMonth = result.current.currentMonth.getMonth();
    expect(newMonth).toBe((initialMonth - 1 + 12) % 12);
  });

  it('navigates to next month', () => {
    const { result } = renderHook(() => useCalendar('2025-11-20'));
    const initialMonth = result.current.currentMonth.getMonth();
    
    act(() => {
      result.current.navigateMonth(1);
    });
    
    const newMonth = result.current.currentMonth.getMonth();
    expect(newMonth).toBe((initialMonth + 1) % 12);
  });
});
