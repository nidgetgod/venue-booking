import { render, screen, fireEvent } from '@testing-library/react';
import CalendarSelector from '../CalendarSelector';

describe('CalendarSelector', () => {
  const mockCurrentMonth = new Date('2025-11-20');
  const mockWeekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const mockCalendarDays = [
    {
      date: new Date('2025-11-20'),
      dateStr: '2025-11-20',
      day: 20,
      isCurrentMonth: true,
      isPast: false,
      isToday: true,
      isSelected: true,
    },
  ];
  const mockHandleDateSelect = jest.fn();
  const mockNavigateMonth = jest.fn();
  const mockHasAvailableSlots = jest.fn(() => true);

  beforeEach(() => {
    mockHandleDateSelect.mockClear();
    mockNavigateMonth.mockClear();
    mockHasAvailableSlots.mockClear();
  });

  it('renders calendar with month navigation', () => {
    render(
      <CalendarSelector
        currentMonth={mockCurrentMonth}
        weekDays={mockWeekDays}
        calendarDays={mockCalendarDays}
        handleDateSelect={mockHandleDateSelect}
        navigateMonth={mockNavigateMonth}
        hasAvailableSlots={mockHasAvailableSlots}
      />
    );
    expect(screen.getByText('2025年11月')).toBeInTheDocument();
  });

  it('navigates to previous month', () => {
    render(
      <CalendarSelector
        currentMonth={mockCurrentMonth}
        weekDays={mockWeekDays}
        calendarDays={mockCalendarDays}
        handleDateSelect={mockHandleDateSelect}
        navigateMonth={mockNavigateMonth}
        hasAvailableSlots={mockHasAvailableSlots}
      />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // First button should be previous month
    expect(mockNavigateMonth).toHaveBeenCalledWith(-1);
  });

  it('navigates to next month', () => {
    render(
      <CalendarSelector
        currentMonth={mockCurrentMonth}
        weekDays={mockWeekDays}
        calendarDays={mockCalendarDays}
        handleDateSelect={mockHandleDateSelect}
        navigateMonth={mockNavigateMonth}
        hasAvailableSlots={mockHasAvailableSlots}
      />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // Second button should be next month
    expect(mockNavigateMonth).toHaveBeenCalledWith(1);
  });

  it('displays weekday headers', () => {
    render(
      <CalendarSelector
        currentMonth={mockCurrentMonth}
        weekDays={mockWeekDays}
        calendarDays={mockCalendarDays}
        handleDateSelect={mockHandleDateSelect}
        navigateMonth={mockNavigateMonth}
        hasAvailableSlots={mockHasAvailableSlots}
      />
    );
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('一')).toBeInTheDocument();
    expect(screen.getByText('六')).toBeInTheDocument();
  });
});
