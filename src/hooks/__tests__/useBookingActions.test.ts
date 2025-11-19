import { renderHook, act } from '@testing-library/react';
import { useBookingActions } from '../useBookingActions';

describe('useBookingActions', () => {
  const mockCreateBooking = jest.fn();
  const mockCreateBatchBooking = jest.fn();
  const mockDeleteBooking = jest.fn();

  const defaultOptions = {
    createBooking: mockCreateBooking,
    createBatchBooking: mockCreateBatchBooking,
    deleteBooking: mockDeleteBooking,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleBookingSubmit', () => {
    it('should show error when required fields are missing', async () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      const bookingForm = {
        name: '',
        phone: '',
        peopleCount: '',
      };

      let response;
      await act(async () => {
        response = await result.current.handleBookingSubmit(
          bookingForm,
          '',
          '',
          false,
          1
        );
      });

      expect(response).toEqual({
        success: false,
        shouldResetForm: false,
      });
      expect(result.current.dialogType).toBe('error');
      expect(result.current.dialogMessage).toContain('missingFields');
      expect(result.current.showDialog).toBe(true);
    });

    it('should create single booking successfully', async () => {
      mockCreateBooking.mockResolvedValueOnce({
        success: true,
        message: 'success',
      });

      const { result } = renderHook(() => useBookingActions(defaultOptions));

      const bookingForm = {
        name: '張三',
        phone: '0912345678',
        peopleCount: '4',
      };

      let response;
      await act(async () => {
        response = await result.current.handleBookingSubmit(
          bookingForm,
          '2025-11-20',
          '10:00',
          false,
          1
        );
      });

      expect(mockCreateBooking).toHaveBeenCalledWith({
        date: '2025-11-20',
        time: '10:00',
        name: '張三',
        phone: '0912345678',
        peopleCount: '4',
        isRecurring: false,
      });

      expect(response).toEqual({
        success: true,
        shouldResetForm: true,
      });
      expect(result.current.dialogType).toBe('success');
      expect(result.current.dialogMessage).toBe('success');
      expect(result.current.showDialog).toBe(true);
      expect(result.current.showRecurringModal).toBe(false);
    });

    it('should create recurring booking successfully', async () => {
      mockCreateBatchBooking.mockResolvedValueOnce({
        success: true,
        message: '已成功建立 3 筆預約',
      });

      const { result } = renderHook(() => useBookingActions(defaultOptions));

      const bookingForm = {
        name: '張三',
        phone: '0912345678',
        peopleCount: '4',
      };

      let response;
      await act(async () => {
        response = await result.current.handleBookingSubmit(
          bookingForm,
          '2025-11-20',
          '10:00',
          true,
          3
        );
      });

      expect(mockCreateBatchBooking).toHaveBeenCalledWith(
        expect.objectContaining({
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
        })
      );

      expect(response).toEqual({
        success: true,
        shouldResetForm: true,
      });
      expect(result.current.dialogType).toBe('success');
      expect(result.current.showRecurringModal).toBe(false);
    });

    it('should handle booking failure', async () => {
      mockCreateBooking.mockResolvedValueOnce({
        success: false,
        message: '此時段已被預約',
      });

      const { result } = renderHook(() => useBookingActions(defaultOptions));

      const bookingForm = {
        name: '張三',
        phone: '0912345678',
        peopleCount: '4',
      };

      let response;
      await act(async () => {
        response = await result.current.handleBookingSubmit(
          bookingForm,
          '2025-11-20',
          '10:00',
          false,
          1
        );
      });

      expect(response).toEqual({
        success: false,
        shouldResetForm: false,
      });
      expect(result.current.dialogType).toBe('error');
      expect(result.current.dialogMessage).toBe('此時段已被預約');
    });
  });

  describe('handleRecurringClick', () => {
    it('should show error when fields are missing', () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      const bookingForm = {
        name: '',
        phone: '',
        peopleCount: '',
      };

      let response;
      act(() => {
        response = result.current.handleRecurringClick(bookingForm, '', '');
      });

      expect(response).toBe(false);
      expect(result.current.dialogType).toBe('error');
      expect(result.current.showDialog).toBe(true);
      expect(result.current.showRecurringModal).toBe(false);
    });

    it('should open recurring modal when all fields are filled', () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      const bookingForm = {
        name: '張三',
        phone: '0912345678',
        peopleCount: '4',
      };

      let response;
      act(() => {
        response = result.current.handleRecurringClick(
          bookingForm,
          '2025-11-20',
          '10:00'
        );
      });

      expect(response).toBe(true);
      expect(result.current.showRecurringModal).toBe(true);
    });
  });

  describe('cancelBooking', () => {
    it('should set booking to cancel and show dialog', () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      act(() => {
        result.current.cancelBooking(123);
      });

      expect(result.current.bookingToCancel).toBe(123);
      expect(result.current.showCancelDialog).toBe(true);
    });
  });

  describe('confirmCancelBooking', () => {
    it('should delete booking successfully', async () => {
      mockDeleteBooking.mockResolvedValueOnce({
        success: true,
        message: '預約已取消',
      });

      const { result } = renderHook(() => useBookingActions(defaultOptions));

      // First set booking to cancel
      act(() => {
        result.current.cancelBooking(123);
      });

      let response;
      await act(async () => {
        response = await result.current.confirmCancelBooking();
      });

      expect(mockDeleteBooking).toHaveBeenCalledWith(123);
      expect(response).toBe(true);
      expect(result.current.dialogType).toBe('success');
      expect(result.current.dialogMessage).toBe('預約已取消');
      expect(result.current.showCancelDialog).toBe(false);
      expect(result.current.bookingToCancel).toBeNull();
    });

    it('should handle deletion failure', async () => {
      mockDeleteBooking.mockResolvedValueOnce({
        success: false,
        message: '取消失敗',
      });

      const { result } = renderHook(() => useBookingActions(defaultOptions));

      act(() => {
        result.current.cancelBooking(123);
      });

      let response;
      await act(async () => {
        response = await result.current.confirmCancelBooking();
      });

      expect(response).toBe(false);
      expect(result.current.dialogType).toBe('error');
      expect(result.current.dialogMessage).toBe('取消失敗');
    });

    it('should return false when no booking to cancel', async () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.confirmCancelBooking();
      });

      expect(response).toBe(false);
      expect(mockDeleteBooking).not.toHaveBeenCalled();
    });
  });

  describe('dialog state management', () => {
    it('should manage dialog visibility', () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      expect(result.current.showDialog).toBe(false);

      act(() => {
        result.current.setShowDialog(true);
      });

      expect(result.current.showDialog).toBe(true);
    });

    it('should manage cancel dialog visibility', () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      expect(result.current.showCancelDialog).toBe(false);

      act(() => {
        result.current.setShowCancelDialog(true);
      });

      expect(result.current.showCancelDialog).toBe(true);
    });

    it('should manage recurring modal visibility', () => {
      const { result } = renderHook(() => useBookingActions(defaultOptions));

      expect(result.current.showRecurringModal).toBe(false);

      act(() => {
        result.current.setShowRecurringModal(true);
      });

      expect(result.current.showRecurringModal).toBe(true);
    });
  });
});
