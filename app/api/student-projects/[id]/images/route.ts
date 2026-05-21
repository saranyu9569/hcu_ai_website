import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const rows = await query(
    'SELECT id, image_url, sort_order FROM student_project_images WHERE project_id = ? ORDER BY sort_order ASC, id ASC',
    [id]
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { image_url } = await req.json();
  if (!image_url) return NextResponse.json({ error: 'image_url required' }, { status: 400 });

  const result = await query(
    'INSERT INTO student_project_images (project_id, image_url) VALUES (?, ?)',
    [id, image_url]
  ) as any;
  return NextResponse.json({ id: result.insertId, image_url });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const imageId = new URL(req.url).searchParams.get('imageId');
  if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });

  await query(
    'DELETE FROM student_project_images WHERE id = ? AND project_id = ?',
    [imageId, id]
  );
  return NextResponse.json({ success: true });
}
