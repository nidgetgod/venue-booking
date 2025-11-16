import { GET, POST } from '../route';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

jest.mock('@/lib/db');
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
      ok: !init?.status || init.status < 400,
    })),
  },
}));

describe('GET /api/bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該成功取得所有預約', async () => {
    const mockBookings = [
      {
        id: '1',
        date: '2025-11-20',
        time: '10:00',
        name: 'Test User',
        phone: '0912345678',
        peopleCount: 4,
        isRecurring: false,
        createdAt: new Date(),
      },
    ];

    (query as jest.Mock).mockResolvedValue({
      rows: mockBookings,
    });

    await GET();

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id')
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockBookings);
  });

  it('應該處理資料庫錯誤', async () => {
    (query as jest.Mock).mockRejectedValue(new Error('Database error'));

    await GET();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  });
});

describe('POST /api/bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該成功新增預約', async () => {
    const newBooking = {
      date: '2025-11-20',
      time: '10:00',
      name: 'Test User',
      phone: '0912345678',
      peopleCount: 4,
      isRecurring: false,
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(newBooking),
    } as unknown as Request;

    (query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] }) // 檢查時段
      .mockResolvedValueOnce({ rows: [{ id: '1', ...newBooking }] }); // 新增預約

    await POST(mockRequest);

    expect(query).toHaveBeenCalledTimes(2);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { id: '1', ...newBooking },
      { status: 201 }
    );
  });

  it('應該檢測時段衝突', async () => {
    const newBooking = {
      date: '2025-11-20',
      time: '10:00',
      name: 'Test User',
      phone: '0912345678',
      peopleCount: 4,
      isRecurring: false,
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(newBooking),
    } as unknown as Request;

    (query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: '1' }], // 時段已被預約
    });

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: '此時段已被預約' },
      { status: 409 }
    );
  });

  it('應該處理資料庫錯誤', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as Request;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  });
});
