import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const links = await query('SELECT * FROM footer_links WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC');
    const social = await query('SELECT * FROM footer_social WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC');
    const contact = await query('SELECT * FROM footer_contact WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ links, social, contact });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch footer' }, { status: 500 });
  }
} 