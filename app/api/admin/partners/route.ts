import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const rows = await query('SELECT * FROM partners ORDER BY id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logo, url, width, height, is_active } = body;
    const result = await query(
      'INSERT INTO partners (name, logo, url, width, height, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, logo, url, width, height, is_active]
    );
    return NextResponse.json({ id: (result as any).insertId, message: 'Partner created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
} 