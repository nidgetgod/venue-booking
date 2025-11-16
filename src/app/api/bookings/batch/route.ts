import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST - 批次新增連續預約
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dates, time, name, phone, peopleCount } = body;

    const results = [];
    const conflicts = [];

    for (const date of dates) {
      // 檢查時段是否已被預約
      const checkResult = await query(
        'SELECT id FROM bookings WHERE date = $1 AND time = $2',
        [date, time]
      );

      if (checkResult.rows.length > 0) {
        conflicts.push(date);
        continue;
      }

      // 新增預約
      const result = await query(
        'INSERT INTO bookings (date, time, name, phone, people_count, is_recurring) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [date, time, name, phone, peopleCount, true]
      );
      results.push(result.rows[0]);
    }

    return NextResponse.json({
      success: results,
      conflicts: conflicts,
      message: `成功預約 ${results.length} 個時段${conflicts.length > 0 ? `，${conflicts.length} 個時段衝突` : ''}`
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create recurring bookings' },
      { status: 500 }
    );
  }
}
