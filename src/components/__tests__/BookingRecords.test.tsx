import { render, screen } from '@testing-library/react';
import BookingRecords from '../BookingRecords';

describe('BookingRecords', () => {
  const mockBookings = [
    {
      id: 1,
      date: '2025-11-20',
      time: '10:00',
      name: '張三',
      phone: '0912345678',
      peopleCount: '4',
      createdAt: '2025-11-16T00:00:00Z',
      isRecurring: false,
    },
    {
      id: 2,
      date: '2025-11-21',
      time: '14:00',
      name: '李四',
      phone: '0923456789',
      peopleCount: '6',
      createdAt: '2025-11-16T00:00:00Z',
      isRecurring: true,
    },
  ];
  const mockCancelBooking = jest.fn();

  beforeEach(() => {
    mockCancelBooking.mockClear();
  });

  it('renders bookings list', () => {
    render(<BookingRecords bookings={mockBookings} cancelBooking={mockCancelBooking} />);
    expect(screen.getByText('張三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText(/0912345678/)).toBeInTheDocument();
  });

  it('renders empty state when no bookings', () => {
    render(<BookingRecords bookings={[]} cancelBooking={mockCancelBooking} />);
    expect(screen.getByText('暫無預約記錄')).toBeInTheDocument();
  });

  it('has cancel buttons for each booking', () => {
    render(<BookingRecords bookings={mockBookings} cancelBooking={mockCancelBooking} />);
    const cancelButtons = screen.getAllByRole('button');
    expect(cancelButtons.length).toBeGreaterThan(0);
  });
});
