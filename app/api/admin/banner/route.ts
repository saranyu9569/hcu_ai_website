import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const rows = await query(
      'SELECT * FROM banner_slides ORDER BY sort_order ASC, id ASC'
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner slides' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const { title_th, title_en, description_th, description_en, image_path, cta_text_th, cta_text_en, cta_url, sort_order, is_active } = body;

    const result = await query(
      'INSERT INTO banner_slides (title_th, title_en, description_th, description_en, image_path, cta_text_th, cta_text_en, cta_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title_th, title_en, description_th, description_en, image_path, cta_text_th, cta_text_en, cta_url, sort_order || 0, is_active]
    );

    return NextResponse.json({ id: (result as any).insertId, message: 'Banner slide created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create banner slide' },
      { status: 500 }
    );
  }
} 