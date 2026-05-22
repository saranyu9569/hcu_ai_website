import { NextRequest, NextResponse } from 'next/server';
import { pool, query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

// PUT - Update navbar menu item
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();
    const { title_th, title_en, url, parent_id, order_index, is_dropdown, is_active } = body;

    await query(`
      UPDATE navbar_menu
      SET title_th = ?, title_en = ?, url = ?, parent_id = ?,
          order_index = ?, is_dropdown = ?, is_active = ?
      WHERE id = ?
    `, [title_th, title_en, url, parent_id, order_index, is_dropdown, is_active, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update navbar item:', error);
    return NextResponse.json({ error: 'Failed to update navbar item' }, { status: 500 });
  }
}

// DELETE - Delete navbar menu item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const params = await context.params;
    const id = parseInt(params.id);

    // Check if item has children
    const children = await query(
      'SELECT COUNT(*) as count FROM navbar_menu WHERE parent_id = ?',
      [id]
    );

    if ((children as any[])[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete item with children. Delete children first.' },
        { status: 400 }
      );
    }

    await query('DELETE FROM navbar_menu WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete navbar item:', error);
    return NextResponse.json({ error: 'Failed to delete navbar item' }, { status: 500 });
  }
}