import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  await query(
    `UPDATE undergraduate_curriculum_year SET year_number=?, year_title_en=?, year_title_th=? WHERE id=?`,
    [
      data.year_number,
      data.year_title_en ?? data.year_title,
      data.year_title_th ?? null,
      id
    ]
  );

  return NextResponse.json({ success: true });
}