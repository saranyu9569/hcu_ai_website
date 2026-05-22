import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    const body = await request.json();
    const {
      title_th, title_en, description_th, description_en, image,
      event_name_th, event_name_en, event_date, event_time,
      event_location_th, event_location_en, registration_url, qr_code,
      topics, archiveImages, is_active
    } = body;
    if (is_active) {
      await query('UPDATE program_highlight SET is_active = FALSE WHERE id != ?', [id]);
    }
    await query(
      'UPDATE program_highlight SET title_th = ?, title_en = ?, description_th = ?, description_en = ?, image = ?, event_name_th = ?, event_name_en = ?, event_date = ?, event_time = ?, event_location_th = ?, event_location_en = ?, registration_url = ?, qr_code = ?, is_active = ? WHERE id = ?',
      [title_th, title_en, description_th, description_en, image, event_name_th, event_name_en, event_date, event_time, event_location_th, event_location_en, registration_url, qr_code, is_active, id]
    );
    // ลบ topic/archive เดิม แล้วเพิ่มใหม่
    await query('DELETE FROM program_highlight_topic WHERE program_highlight_id = ?', [id]);
    await query('DELETE FROM program_highlight_archive WHERE program_highlight_id = ?', [id]);
    if (Array.isArray(topics)) {
      for (const topic of topics) {
        await query(
          'INSERT INTO program_highlight_topic (program_highlight_id, topic_th, topic_en) VALUES (?, ?, ?)',
          [id, topic.topic_th, topic.topic_en]
        );
      }
    }
    if (Array.isArray(archiveImages)) {
      for (const img of archiveImages) {
        await query(
          'INSERT INTO program_highlight_archive (program_highlight_id, image) VALUES (?, ?)',
          [id, img]
        );
      }
    }
    return NextResponse.json({ message: 'Program highlight updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update program highlight' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    await query('DELETE FROM program_highlight WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Program highlight deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete program highlight' }, { status: 500 });
  }
} 