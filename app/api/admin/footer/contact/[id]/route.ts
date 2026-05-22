import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    const body = await request.json();
    const { type, value_th, value_en, sort_order, is_active } = body;
    await query(
      'UPDATE footer_contact SET type = ?, value_th = ?, value_en = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [type, value_th, value_en, sort_order, is_active, id]
    );
    return NextResponse.json({ message: 'Footer contact updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update footer contact' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { id } = await params;
    await query('DELETE FROM footer_contact WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Footer contact deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete footer contact' }, { status: 500 });
  }
} 