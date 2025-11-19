import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingForm from '@/components/BookingForm';

describe('BookingForm', () => {
  const mockSetBookingForm = jest.fn();
  const mockSetLastBookingInfo = jest.fn();

  const defaultProps = {
    bookingForm: { name: '', phone: '', peopleCount: '' },
    lastBookingInfo: { name: '', phone: '', peopleCount: '' },
    setBookingForm: mockSetBookingForm,
    setLastBookingInfo: mockSetLastBookingInfo,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<BookingForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('namePlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('phonePlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('peopleCountPlaceholder')).toBeInTheDocument();
  });

  it('calls setBookingForm when name input changes', () => {
    render(<BookingForm {...defaultProps} />);
    const nameInput = screen.getByPlaceholderText('namePlaceholder');
    fireEvent.change(nameInput, { target: { value: '測試使用者' } });
    expect(mockSetBookingForm).toHaveBeenCalled();
  });

  it('calls setBookingForm when phone input changes', () => {
    render(<BookingForm {...defaultProps} />);
    const phoneInput = screen.getByPlaceholderText('phonePlaceholder');
    fireEvent.input(phoneInput, { target: { value: '0912345678' } });
    expect(mockSetBookingForm).toHaveBeenCalled();
  });

  it('calls setBookingForm when people count input changes', () => {
    render(<BookingForm {...defaultProps} />);
    const peopleInput = screen.getByPlaceholderText('peopleCountPlaceholder');
    fireEvent.change(peopleInput, { target: { value: '5' } });
    expect(mockSetBookingForm).toHaveBeenCalled();
  });

  it('shows auto-fill indicator when last booking info exists', () => {
    const propsWithLastInfo = {
      ...defaultProps,
      lastBookingInfo: { name: '測試', phone: '0912345678', peopleCount: '5' },
    };
    render(<BookingForm {...propsWithLastInfo} />);
    const indicators = screen.getAllByText(/useLastInfo/);
    expect(indicators.length).toBe(3);
  });
});
