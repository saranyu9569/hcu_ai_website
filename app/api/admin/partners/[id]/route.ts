import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, logo, url, width, height, is_active } = body;
    await query(
      'UPDATE partners SET name = ?, logo = ?, url = ?, width = ?, height = ?, is_active = ? WHERE id = ?',
      [name, logo, url, width, height, is_active, id]
    );
    return NextResponse.json({ message: 'Partner updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query('DELETE FROM partners WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
} 