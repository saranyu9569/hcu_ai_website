import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const rows = await query(`
      SELECT
        n.id,
        n.title_th,
        n.title_en,
        SUBSTRING(n.content_th, 1, 200) AS content_th,
        SUBSTRING(n.content_en, 1, 200) AS content_en,
        n.image_path,
        cc.name_en AS category,
        n.category_id,
        n.publish_date,
        n.is_active
      FROM news n
      LEFT JOIN content_categories cc ON n.category_id = cc.id
      WHERE n.is_active = TRUE
      ORDER BY n.publish_date DESC
      LIMIT 100
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}