import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET all important dates
export async function GET() {
  const rows = await query('SELECT * FROM admission_important_dates WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC');
  return NextResponse.json(rows);
}

// POST create important date
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { round_th, round_en, application_period_th, application_period_en, interview_date_th, interview_date_en, result_date_th, result_date_en, sort_order, is_active } = body;
  const result = await query(
    'INSERT INTO admission_important_dates (round_th, round_en, application_period_th, application_period_en, interview_date_th, interview_date_en, result_date_th, result_date_en, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [round_th, round_en, application_period_th, application_period_en, interview_date_th, interview_date_en, result_date_th, result_date_en, sort_order ?? 0, is_active ?? true]
  );
  return NextResponse.json({ id: (result as any).insertId });
}

// PUT update important date
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, round_th, round_en, application_period_th, application_period_en, interview_date_th, interview_date_en, result_date_th, result_date_en, sort_order, is_active } = body;
  await query(
    'UPDATE admission_important_dates SET round_th=?, round_en=?, application_period_th=?, application_period_en=?, interview_date_th=?, interview_date_en=?, result_date_th=?, result_date_en=?, sort_order=?, is_active=? WHERE id=?',
    [round_th, round_en, application_period_th, application_period_en, interview_date_th, interview_date_en, result_date_th, result_date_en, sort_order ?? 0, is_active ?? true, id]
  );
  return NextResponse.json({ message: 'Updated' });
}

// DELETE important date
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query('DELETE FROM admission_important_dates WHERE id=?', [id]);
  return NextResponse.json({ message: 'Deleted' });
} 