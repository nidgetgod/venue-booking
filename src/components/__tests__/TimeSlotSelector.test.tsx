import React from 'react';
import { render, screen } from '@testing-library/react';
import TimeSlotSelector from '@/components/TimeSlotSelector';

describe('TimeSlotSelector', () => {
  const mockSetSelectedTime = jest.fn();
  const mockIsTimeSlotBooked = jest.fn();

  const defaultProps = {
    selectedDate: '2025-11-16',
    selectedTime: '',
    timeSlots: ['06:00-07:00', '07:00-08:00', '08:00-09:00'],
    isTimeSlotBooked: mockIsTimeSlotBooked,
    setSelectedTime: mockSetSelectedTime,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsTimeSlotBooked.mockReturnValue(false);
  });

  it('does not render when selectedDate is empty', () => {
    render(<TimeSlotSelector {...defaultProps} selectedDate="" />);
    expect(screen.queryByText('可用時段')).not.toBeInTheDocument();
  });

  it('renders all time slots', () => {
    render(<TimeSlotSelector {...defaultProps} />);
    expect(screen.getByText('06:00-07:00')).toBeInTheDocument();
    expect(screen.getByText('07:00-08:00')).toBeInTheDocument();
    expect(screen.getByText('08:00-09:00')).toBeInTheDocument();
  });

  it('shows today indicator for today date', () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    render(<TimeSlotSelector {...defaultProps} selectedDate={todayStr} />);
    expect(screen.getByText('today')).toBeInTheDocument();
  });

  it('shows weekday indicator for weekday', () => {
    render(<TimeSlotSelector {...defaultProps} selectedDate="2025-11-17" />);
    expect(screen.getByText('weekday')).toBeInTheDocument();
  });

  it('shows weekend indicator for weekend', () => {
    render(<TimeSlotSelector {...defaultProps} selectedDate="2025-11-16" />);
    expect(screen.getByText('weekend')).toBeInTheDocument();
  });

  it('disables booked time slots', () => {
    mockIsTimeSlotBooked.mockImplementation((date, time) => time === '06:00-07:00');
    render(<TimeSlotSelector {...defaultProps} />);
    const bookedSlot = screen.getByText('06:00-07:00').closest('button');
    expect(bookedSlot).toBeDisabled();
    expect(screen.getByText('booked')).toBeInTheDocument();
  });

  it('highlights selected time slot', () => {
    render(<TimeSlotSelector {...defaultProps} selectedTime="07:00-08:00" />);
    const selectedSlot = screen.getByText('07:00-08:00').closest('button');
    expect(selectedSlot).toHaveClass('bg-blue-600');
  });

  it('applies opacity to booked slots', () => {
    mockIsTimeSlotBooked.mockImplementation((date, time) => time === '06:00-07:00');
    render(<TimeSlotSelector {...defaultProps} />);
    const bookedSlot = screen.getByText('06:00-07:00').closest('button');
    expect(bookedSlot).toHaveClass('opacity-60');
  });
});
