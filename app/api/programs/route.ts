import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import type { ResultSetHeader } from 'mysql2';

// GET: List all programs
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const rows = await query('SELECT * FROM programs ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch programs', details: error }, { status: 500 });
  }
}

// POST: Create a new program
export async function POST(req: NextRequest) {
  try {
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
    const now = new Date();
    const result: any = await query(
      `INSERT INTO programs (type, name_th, name_en, description_th, description_en, benefits_th, benefits_en, start_date, end_date, how_to_apply_th, how_to_apply_en, apply_link, image, course_file, video_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, name_th, name_en, description_th, description_en, benefits_th, benefits_en, start_date, end_date, how_to_apply_th, how_to_apply_en, apply_link, image, course_file, video_url ?? null, now, now]
    );
    const insertId = result.insertId;
    return NextResponse.json({ id: insertId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create program', details: error }, { status: 500 });
  }
} 