import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const rows = await query('SELECT * FROM footer_social ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch footer social' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, href, sort_order, is_active } = body;
    const result = await query(
      'INSERT INTO footer_social (icon, href, sort_order, is_active) VALUES (?, ?, ?, ?)',
      [icon, href, sort_order, is_active]
    );
    return NextResponse.json({ id: (result as any).insertId, message: 'Footer social created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create footer social' }, { status: 500 });
  }
} 