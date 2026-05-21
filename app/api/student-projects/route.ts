import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET() {
  const projects = await query(
    'SELECT * FROM student_projects WHERE is_active = TRUE ORDER BY year DESC, id DESC'
  ) as any[];

  if (!projects.length) return NextResponse.json([]);

  const ids = projects.map((p) => p.id);
  const placeholders = ids.map(() => '?').join(',');

  // Fetch all authors + advisors in 2 queries (parallel) instead of 2×N queries
  const [authors, advisors] = await Promise.all([
    query(`SELECT id, project_id, name_th, name_en FROM student_project_authors WHERE project_id IN (${placeholders}) ORDER BY sort_order`, ids),
    query(`SELECT id, project_id, name_th, name_en FROM student_project_advisors WHERE project_id IN (${placeholders}) ORDER BY sort_order`, ids),
  ]) as [any[], any[]];

  // Index by project_id for O(1) lookup
  const authorsByProject = new Map<number, any[]>();
  const advisorsByProject = new Map<number, any[]>();
  for (const a of authors) {
    if (!authorsByProject.has(a.project_id)) authorsByProject.set(a.project_id, []);
    authorsByProject.get(a.project_id)!.push(a);
  }
  for (const a of advisors) {
    if (!advisorsByProject.has(a.project_id)) advisorsByProject.set(a.project_id, []);
    advisorsByProject.get(a.project_id)!.push(a);
  }

  for (const project of projects) {
    project.authors  = authorsByProject.get(project.id)  ?? [];
    project.advisors = advisorsByProject.get(project.id) ?? [];
  }

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title_th, title_en, course, details_th, details_en, year, image, link, is_active, authors, advisors } = body;
  const result = await query(
    'INSERT INTO student_projects (title_th, title_en, course, details_th, details_en, year, image, link, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title_th, title_en, course, details_th, details_en, year, image, link, is_active ?? true]
  );
  const projectId = (result as any).insertId;
  // Insert authors
  if (Array.isArray(authors)) {
    for (const author of authors) {
      await query(
        'INSERT INTO student_project_authors (project_id, name_th, name_en) VALUES (?, ?, ?)',
        [projectId, author.name_th, author.name_en]
      );
    }
  }
  // Insert advisors
  if (Array.isArray(advisors)) {
    for (const advisor of advisors) {
      await query(
        'INSERT INTO student_project_advisors (project_id, name_th, name_en) VALUES (?, ?, ?)',
        [projectId, advisor.name_th, advisor.name_en]
      );
    }
  }
  return NextResponse.json({ id: projectId });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, title_th, title_en, course, details_th, details_en, year, image, link, is_active, authors, advisors } = body;
  await query(
    'UPDATE student_projects SET title_th=?, title_en=?, course=?, details_th=?, details_en=?, year=?, image=?, link=?, is_active=? WHERE id=?',
    [title_th, title_en, course, details_th, details_en, year, image, link, is_active ?? true, id]
  );
  // Remove old authors/advisors
  await query('DELETE FROM student_project_authors WHERE project_id=?', [id]);
  await query('DELETE FROM student_project_advisors WHERE project_id=?', [id]);
  // Insert new authors
  if (Array.isArray(authors)) {
    for (const author of authors) {
      await query(
        'INSERT INTO student_project_authors (project_id, name_th, name_en) VALUES (?, ?, ?)',
        [id, author.name_th, author.name_en]
      );
    }
  }
  // Insert new advisors
  if (Array.isArray(advisors)) {
    for (const advisor of advisors) {
      await query(
        'INSERT INTO student_project_advisors (project_id, name_th, name_en) VALUES (?, ?, ?)',
        [id, advisor.name_th, advisor.name_en]
      );
    }
  }
  return NextResponse.json({ message: 'Updated' });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query('DELETE FROM student_projects WHERE id=?', [id]);
  return NextResponse.json({ message: 'Deleted' });
} 