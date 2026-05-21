import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET() {
  try {
    const yearRows: any = await query(`
      SELECT *,
        year_title_en AS year_title
      FROM undergraduate_curriculum_year
      ORDER BY year_number ASC
    `);

    const subjectRows: any = await query(`
      SELECT *,
        subject_name_en AS subject_name
      FROM undergraduate_curriculum_subject
    `);

    const curriculum = yearRows.map((year: any) => ({
      ...year,
      subjects: subjectRows
        .filter((subj: any) => subj.curriculum_year_id === year.id)
        .map((subj: any) => ({
          id: subj.id,
          subject_name: subj.subject_name,
          subject_name_en: subj.subject_name_en,
          subject_name_th: subj.subject_name_th
        }))
    }));

    return NextResponse.json(curriculum);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
