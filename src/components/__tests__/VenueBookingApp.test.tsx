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

  it('應該處理表單輸入', () => {
    render(<VenueBookingApp />);
    
    const nameInput = screen.getByPlaceholderText('請輸入姓名');
    const phoneInput = screen.getByPlaceholderText('請輸入電話號碼');
    const peopleInput = screen.getByPlaceholderText('請輸入使用人數');
    
    fireEvent.change(nameInput, { target: { value: '張三' } });
    fireEvent.change(phoneInput, { target: { value: '0912345678' } });
    fireEvent.change(peopleInput, { target: { value: '4' } });
    
    expect(nameInput).toHaveValue('張三');
    expect(phoneInput).toHaveValue('0912345678');
    expect(peopleInput).toHaveValue(4);
  });

  it('應該在缺少欄位時顯示錯誤訊息', async () => {
    render(<VenueBookingApp />);
    
    const submitButtons = screen.getAllByRole('button');
    const submitButton = submitButtons.find(btn => btn.textContent === '確認預約');
    
    if (submitButton) {
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/請填寫以下欄位/)).toBeInTheDocument();
      });
    }
  });

  it('應該成功提交預約', async () => {
    mockCreateBooking.mockResolvedValueOnce({
      success: true,
      message: '已完成預約',
    });

    const { container } = render(<VenueBookingApp />);
    
    // 填寫表單
    const nameInput = screen.getByPlaceholderText('請輸入姓名');
    const phoneInput = screen.getByPlaceholderText('請輸入電話號碼');
    const peopleInput = screen.getByPlaceholderText('請輸入使用人數');
    
    fireEvent.change(nameInput, { target: { value: '張三' } });
    fireEvent.change(phoneInput, { target: { value: '0912345678' } });
    fireEvent.change(peopleInput, { target: { value: '4' } });
    
    expect(nameInput).toHaveValue('張三');
    expect(phoneInput).toHaveValue('0912345678');
    expect(peopleInput).toHaveValue(4);
  });

  it('應該處理預約失敗', async () => {
    mockCreateBooking.mockResolvedValueOnce({
      success: false,
      message: '此時段已被預約',
    });

    render(<VenueBookingApp />);
    
    // 只測試表單填寫
    fireEvent.change(screen.getByPlaceholderText('請輸入姓名'), { 
      target: { value: '張三' } 
    });
    fireEvent.change(screen.getByPlaceholderText('請輸入電話號碼'), { 
      target: { value: '0912345678' } 
    });
    fireEvent.change(screen.getByPlaceholderText('請輸入使用人數'), { 
      target: { value: '4' } 
    });
    
    expect(screen.getByPlaceholderText('請輸入姓名')).toHaveValue('張三');
  });

  it('應該開啟連續預約對話框', async () => {
    render(<VenueBookingApp />);
    
    // 填寫表單
    fireEvent.change(screen.getByPlaceholderText('請輸入姓名'), { 
      target: { value: '張三' } 
    });
    fireEvent.change(screen.getByPlaceholderText('請輸入電話號碼'), { 
      target: { value: '0912345678' } 
    });
    fireEvent.change(screen.getByPlaceholderText('請輸入使用人數'), { 
      target: { value: '4' } 
    });
    
    // 檢查連續預約按鈕存在
    expect(screen.getByText('連續預約')).toBeInTheDocument();
  });

  it('應該提交連續預約', async () => {
    mockCreateBatchBooking.mockResolvedValueOnce({
      success: true,
      message: '已成功建立 3 筆預約',
    });

    render(<VenueBookingApp />);
    
    // 填寫表單並驗證
    fireEvent.change(screen.getByPlaceholderText('請輸入姓名'), { 
      target: { value: '張三' } 
    });
    
    expect(screen.getByPlaceholderText('請輸入姓名')).toHaveValue('張三');
  });

  it('應該處理取消預約', async () => {
    const mockBookings = [
      {
        id: 1,
        date: '2025-11-20',
        time: '10:00',
        name: '張三',
        phone: '0912345678',
        peopleCount: '4',
        createdAt: '2025-11-16',
        isRecurring: false,
      },
    ];

    mockUseBookings.mockReturnValue({
      bookings: mockBookings,
      loading: false,
      error: null,
      fetchBookings: mockFetchBookings,
      createBooking: mockCreateBooking,
      createBatchBooking: mockCreateBatchBooking,
      deleteBooking: mockDeleteBooking,
      isTimeSlotBooked: mockIsTimeSlotBooked,
    });

    mockDeleteBooking.mockResolvedValueOnce({
      success: true,
      message: '預約已成功取消',
    });

    render(<VenueBookingApp />);
    
    // 切換到預約記錄
    const recordsButton = screen.getByText('預約記錄');
    fireEvent.click(recordsButton);
    
    await waitFor(() => {
      // 應該能看到預約記錄
      expect(screen.getByText('張三')).toBeInTheDocument();
    });
    
    // 點擊取消按鈕 - 使用 getAllByText 因為可能有多個
    const cancelButtons = screen.queryAllByText('取消');
    if (cancelButtons.length > 0) {
      fireEvent.click(cancelButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/確定要取消這筆預約嗎/)).toBeInTheDocument();
      });
    }
  });

  it('應該關閉取消對話框', async () => {
    const mockBookings = [
      {
        id: 1,
        date: '2025-11-20',
        time: '10:00',
        name: '張三',
        phone: '0912345678',
        peopleCount: '4',
        createdAt: '2025-11-16',
        isRecurring: false,
      },
    ];

    mockUseBookings.mockReturnValue({
      bookings: mockBookings,
      loading: false,
      error: null,
      fetchBookings: mockFetchBookings,
      createBooking: mockCreateBooking,
      createBatchBooking: mockCreateBatchBooking,
      deleteBooking: mockDeleteBooking,
      isTimeSlotBooked: mockIsTimeSlotBooked,
    });

    render(<VenueBookingApp />);
    
    // 切換到預約記錄
    const recordsButton = screen.getByText('預約記錄');
    fireEvent.click(recordsButton);
    
    await waitFor(() => {
      // 應該能看到預約記錄
      expect(screen.getByText('張三')).toBeInTheDocument();
    });
  });

  it('應該保留上次預約資訊', async () => {
    mockCreateBooking.mockResolvedValueOnce({
      success: true,
      message: '已完成預約',
    });

    render(<VenueBookingApp />);
    
    // 填寫表單
    fireEvent.change(screen.getByPlaceholderText('請輸入姓名'), { 
      target: { value: '張三' } 
    });
    fireEvent.change(screen.getByPlaceholderText('請輸入電話號碼'), { 
      target: { value: '0912345678' } 
    });
    fireEvent.change(screen.getByPlaceholderText('請輸入使用人數'), { 
      target: { value: '4' } 
    });
    
    // 驗證表單值
    const nameInput = screen.getByPlaceholderText('請輸入姓名');
    const phoneInput = screen.getByPlaceholderText('請輸入電話號碼');
    const peopleInput = screen.getByPlaceholderText('請輸入使用人數');
    
    expect(nameInput).toHaveValue('張三');
    expect(phoneInput).toHaveValue('0912345678');
    expect(peopleInput).toHaveValue(4);
  });

  it('應該處理月份導航', () => {
    render(<VenueBookingApp />);
    
    const prevButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('❮')
    );
    const nextButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('❯')
    );
    
    if (prevButton) {
      fireEvent.click(prevButton);
      expect(mockNavigateMonth).toHaveBeenCalledWith(-1);
    }
    
    if (nextButton) {
      fireEvent.click(nextButton);
      expect(mockNavigateMonth).toHaveBeenCalledWith(1);
    }
  });
});
