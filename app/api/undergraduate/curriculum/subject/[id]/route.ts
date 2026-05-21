import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  await query(
    `UPDATE undergraduate_curriculum_subject SET subject_name_en=?, subject_name_th=? WHERE id=?`,
    [
      data.subject_name_en ?? data.subject_name,
      data.subject_name_th ?? null,
      id
    ]
  );

  return NextResponse.json({ success: true });
}