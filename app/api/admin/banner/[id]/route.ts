import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title_th, title_en, description_th, description_en, image_path, cta_text_th, cta_text_en, cta_url, sort_order, is_active } = body;

    await query(
      'UPDATE banner_slides SET title_th = ?, title_en = ?, description_th = ?, description_en = ?, image_path = ?, cta_text_th = ?, cta_text_en = ?, cta_url = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [title_th, title_en, description_th, description_en, image_path, cta_text_th, cta_text_en, cta_url, sort_order || 0, is_active, id]
    );

    return NextResponse.json({ message: 'Banner slide updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update banner slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM banner_slides WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Banner slide deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner slide' },
      { status: 500 }
    );
  }
} 