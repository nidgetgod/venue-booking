import { POST } from '../route';
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

describe('POST /api/bookings/batch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該成功批次新增預約', async () => {
    const batchBooking = {
      dates: ['2025-11-20', '2025-11-27', '2025-12-04'],
      time: '10:00',
      name: 'Test User',
      phone: '0912345678',
      peopleCount: 4,
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(batchBooking),
    } as unknown as Request;

    // Mock 所有日期都可用
    (query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: '1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: '2' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: '3' }] });

    await POST(mockRequest);

    expect(query).toHaveBeenCalledTimes(6); // 3 次檢查 + 3 次新增
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: expect.arrayContaining([
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '2' }),
          expect.objectContaining({ id: '3' }),
        ]),
        conflicts: [],
        successCount: 3,
        conflictCount: 0,
      }),
      { status: 201 }
    );
  });

  it('應該處理部分時段衝突', async () => {
    const batchBooking = {
      dates: ['2025-11-20', '2025-11-27', '2025-12-04'],
      time: '10:00',
      name: 'Test User',
      phone: '0912345678',
      peopleCount: 4,
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(batchBooking),
    } as unknown as Request;

    // 第二個日期衝突
    (query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: '1' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'existing' }] }) // 衝突
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: '3' }] });

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: expect.arrayContaining([
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '3' }),
        ]),
        conflicts: ['2025-11-27'],
        successCount: 2,
        conflictCount: 1,
      }),
      { status: 201 }
    );
  });

  it('應該處理所有時段都衝突', async () => {
    const batchBooking = {
      dates: ['2025-11-20', '2025-11-27'],
      time: '10:00',
      name: 'Test User',
      phone: '0912345678',
      peopleCount: 4,
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(batchBooking),
    } as unknown as Request;

    // 所有日期都衝突
    (query as jest.Mock)
      .mockResolvedValue({ rows: [{ id: 'existing' }] });

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: [],
        conflicts: ['2025-11-20', '2025-11-27'],
        successCount: 0,
        conflictCount: 2,
      }),
      { status: 201 }
    );
  });

  it('應該處理資料庫錯誤', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as Request;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to create recurring bookings' },
      { status: 500 }
    );
  });
});
