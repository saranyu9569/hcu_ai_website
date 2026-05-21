import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import type { ResultSetHeader } from 'mysql2';

// GET: Get program by id
export const revalidate = 60;

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM programs WHERE id = ?', [id]);
    
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    }
    
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch program', details: error }, { status: 500 });
  }
}

// PUT: Update program by id
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const {
      type,
      name_th,
      name_en,
      description_th,
      description_en,
      benefits_th,
      benefits_en,
      start_date,
      end_date,
      how_to_apply_th,
      how_to_apply_en,
      apply_link,
      image,
      course_file,
      video_url,
    } = data;

    const result = await query(
      `UPDATE programs SET type=?, name_th=?, name_en=?, description_th=?, description_en=?, benefits_th=?, benefits_en=?, start_date=?, end_date=?, how_to_apply_th=?, how_to_apply_en=?, apply_link=?, image=?, course_file=?, video_url=? WHERE id=?`,
      [type, name_th, name_en, description_th, description_en, benefits_th, benefits_en, start_date, end_date, how_to_apply_th, how_to_apply_en, apply_link, image, course_file, video_url ?? null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update program', details: error }, { status: 500 });
  }
}

// DELETE: Delete program by id
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('DELETE FROM programs WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete program', details: error }, { status: 500 });
  }
}