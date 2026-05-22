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
      await query('UPDATE about_section SET is_active = FALSE WHERE id != ?', [id]);
    }
    await query(
      'UPDATE about_section SET title_th = ?, title_en = ?, description_th = ?, description_en = ?, learn_more_button_th = ?, learn_more_button_en = ?, view_button_th = ?, view_button_en = ?, member_details_th = ?, member_details_en = ?, cirriculum_th = ?, cirriculum_en = ?, student_project_th = ?, student_project_en = ?, research_project_th = ?, research_project_en = ?, is_active = ? WHERE id = ?',
      [title_th, title_en, description_th, description_en, learn_more_button_th, learn_more_button_en, view_button_th, view_button_en, member_details_th, member_details_en, cirriculum_th, cirriculum_en, student_project_th, student_project_en, research_project_th, research_project_en, is_active, id]
    );
    return NextResponse.json({ message: 'About section updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    await query('DELETE FROM about_section WHERE id = ?', [id]);
    return NextResponse.json({ message: 'About section deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete about section' }, { status: 500 });
  }
} 