import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET() {
  try {
    const overviewRows: any = await query(`
      SELECT *,
        program_title_en   AS program_title,
        program_description_en AS program_description,
        duration_en        AS duration,
        credits_en         AS credits,
        degree_en          AS degree,
        class_size_en      AS class_size,
        overview_heading_en AS overview_heading
      FROM undergraduate_overview LIMIT 1
    `);
    if (!overviewRows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const overview = overviewRows[0];

    const highlightRows: any = await query(
      'SELECT id, title_en AS title, title_th, description_en AS description, description_th, icon FROM undergraduate_highlight WHERE overview_id = ?',
      [overview.id]
    );

    return NextResponse.json({ ...overview, highlights: highlightRows });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const rows: any = await query('SELECT id FROM undergraduate_overview LIMIT 1');
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const id = rows[0].id;

    await query(
      `UPDATE undergraduate_overview
       SET overview_heading_en=?, program_title_en=?, program_description_en=?,
           duration_en=?, credits_en=?, degree_en=?, class_size_en=?, lab_image=?,
           overview_heading_th=?, program_title_th=?, program_description_th=?,
           duration_th=?, credits_th=?, degree_th=?, class_size_th=?
       WHERE id=?`,
      [
        data.overview_heading_en ?? data.overview_heading,
        data.program_title_en    ?? data.program_title,
        data.program_description_en ?? data.program_description,
        data.duration_en   ?? data.duration,
        data.credits_en    ?? data.credits,
        data.degree_en     ?? data.degree,
        data.class_size_en ?? data.class_size,
        data.lab_image,
        data.overview_heading_th,
        data.program_title_th,
        data.program_description_th,
        data.duration_th,
        data.credits_th,
        data.degree_th,
        data.class_size_th,
        id
      ]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}