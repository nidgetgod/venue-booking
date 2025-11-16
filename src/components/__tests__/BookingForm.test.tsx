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
    expect(screen.getByPlaceholderText('請輸入姓名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('請輸入電話號碼')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('請輸入使用人數')).toBeInTheDocument();
  });

  it('calls setBookingForm when name input changes', () => {
    render(<BookingForm {...defaultProps} />);
    const nameInput = screen.getByPlaceholderText('請輸入姓名');
    fireEvent.change(nameInput, { target: { value: '測試使用者' } });
    expect(mockSetBookingForm).toHaveBeenCalled();
  });

  it('calls setBookingForm when phone input changes', () => {
    render(<BookingForm {...defaultProps} />);
    const phoneInput = screen.getByPlaceholderText('請輸入電話號碼');
    fireEvent.change(phoneInput, { target: { value: '0912345678' } });
    expect(mockSetBookingForm).toHaveBeenCalled();
  });

  it('calls setBookingForm when people count input changes', () => {
    render(<BookingForm {...defaultProps} />);
    const peopleInput = screen.getByPlaceholderText('請輸入使用人數');
    fireEvent.change(peopleInput, { target: { value: '5' } });
    expect(mockSetBookingForm).toHaveBeenCalled();
  });

  it('shows auto-fill indicator when last booking info exists', () => {
    const propsWithLastInfo = {
      ...defaultProps,
      lastBookingInfo: { name: '測試', phone: '0912345678', peopleCount: '5' },
    };
    render(<BookingForm {...propsWithLastInfo} />);
    const indicators = screen.getAllByText('✓ 自動帶入上次資料');
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('shows clear button when last booking info exists', () => {
    const propsWithLastInfo = {
      ...defaultProps,
      lastBookingInfo: { name: '測試', phone: '0912345678', peopleCount: '5' },
    };
    render(<BookingForm {...propsWithLastInfo} />);
    expect(screen.getByText('清除自動填入資料')).toBeInTheDocument();
  });

  it('clears form and last booking info when clear button clicked', () => {
    const propsWithLastInfo = {
      ...defaultProps,
      lastBookingInfo: { name: '測試', phone: '0912345678', peopleCount: '5' },
    };
    render(<BookingForm {...propsWithLastInfo} />);
    const clearButton = screen.getByText('清除自動填入資料');
    fireEvent.click(clearButton);
    expect(mockSetBookingForm).toHaveBeenCalledWith({ name: '', phone: '', peopleCount: '' });
    expect(mockSetLastBookingInfo).toHaveBeenCalledWith({ name: '', phone: '', peopleCount: '' });
  });
});
