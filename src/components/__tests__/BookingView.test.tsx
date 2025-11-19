import { render, screen } from '@testing-library/react';
import BookingView from '../BookingView';

describe('BookingView', () => {
  const mockProps = {
    bookingForm: { name: '', phone: '', peopleCount: '' },
    lastBookingInfo: { name: '', phone: '', peopleCount: '' },
    setBookingForm: jest.fn(),
    setLastBookingInfo: jest.fn(),
    selectedDate: '2025-11-20',
    selectedTime: '',
    selectedTimes: [],
    setSelectedTimes: jest.fn(),
    currentMonth: new Date('2025-11-20'),
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [
      {
        date: new Date('2025-11-20'),
        dateStr: '2025-11-20',
        day: 20,
        isCurrentMonth: true,
        isPast: false,
        isToday: true,
        isSelected: true,
      },
    ],
    handleDateSelect: jest.fn(),
    navigateMonth: jest.fn(),
    hasAvailableSlots: jest.fn(() => true),
    timeSlots: ['06:00', '07:00', '08:00'],
    isTimeSlotBooked: jest.fn(() => false),
    setSelectedTime: jest.fn(),
    handleBookingSubmit: jest.fn(),
    handleRecurringClick: jest.fn(),
  };

  it('renders booking form section', () => {
    render(<BookingView {...mockProps} />);
    expect(screen.getByText('userInfo')).toBeInTheDocument();
  });

  it('renders calendar selector', () => {
    render(<BookingView {...mockProps} />);
    expect(screen.getByText('2025年11月')).toBeInTheDocument();
  });

  it('renders date and time selection heading', () => {
    render(<BookingView {...mockProps} />);
    expect(screen.getByText('selectDateTime')).toBeInTheDocument();
  });

  it('renders venue announcement', () => {
    render(<BookingView {...mockProps} />);
    expect(screen.getByText(/title/)).toBeInTheDocument();
  });
});
