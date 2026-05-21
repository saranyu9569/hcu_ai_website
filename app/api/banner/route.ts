import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const rows = await query(
      'SELECT * FROM banner_slides WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC'
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner slides' },
      { status: 500 }
    );
  }
} 