import { query } from '../db';
import { Pool } from 'pg';

// Mock pg module
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mPool),
  };
});

describe('Database Query Function', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPool: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get the mocked pool instance
    mockPool = new Pool();
  });

  it('應該成功執行查詢並返回結果', async () => {
    const mockResult = {
      rows: [{ id: 1, name: 'Test' }],
      rowCount: 1,
      command: 'SELECT',
      oid: 0,
      fields: [],
    };

    mockPool.query.mockResolvedValue(mockResult);

    const result = await query('SELECT * FROM bookings');

    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM bookings', undefined);
    expect(result).toEqual(mockResult);
  });

  it('應該支援帶參數的查詢', async () => {
    const mockResult = {
      rows: [{ id: 1, name: 'Test User' }],
      rowCount: 1,
      command: 'SELECT',
      oid: 0,
      fields: [],
    };

    mockPool.query.mockResolvedValue(mockResult);

    const result = await query(
      'SELECT * FROM bookings WHERE id = $1',
      ['1']
    );

    expect(mockPool.query).toHaveBeenCalledWith(
      'SELECT * FROM bookings WHERE id = $1',
      ['1']
    );
    expect(result).toEqual(mockResult);
  });

  it('應該處理空結果', async () => {
    const mockResult = {
      rows: [],
      rowCount: 0,
      command: 'SELECT',
      oid: 0,
      fields: [],
    };

    mockPool.query.mockResolvedValue(mockResult);

    const result = await query('SELECT * FROM bookings WHERE id = $1', ['999']);

    expect(result.rows).toHaveLength(0);
    expect(result.rowCount).toBe(0);
  });

  it('應該處理插入查詢', async () => {
    const mockResult = {
      rows: [{ id: 1, name: 'New Booking' }],
      rowCount: 1,
      command: 'INSERT',
      oid: 0,
      fields: [],
    };

    mockPool.query.mockResolvedValue(mockResult);

    const result = await query(
      'INSERT INTO bookings (name) VALUES ($1) RETURNING *',
      ['New Booking']
    );

    expect(mockPool.query).toHaveBeenCalled();
    expect(result.rows).toHaveLength(1);
  });

  it('應該處理更新查詢', async () => {
    const mockResult = {
      rows: [{ id: 1, name: 'Updated Booking' }],
      rowCount: 1,
      command: 'UPDATE',
      oid: 0,
      fields: [],
    };

    mockPool.query.mockResolvedValue(mockResult);

    const result = await query(
      'UPDATE bookings SET name = $1 WHERE id = $2 RETURNING *',
      ['Updated Booking', '1']
    );

    expect(result.rows[0].name).toBe('Updated Booking');
  });

  it('應該處理刪除查詢', async () => {
    const mockResult = {
      rows: [],
      rowCount: 1,
      command: 'DELETE',
      oid: 0,
      fields: [],
    };

    mockPool.query.mockResolvedValue(mockResult);

    const result = await query('DELETE FROM bookings WHERE id = $1', ['1']);

    expect(result.rowCount).toBe(1);
  });

  it('應該在查詢失敗時拋出錯誤', async () => {
    const error = new Error('Database connection failed');
    mockPool.query.mockRejectedValue(error);

    await expect(query('SELECT * FROM bookings')).rejects.toThrow(
      'Database connection failed'
    );
  });

  it('應該處理多個參數的查詢', async () => {
    const mockResult = {
      rows: [{ id: 1 }],
      rowCount: 1,
      command: 'SELECT',
      oid: 0,
      fields: [],
    };

    mockPool.query.mockResolvedValue(mockResult);

    await query(
      'SELECT * FROM bookings WHERE date = $1 AND time = $2 AND name = $3',
      ['2025-11-20', '10:00', 'Test User']
    );

    expect(mockPool.query).toHaveBeenCalledWith(
      'SELECT * FROM bookings WHERE date = $1 AND time = $2 AND name = $3',
      ['2025-11-20', '10:00', 'Test User']
    );
  });
});
