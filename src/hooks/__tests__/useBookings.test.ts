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
        expect(result.current.error).toBe('fetchError');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('createBooking', () => {
    it('creates booking successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'success' }),
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
        message: 'bookingSuccess',
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
          json: async () => ({ message: 'cancelSuccess' }),
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
        message: 'cancelSuccess',
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
        message: 'cancelFailed',
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
        message: 'cancelError',
      });
    });
  });

  describe('createBatchBooking', () => {
    it('creates batch booking successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'batchBookingSuccess' }),
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
        message: 'batchBookingSuccess',
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
        message: 'bookingError',
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
        expect(result.current.error).toBe('fetchErrorRetry');
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
        message: 'bookingError',
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
