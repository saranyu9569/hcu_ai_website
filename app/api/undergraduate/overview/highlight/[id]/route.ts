import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  await query(
    `UPDATE undergraduate_highlight SET title_en=?, title_th=?, description_en=?, description_th=? WHERE id=?`,
    [
      data.title_en ?? data.title,
      data.title_th ?? null,
      data.description_en ?? data.description,
      data.description_th ?? null,
      id
    ]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await query(`DELETE FROM undergraduate_highlight WHERE id=?`, [id]);
  return NextResponse.json({ success: true });
}