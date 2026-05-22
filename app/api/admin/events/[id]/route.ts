import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

async function getCategoryId(name: string): Promise<number | null> {
  if (!name) return null;
  const rows = await query<any>(
    'SELECT id FROM content_categories WHERE name_en = ? AND (type = "event" OR type = "both") LIMIT 1',
    [name]
  );
  if (rows.length) return rows[0].id;
  const result = await query<any>(
    'INSERT INTO content_categories (name_th, name_en, type) VALUES (?, ?, "event")',
    [name, name]
  );
  return (result as any).insertId;
}

async function replaceEventTags(eventId: string, tagsStr: string) {
  await query('DELETE FROM event_tags WHERE event_id = ?', [eventId]);
  const tags = tagsStr ? tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  for (const tag of tags) {
    await query('INSERT INTO event_tags (event_id, tag) VALUES (?, ?)', [eventId, tag]);
  }
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
    const { title_th, title_en, content_th, content_en, category, tags, event_date, event_time, location, is_active } = body;

    const formattedDate = new Date(event_date).toISOString().split('T')[0];
    const categoryId = await getCategoryId(category);

    await query(
      'UPDATE events SET title_th = ?, title_en = ?, content_th = ?, content_en = ?, category_id = ?, event_date = ?, event_time = ?, location = ?, is_active = ? WHERE id = ?',
      [title_th, title_en, content_th, content_en, categoryId, formattedDate, event_time, location, is_active, id]
    );

    await replaceEventTags(id, tags ?? '');

    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
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
    await query('DELETE FROM events WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 