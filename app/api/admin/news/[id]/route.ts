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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    const body = await request.json();
    const { title_th, title_en, content_th, content_en, image_path, category, publish_date, is_active } = body;

    const formattedDate = new Date(publish_date).toISOString().split('T')[0];
    const categoryId = await getCategoryId(category);

    await query(
      'UPDATE news SET title_th = ?, title_en = ?, content_th = ?, content_en = ?, image_path = ?, category_id = ?, publish_date = ?, is_active = ? WHERE id = ?',
      [title_th, title_en, content_th, content_en, image_path, categoryId, formattedDate, is_active, id]
    );

    return NextResponse.json({ message: 'News updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    await query('DELETE FROM news WHERE id = ?', [id]);

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
} 