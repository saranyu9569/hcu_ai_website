import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const sections = await query('SELECT * FROM admission_section ORDER BY id ASC');
    // ดึง list/dates ทุก section
    for (const section of sections as any[]) {
      const lists = await query('SELECT * FROM admission_list WHERE section_id = ?', [section.id]);
      const dates = await query('SELECT * FROM admission_dates WHERE section_id = ?', [section.id]);
      section.lists = lists;
      section.dates = dates;
    }
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch admission sections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const {
      title_th, title_en, apply_button_th, apply_button_en,
      tuition_domestic, tuition_international, is_active,
      lists, dates
    } = body;
    if (is_active) {
      await query('UPDATE admission_section SET is_active = FALSE');
    }
    const result = await query(
      'INSERT INTO admission_section (title_th, title_en, apply_button_th, apply_button_en, tuition_domestic, tuition_international, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title_th, title_en, apply_button_th, apply_button_en, tuition_domestic, tuition_international, is_active]
    );
    const sectionId = (result as any).insertId;
    // Insert lists
    if (Array.isArray(lists)) {
      for (const item of lists) {
        await query(
          'INSERT INTO admission_list (section_id, group_key, label_th, label_en) VALUES (?, ?, ?, ?)',
          [sectionId, item.group_key, item.label_th, item.label_en]
        );
      }
    }
    // Insert dates
    if (Array.isArray(dates)) {
      for (const d of dates) {
        await query(
          'INSERT INTO admission_dates (section_id, semester_th, semester_en, deadline_th, deadline_en, notification_th, notification_en) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [sectionId, d.semester_th, d.semester_en, d.deadline_th, d.deadline_en, d.notification_th, d.notification_en]
        );
      }
    }
    return NextResponse.json({ id: sectionId, message: 'Admission section created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create admission section' }, { status: 500 });
  }
} 