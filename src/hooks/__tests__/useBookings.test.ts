import { renderHook, act, waitFor } from '@testing-library/react';
import { useBookings } from '../useBookings';

// Mock fetch
global.fetch = jest.fn();

describe('useBookings', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('fetchBookings', () => {
    it('fetches bookings successfully', async () => {
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

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookings,
      });

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.fetchBookings();
      });

      await waitFor(() => {
        expect(result.current.bookings).toEqual(mockBookings);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('handles fetch error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.fetchBookings();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('讀取預約資料失敗');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('createBooking', () => {
    it('creates booking successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: '預約成功' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.createBooking({
          date: '2025-11-20',
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
          isRecurring: false,
        });
      });

      expect(response).toEqual({
        success: true,
        message: '已完成預約，可在預約紀錄裡查詢',
      });
    });

    it('handles create booking error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: '此時段已被預約' }),
      });

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.createBooking({
          date: '2025-11-20',
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
          isRecurring: false,
        });
      });

      expect(response).toEqual({
        success: false,
        message: '此時段已被預約',
      });
    });
  });

  describe('deleteBooking', () => {
    it('deletes booking successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: '取消成功' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.deleteBooking(1);
      });

      expect(response).toEqual({
        success: true,
        message: '預約已成功取消',
      });
    });

    it('handles delete booking error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.deleteBooking(1);
      });

      expect(response).toEqual({
        success: false,
        message: '取消預約失敗',
      });
    });

    it('handles network error when deleting booking', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.deleteBooking(1);
      });

      expect(response).toEqual({
        success: false,
        message: '取消預約失敗，請稍後再試',
      });
    });
  });

  describe('createBatchBooking', () => {
    it('creates batch booking successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: '已成功建立 3 筆預約' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.createBatchBooking({
          dates: ['2025-11-20', '2025-11-27', '2025-12-04'],
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
        });
      });

      expect(response).toEqual({
        success: true,
        message: '已成功建立 3 筆預約',
      });
    });

    it('handles batch booking error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: '部分時段已被預約' }),
      });

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.createBatchBooking({
          dates: ['2025-11-20', '2025-11-27'],
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
        });
      });

      expect(response).toEqual({
        success: false,
        message: '部分時段已被預約',
      });
    });

    it('handles network error when creating batch booking', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.createBatchBooking({
          dates: ['2025-11-20'],
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
        });
      });

      expect(response).toEqual({
        success: false,
        message: '預約失敗，請稍後再試',
      });
    });
  });

  describe('isTimeSlotBooked', () => {
    it('returns true when time slot is booked', () => {
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

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookings,
      });

      const { result } = renderHook(() => useBookings());

      act(() => {
        result.current.fetchBookings();
      });

      waitFor(() => {
        const isBooked = result.current.isTimeSlotBooked('2025-11-20', '10:00');
        expect(isBooked).toBe(true);
      });
    });

    it('returns false when time slot is available', () => {
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

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookings,
      });

      const { result } = renderHook(() => useBookings());

      act(() => {
        result.current.fetchBookings();
      });

      waitFor(() => {
        const isBooked = result.current.isTimeSlotBooked('2025-11-20', '14:00');
        expect(isBooked).toBe(false);
      });
    });

    it('handles date format with ISO string', () => {
      const mockBookings = [
        {
          id: 1,
          date: '2025-11-20T00:00:00.000Z',
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
          createdAt: '2025-11-16',
          isRecurring: false,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookings,
      });

      const { result } = renderHook(() => useBookings());

      act(() => {
        result.current.fetchBookings();
      });

      waitFor(() => {
        const isBooked = result.current.isTimeSlotBooked('2025-11-20', '10:00');
        expect(isBooked).toBe(true);
      });
    });
  });

  describe('error handling', () => {
    it('handles network error when fetching bookings', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBookings());

      await act(async () => {
        await result.current.fetchBookings();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('讀取預約資料失敗，請稍後再試');
        expect(result.current.loading).toBe(false);
      });

      consoleErrorSpy.mockRestore();
    });

    it('handles network error when creating booking', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useBookings());

      let response;
      await act(async () => {
        response = await result.current.createBooking({
          date: '2025-11-20',
          time: '10:00',
          name: '張三',
          phone: '0912345678',
          peopleCount: '4',
          isRecurring: false,
        });
      });

      expect(response).toEqual({
        success: false,
        message: '預約失敗，請稍後再試',
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
