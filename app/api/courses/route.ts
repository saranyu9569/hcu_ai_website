import { NextResponse } from 'next/server';
import { pool, query } from '@/lib/database';

// GET all courses (with CLOs)
export const revalidate = 60;

export async function GET() {
  const courses: any = await query('SELECT * FROM courses');
  const clos: any = await query('SELECT * FROM course_clos');
  const result = courses.map((course: any) => ({
    ...course,
    clos: clos.filter((clo: any) => clo.course_id === course.id)
  }));
  return NextResponse.json(result);
}

// POST create course (with CLOs)
export async function POST(req: Request) {
  const data = await req.json();
  const result: any = await query(
    `INSERT INTO courses (code, title_th, title_en, description_en, description_th, credits, category, \`group\`, prerequisites_en, prerequisites_th) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.code, data.title_th, data.title_en, data.description_en, data.description_th, data.credits, data.category, data.group, data.prerequisites_en, data.prerequisites_th]
  );
  const courseId = result.insertId;
  if (Array.isArray(data.clos)) {
    for (const clo of data.clos) {
      await query(
        `INSERT INTO course_clos (course_id, clo_en, clo_th) VALUES (?, ?, ?)` ,
        [courseId, clo.clo_en, clo.clo_th]
      );
    }
  }
  return NextResponse.json({ id: courseId, ...data });
} 