import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - 取得所有預約
export async function GET() {
  try {
    const result = await query(
      'SELECT id, TO_CHAR(date, \'YYYY-MM-DD\') as date, time, name, phone, people_count as "peopleCount", is_recurring as "isRecurring", created_at as "createdAt" FROM bookings ORDER BY date, time'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - 新增預約
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, time, name, phone, peopleCount, isRecurring } = body;

    // 檢查時段是否已被預約
    const checkResult = await query(
      'SELECT id FROM bookings WHERE date = $1 AND time = $2',
      [date, time]
    );

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: '此時段已被預約' },
        { status: 409 }
      );
    }

    // 新增預約
    const result = await query(
      'INSERT INTO bookings (date, time, name, phone, people_count, is_recurring) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [date, time, name, phone, peopleCount, isRecurring]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
