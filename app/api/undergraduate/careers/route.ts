import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET() {
  try {
    const careerRows: any = await query(`
      SELECT *,
        name_en        AS name,
        description_en AS description,
        salary_en      AS salary
      FROM undergraduate_career
    `);
    const metricRows: any = await query('SELECT * FROM undergraduate_career_metric');

    const careers = careerRows.map((career: any) => {
      const metric = metricRows.find((m: any) => m.career_id === career.id);
      return {
        ...career,
        metrics: metric
          ? {
              'Technical Skills': metric.technical_skills,
              'Problem Solving': metric.problem_solving,
              'Communication': metric.communication,
              'Leadership': metric.leadership,
              'Research': metric.research,
              'Business Impact': metric.business_impact
            }
          : {}
      };
    });

    return NextResponse.json(careers);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const result: any = await query(
    `INSERT INTO undergraduate_career (name_en, description_en, salary_en, color, overview_id, name_th, description_th, salary_th) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name_en ?? data.name,
      data.description_en ?? data.description,
      data.salary_en ?? data.salary,
      data.color,
      data.overview_id,
      data.name_th,
      data.description_th,
      data.salary_th
    ]
  );
  return NextResponse.json({ id: result.insertId, ...data });
}