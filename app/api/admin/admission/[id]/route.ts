import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title_th, title_en, apply_button_th, apply_button_en,
      tuition_domestic, tuition_international, is_active,
      lists, dates
    } = body;
    if (is_active) {
      await query('UPDATE admission_section SET is_active = FALSE WHERE id != ?', [id]);
    }
    await query(
      'UPDATE admission_section SET title_th = ?, title_en = ?, apply_button_th = ?, apply_button_en = ?, tuition_domestic = ?, tuition_international = ?, is_active = ? WHERE id = ?',
      [title_th, title_en, apply_button_th, apply_button_en, tuition_domestic, tuition_international, is_active, id]
    );

    await query('DELETE FROM admission_list WHERE section_id = ?', [id]);
    await query('DELETE FROM admission_dates WHERE section_id = ?', [id]);
    if (Array.isArray(lists)) {
      for (const item of lists) {
        await query(
          'INSERT INTO admission_list (section_id, group_key, label_th, label_en) VALUES (?, ?, ?, ?)',
          [id, item.group_key, item.label_th, item.label_en]
        );
      }
    }
    if (Array.isArray(dates)) {
      for (const d of dates) {
        await query(
          'INSERT INTO admission_dates (section_id, semester_th, semester_en, deadline_th, deadline_en, notification_th, notification_en) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id, d.semester_th, d.semester_en, d.deadline_th, d.deadline_en, d.notification_th, d.notification_en]
        );
      }
    }
    return NextResponse.json({ message: 'Admission section updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update admission section' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query('DELETE FROM admission_section WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Admission section deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete admission section' }, { status: 500 });
  }
} 