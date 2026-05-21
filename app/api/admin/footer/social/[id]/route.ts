import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { icon, href, sort_order, is_active } = body;
    await query(
      'UPDATE footer_social SET icon = ?, href = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [icon, href, sort_order, is_active, id]
    );
    return NextResponse.json({ message: 'Footer social updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update footer social' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query('DELETE FROM footer_social WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Footer social deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete footer social' }, { status: 500 });
  }
} 