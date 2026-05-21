import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(req: Request) {
  const data = await req.json();
  const result: any = await query(
    `INSERT INTO undergraduate_highlight (overview_id, title_en, title_th, description_en, description_th, icon) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.overview_id,
      data.title_en ?? data.title,
      data.title_th ?? null,
      data.description_en ?? data.description,
      data.description_th ?? null,
      data.icon ?? 'CheckCircle'
    ]
  );

  return NextResponse.json({ success: true, id: result.insertId });
}