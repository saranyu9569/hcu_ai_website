import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const rows = await query('SELECT * FROM footer_contact ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch footer contact' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value_th, value_en, sort_order, is_active } = body;
    const result = await query(
      'INSERT INTO footer_contact (type, value_th, value_en, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [type, value_th, value_en, sort_order, is_active]
    );
    return NextResponse.json({ id: (result as any).insertId, message: 'Footer contact created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create footer contact' }, { status: 500 });
  }
} 