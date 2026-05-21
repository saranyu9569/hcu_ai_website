import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const rows = await query(`
      SELECT
        n.id,
        n.title_th,
        n.title_en,
        n.content_th,
        n.content_en,
        n.image_path,
        cc.name_en AS category,
        n.category_id,
        n.publish_date,
        n.is_active
      FROM news n
      LEFT JOIN content_categories cc ON n.category_id = cc.id
      WHERE n.id = ? AND n.is_active = TRUE
      LIMIT 1
    `, [id]);

    if (!rows.length) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
