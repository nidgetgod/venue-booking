import { render, screen } from '@testing-library/react';
import RecordsView from '../RecordsView';

describe('RecordsView', () => {
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
  ];
  const mockCancelBooking = jest.fn();

  it('renders records view with title', () => {
    render(<RecordsView bookings={mockBookings} cancelBooking={mockCancelBooking} />);
    expect(screen.getByText('預約記錄')).toBeInTheDocument();
  });

  it('renders booking records component', () => {
    render(<RecordsView bookings={mockBookings} cancelBooking={mockCancelBooking} />);
    expect(screen.getByText('張三')).toBeInTheDocument();
  });

  it('renders empty state when no bookings', () => {
    render(<RecordsView bookings={[]} cancelBooking={mockCancelBooking} />);
    expect(screen.getByText('暫無預約記錄')).toBeInTheDocument();
  });
});
