import { DELETE } from '../route';
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

describe('DELETE /api/bookings/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該成功刪除預約', async () => {
    const mockRequest = {} as Request;
    const mockParams = { params: Promise.resolve({ id: '1' }) };

    (query as jest.Mock).mockResolvedValue({
      rows: [{ id: '1', name: 'Test User' }],
    });

    await DELETE(mockRequest, mockParams);

    expect(query).toHaveBeenCalledWith(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      ['1']
    );
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: 'Booking deleted successfully',
    });
  });

  it('應該處理預約不存在的情況', async () => {
    const mockRequest = {} as Request;
    const mockParams = { params: Promise.resolve({ id: '999' }) };

    (query as jest.Mock).mockResolvedValue({
      rows: [],
    });

    await DELETE(mockRequest, mockParams);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Booking not found' },
      { status: 404 }
    );
  });

  it('應該處理資料庫錯誤', async () => {
    const mockRequest = {} as Request;
    const mockParams = { params: Promise.resolve({ id: '1' }) };

    (query as jest.Mock).mockRejectedValue(new Error('Database error'));

    await DELETE(mockRequest, mockParams);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  });
});
