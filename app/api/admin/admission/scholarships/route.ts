import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET all scholarships
export async function GET() {
  const rows = await query('SELECT * FROM admission_scholarships WHERE is_active = TRUE ORDER BY id ASC');
  return NextResponse.json(rows);
}

// POST create scholarship
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title_th, title_en, description_th, description_en, amount, is_active } = body;
  const result = await query(
    'INSERT INTO admission_scholarships (title_th, title_en, description_th, description_en, amount, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [title_th, title_en, description_th, description_en, amount, is_active ?? true]
  );
  return NextResponse.json({ id: (result as any).insertId });
}

// PUT update scholarship
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title_th, title_en, description_th, description_en, amount, is_active } = body;
  await query(
    'UPDATE admission_scholarships SET title_th=?, title_en=?, description_th=?, description_en=?, amount=?, is_active=? WHERE id=?',
    [title_th, title_en, description_th, description_en, amount, is_active ?? true, id]
  );
  return NextResponse.json({ message: 'Updated' });
}

// DELETE scholarship
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query('DELETE FROM admission_scholarships WHERE id=?', [id]);
  return NextResponse.json({ message: 'Deleted' });
} 