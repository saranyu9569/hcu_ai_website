import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const highlights = await query('SELECT * FROM program_highlight ORDER BY id ASC');
    const topics = await query('SELECT * FROM program_highlight_topic');
    const archives = await query('SELECT * FROM program_highlight_archive');
    const result = Array.isArray(highlights) ? highlights.map((h: any) => ({
      ...h,
      topics: (Array.isArray(topics) ? topics.filter((t: any) => t.program_highlight_id === h.id) : []),
      archiveImages: (Array.isArray(archives) ? archives.filter((a: any) => a.program_highlight_id === h.id) : [])
    })) : [];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch program highlights' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title_th, title_en, description_th, description_en, image,
      event_name_th, event_name_en, event_date, event_time,
      event_location_th, event_location_en, registration_url, qr_code,
      topics, archiveImages, is_active
    } = body;
    if (is_active) {
      await query('UPDATE program_highlight SET is_active = FALSE');
    }
    const result = await query(
      'INSERT INTO program_highlight (title_th, title_en, description_th, description_en, image, event_name_th, event_name_en, event_date, event_time, event_location_th, event_location_en, registration_url, qr_code, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title_th, title_en, description_th, description_en, image, event_name_th, event_name_en, event_date, event_time, event_location_th, event_location_en, registration_url, qr_code, is_active]
    );
    const highlightId = (result as any).insertId;
    // Insert topics
    if (Array.isArray(topics)) {
      for (const topic of topics) {
        await query(
          'INSERT INTO program_highlight_topic (program_highlight_id, topic_th, topic_en) VALUES (?, ?, ?)',
          [highlightId, topic.topic_th, topic.topic_en]
        );
      }
    }
    // Insert archive images
    if (Array.isArray(archiveImages)) {
      for (const img of archiveImages) {
        await query(
          'INSERT INTO program_highlight_archive (program_highlight_id, image) VALUES (?, ?)',
          [highlightId, img]
        );
      }
    }
    return NextResponse.json({ id: highlightId, message: 'Program highlight created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create program highlight' }, { status: 500 });
  }
} 