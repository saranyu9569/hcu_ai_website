import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title_th, title_en, description_th, description_en, button_th, button_en, is_active } = body;
    // ถ้า is_active = true ให้ set อันอื่นเป็น false
    if (is_active) {
      await query('UPDATE quote SET is_active = FALSE WHERE id != ?', [id]);
    }
    await query(
      'UPDATE quote SET title_th = ?, title_en = ?, description_th = ?, description_en = ?, button_th = ?, button_en = ?, is_active = ? WHERE id = ?',
      [title_th, title_en, description_th, description_en, button_th, button_en, is_active, id]
    );
    return NextResponse.json({ message: 'Quote updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query('DELETE FROM quote WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
} 