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

async function replaceEventTags(eventId: number, tagsStr: string) {
  await query('DELETE FROM event_tags WHERE event_id = ?', [eventId]);
  const tags = tagsStr ? tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
  for (const tag of tags) {
    await query('INSERT INTO event_tags (event_id, tag) VALUES (?, ?)', [eventId, tag]);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const rows = await query(`
      SELECT e.*,
        cc.name_en AS category,
        GROUP_CONCAT(et.tag ORDER BY et.id SEPARATOR ',') AS tags
      FROM events e
      LEFT JOIN content_categories cc ON e.category_id = cc.id
      LEFT JOIN event_tags et ON e.id = et.event_id
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

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const { title_th, title_en, content_th, content_en, category, tags, event_date, event_time, location, is_active } = body;

    const formattedDate = new Date(event_date).toISOString().split('T')[0];
    const categoryId = await getCategoryId(category);

    const result = await query(
      'INSERT INTO events (title_th, title_en, content_th, content_en, category_id, event_date, event_time, location, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title_th, title_en, content_th, content_en, categoryId, formattedDate, event_time, location, is_active]
    );

    const newId = (result as any).insertId;
    await replaceEventTags(newId, tags ?? '');

    return NextResponse.json({ id: newId, message: 'Event created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 