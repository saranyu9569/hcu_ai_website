import { NextResponse } from 'next/server';
import { pool, query } from '@/lib/database';

// GET course by id (with CLOs)
export const revalidate = 60;

export async function GET(
  req: Request, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const courses: any = await query('SELECT * FROM courses WHERE id=?', [params.id]);
  
  if (!courses.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  const course = courses[0];
  const clos: any = await query('SELECT * FROM course_clos WHERE course_id=?', [params.id]);
  
  return NextResponse.json({ ...course, clos });
}

// PUT update course (and CLOs)
export async function PUT(
  req: Request, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const data = await req.json();
  
  await query(
    `UPDATE courses SET code=?, title_th=?, title_en=?, description_en=?, description_th=?, credits=?, category=?, \`group\`=?, prerequisites_en=?, prerequisites_th=? WHERE id=?`,
    [data.code, data.title_th, data.title_en, data.description_en, data.description_th, data.credits, data.category, data.group, data.prerequisites_en, data.prerequisites_th, params.id]
  );
  
  await query('DELETE FROM course_clos WHERE course_id=?', [params.id]);
  
  if (Array.isArray(data.clos)) {
    for (const clo of data.clos) {
      await query(
        `INSERT INTO course_clos (course_id, clo_en, clo_th) VALUES (?, ?, ?)`,
        [params.id, clo.clo_en, clo.clo_th]
      );
    }
  }
  
  return NextResponse.json({ success: true });
}

// DELETE course (and CLOs cascade)
export async function DELETE(
  req: Request, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  await query('DELETE FROM courses WHERE id=?', [params.id]);
  return NextResponse.json({ success: true });
}