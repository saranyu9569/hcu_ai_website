import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const rows = await query(`
      SELECT e.*,
        cc.name_en AS category,
        GROUP_CONCAT(et.tag ORDER BY et.id SEPARATOR ',') AS tags
      FROM events e
      LEFT JOIN content_categories cc ON e.category_id = cc.id
      LEFT JOIN event_tags et ON e.id = et.event_id
      WHERE e.is_active = TRUE
      GROUP BY e.id
      ORDER BY e.event_date DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 