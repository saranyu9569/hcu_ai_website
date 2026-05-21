import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(req: Request) {
  const data = await req.json();
  const result: any = await query(
    `INSERT INTO undergraduate_curriculum_subject (curriculum_year_id, subject_name_en, subject_name_th) VALUES (?, ?, ?)`,
    [
      data.curriculum_year_id,
      data.subject_name_en ?? data.subject_name,
      data.subject_name_th ?? null
    ]
  );
  return NextResponse.json({ id: result.insertId, ...data });
}