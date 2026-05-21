import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const data = await req.json();

  await query(
    `UPDATE undergraduate_career SET name_en=?, description_en=?, salary_en=?, color=?, name_th=?, description_th=?, salary_th=? WHERE id=?`,
    [
      data.name_en ?? data.name,
      data.description_en ?? data.description,
      data.salary_en ?? data.salary,
      data.color,
      data.name_th,
      data.description_th,
      data.salary_th,
      params.id
    ]
  );

  return NextResponse.json({ success: true });
}