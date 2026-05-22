import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    const body = await request.json();
    const { name_th, name_en, href, sort_order, is_active } = body;
    await query(
      'UPDATE footer_links SET name_th = ?, name_en = ?, href = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name_th, name_en, href, sort_order, is_active, id]
    );
    return NextResponse.json({ message: 'Footer link updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update footer link' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    await query('DELETE FROM footer_links WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Footer link deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete footer link' }, { status: 500 });
  }
} 