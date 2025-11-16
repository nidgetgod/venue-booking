import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecurringModal from '../RecurringModal';

describe('RecurringModal', () => {
  const mockSetRecurringWeeks = jest.fn();
  const mockIsTimeSlotBooked = jest.fn();
  const mockHandleBookingSubmit = jest.fn();
  const mockSetShowRecurringModal = jest.fn();

  const defaultProps = {
    showRecurringModal: true,
    selectedDate: '2025-11-20',
    selectedTime: '10:00',
    recurringWeeks: 4,
    setRecurringWeeks: mockSetRecurringWeeks,
    isTimeSlotBooked: mockIsTimeSlotBooked,
    handleBookingSubmit: mockHandleBookingSubmit,
    setShowRecurringModal: mockSetShowRecurringModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsTimeSlotBooked.mockReturnValue(false);
  });

  it('應該在 showRecurringModal 為 false 時不顯示', () => {
    const { container } = render(
      <RecurringModal {...defaultProps} showRecurringModal={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('應該顯示對話框標題和內容', () => {
    render(<RecurringModal {...defaultProps} />);
    
    expect(screen.getByText('連續預約設定')).toBeInTheDocument();
    expect(screen.getByText(/預約時段/)).toBeInTheDocument();
  });

  it('應該顯示當前選擇的週數', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={5} />);
    
    const weekDisplay = screen.getByText('5', { selector: '.text-2xl.font-bold.text-blue-600' });
    expect(weekDisplay).toBeInTheDocument();
    expect(screen.getByText(/總共/)).toBeInTheDocument();
  });

  it('應該能增加週數', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={4} />);
    
    const plusButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
    fireEvent.click(plusButton!);
    
    expect(mockSetRecurringWeeks).toHaveBeenCalledWith(5);
  });

  it('應該能減少週數', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={4} />);
    
    const minusButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    fireEvent.click(minusButton!);
    
    expect(mockSetRecurringWeeks).toHaveBeenCalledWith(3);
  });

  it('不應該減少週數到小於 1', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={1} />);
    
    const minusButton = screen.getAllByRole('button').find(btn => btn.textContent === '-');
    expect(minusButton).toBeDisabled();
  });

  it('不應該增加週數到大於 12', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={12} />);
    
    const plusButton = screen.getAllByRole('button').find(btn => btn.textContent === '+');
    expect(plusButton).toBeDisabled();
  });

  it('應該顯示預約日期預覽', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={2} />);
    
    expect(screen.getByText('預約日期預覽')).toBeInTheDocument();
    const availableSlots = screen.getAllByText('✓ 可預約');
    expect(availableSlots).toHaveLength(2);
  });

  it('應該顯示時段衝突', () => {
    mockIsTimeSlotBooked.mockImplementation((date: string) => {
      return date === '2025-11-27'; // 第二週衝突
    });

    render(<RecurringModal {...defaultProps} recurringWeeks={3} />);
    
    expect(screen.getByText('✗ 衝突')).toBeInTheDocument();
    const availableSlots = screen.getAllByText('✓ 可預約');
    expect(availableSlots).toHaveLength(2); // 只有兩個可用
  });

  it('應該呼叫關閉函數當點擊取消', () => {
    render(<RecurringModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('取消');
    fireEvent.click(cancelButton);
    
    expect(mockSetShowRecurringModal).toHaveBeenCalledWith(false);
  });

  it('應該呼叫預約提交函數當點擊確認', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={5} />);
    
    const confirmButton = screen.getByText('確認預約');
    fireEvent.click(confirmButton);
    
    expect(mockHandleBookingSubmit).toHaveBeenCalledWith(true, 5);
  });

  it('應該顯示正確的星期幾', () => {
    // 2025-11-20 是星期四
    render(<RecurringModal {...defaultProps} selectedDate="2025-11-20" />);
    
    expect(screen.getByText(/每週四/)).toBeInTheDocument();
  });

  it('應該顯示正確的月數估計', () => {
    render(<RecurringModal {...defaultProps} recurringWeeks={8} />);
    
    expect(screen.getByText(/2 個月/)).toBeInTheDocument();
  });

  it('應該正確顯示時段資訊', () => {
    render(<RecurringModal {...defaultProps} selectedTime="14:30" />);
    
    const timeElements = screen.getAllByText(/14:30/);
    expect(timeElements.length).toBeGreaterThan(0);
  });
});
