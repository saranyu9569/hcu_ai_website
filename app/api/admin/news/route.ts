import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

async function getCategoryId(name: string): Promise<number | null> {
  if (!name) return null;
  const rows = await query<any>(
    'SELECT id FROM content_categories WHERE name_en = ? AND (type = "news" OR type = "both") LIMIT 1',
    [name]
  );
  if (rows.length) return rows[0].id;
  const result = await query<any>(
    'INSERT INTO content_categories (name_th, name_en, type) VALUES (?, ?, "news")',
    [name, name]
  );
  return (result as any).insertId;
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const rows = await query(`
      SELECT n.*, cc.name_en AS category
      FROM news n
      LEFT JOIN content_categories cc ON n.category_id = cc.id
      ORDER BY n.publish_date DESC
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

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const { title_th, title_en, content_th, content_en, image_path, category, publish_date, is_active } = body;

    const formattedDate = new Date(publish_date).toISOString().split('T')[0];
    const categoryId = await getCategoryId(category);

    const result = await query(
      'INSERT INTO news (title_th, title_en, content_th, content_en, image_path, category_id, publish_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title_th, title_en, content_th, content_en, image_path, categoryId, formattedDate, is_active]
    );

    return NextResponse.json({ id: (result as any).insertId, message: 'News created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
} 