import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const rows = await query('SELECT * FROM about_section ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch about section' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title_th, title_en, description_th, description_en,
      learn_more_button_th, learn_more_button_en,
      view_button_th, view_button_en,
      member_details_th, member_details_en,
      cirriculum_th, cirriculum_en,
      student_project_th, student_project_en,
      research_project_th, research_project_en,
      is_active
    } = body;
    // ถ้า is_active = true ให้ set อันอื่นเป็น false
    if (is_active) {
      await query('UPDATE about_section SET is_active = FALSE');
    }
    const result = await query(
      'INSERT INTO about_section (title_th, title_en, description_th, description_en, learn_more_button_th, learn_more_button_en, view_button_th, view_button_en, member_details_th, member_details_en, cirriculum_th, cirriculum_en, student_project_th, student_project_en, research_project_th, research_project_en, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title_th, title_en, description_th, description_en, learn_more_button_th, learn_more_button_en, view_button_th, view_button_en, member_details_th, member_details_en, cirriculum_th, cirriculum_en, student_project_th, student_project_en, research_project_th, research_project_en, is_active]
    );
    return NextResponse.json({ id: (result as any).insertId, message: 'About section created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create about section' }, { status: 500 });
  }
} 