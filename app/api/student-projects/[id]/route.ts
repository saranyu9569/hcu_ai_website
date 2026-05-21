import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const rows = await query(
    'SELECT * FROM student_projects WHERE id = ? LIMIT 1',
    [id]
  ) as any[];

  if (!rows.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const project = rows[0];

  const [authors, advisors, images] = await Promise.all([
    query(
      'SELECT name_th, name_en FROM student_project_authors WHERE project_id = ? ORDER BY sort_order',
      [id]
    ),
    query(
      'SELECT name_th, name_en FROM student_project_advisors WHERE project_id = ? ORDER BY sort_order',
      [id]
    ),
    query(
      'SELECT id, image_url FROM student_project_images WHERE project_id = ? ORDER BY sort_order ASC, id ASC',
      [id]
    ),
  ]) as [any[], any[], any[]];

  project.authors  = authors;
  project.advisors = advisors;
  project.images   = images;

  return NextResponse.json(project);
}
