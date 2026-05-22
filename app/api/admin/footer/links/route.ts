import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const rows = await query('SELECT * FROM footer_links ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch footer links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const { name_th, name_en, href, sort_order, is_active } = body;
    const result = await query(
      'INSERT INTO footer_links (name_th, name_en, href, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [name_th, name_en, href, sort_order, is_active]
    );
    return NextResponse.json({ id: (result as any).insertId, message: 'Footer link created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create footer link' }, { status: 500 });
  }
} 