import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const rows = await query('SELECT * FROM quote ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title_th, title_en, description_th, description_en, button_th, button_en, is_active } = body;
    // ถ้า is_active = true ให้ set อันอื่นเป็น false
    if (is_active) {
      await query('UPDATE quote SET is_active = FALSE');
    }
    const result = await query(
      'INSERT INTO quote (title_th, title_en, description_th, description_en, button_th, button_en, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title_th, title_en, description_th, description_en, button_th, button_en, is_active]
    );
    return NextResponse.json({ id: (result as any).insertId, message: 'Quote created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
} 