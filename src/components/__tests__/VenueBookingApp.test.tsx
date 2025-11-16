import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VenueBookingApp from '../VenueBookingApp';
import { useBookings } from '@/hooks/useBookings';
import { useCalendar } from '@/hooks/useCalendar';

jest.mock('@/hooks/useBookings');
jest.mock('@/hooks/useCalendar');

const mockUseBookings = useBookings as jest.MockedFunction<typeof useBookings>;
const mockUseCalendar = useCalendar as jest.MockedFunction<typeof useCalendar>;

describe('VenueBookingApp', () => {
  const mockFetchBookings = jest.fn();
  const mockCreateBooking = jest.fn();
  const mockCreateBatchBooking = jest.fn();
  const mockDeleteBooking = jest.fn();
  const mockIsTimeSlotBooked = jest.fn();
  const mockNavigateMonth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBookings.mockReturnValue({
      bookings: [],
      loading: false,
      error: null,
      fetchBookings: mockFetchBookings,
      createBooking: mockCreateBooking,
      createBatchBooking: mockCreateBatchBooking,
      deleteBooking: mockDeleteBooking,
      isTimeSlotBooked: mockIsTimeSlotBooked,
    });

    mockUseCalendar.mockReturnValue({
      currentMonth: new Date('2025-11-01'),
      calendarDays: [
        { 
          dateStr: '2025-11-01', 
          day: 1, 
          date: new Date('2025-11-01'),
          isCurrentMonth: true, 
          isToday: false,
          isPast: false,
          isSelected: false,
        },
        { 
          dateStr: '2025-11-02', 
          day: 2, 
          date: new Date('2025-11-02'),
          isCurrentMonth: true, 
          isToday: false,
          isPast: false,
          isSelected: false,
        },
      ],
      navigateMonth: mockNavigateMonth,
    });

    mockIsTimeSlotBooked.mockReturnValue(false);
  });

  it('應該初始化並渲染預約視圖', () => {
    render(<VenueBookingApp />);
    
    expect(screen.getByText('預約租借')).toBeInTheDocument();
    expect(mockFetchBookings).toHaveBeenCalled();
  });

  it('應該切換到紀錄視圖', () => {
    render(<VenueBookingApp />);
    
    const recordsButton = screen.getByText('預約記錄');
    fireEvent.click(recordsButton);
    
    // 檢查是否能看到「暫無預約記錄」文字（因為bookings是空的）
    expect(screen.getByText('暫無預約記錄')).toBeInTheDocument();
  });

  it('應該渲染預約表單欄位', () => {
    render(<VenueBookingApp />);
    
    expect(screen.getByPlaceholderText('請輸入姓名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('請輸入電話號碼')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('請輸入使用人數')).toBeInTheDocument();
  });

  it('應該顯示連續預約按鈕', () => {
    render(<VenueBookingApp />);
    
    expect(screen.getByText('連續預約')).toBeInTheDocument();
  });

  it('應該渲染日曆', () => {
    render(<VenueBookingApp />);
    
    // 應該能看到月份顯示
    const monthDisplay = screen.getByText(/2025年11月/);
    expect(monthDisplay).toBeInTheDocument();
  });
});
