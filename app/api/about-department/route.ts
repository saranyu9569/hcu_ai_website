import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Get about department data
    const aboutRows = await query(
      'SELECT * FROM about_department WHERE is_active = TRUE ORDER BY id DESC LIMIT 1'
    );

    // Get faculty + education in one JOIN, and facilities in parallel
    const [facultyRows, facilitiesRows] = await Promise.all([
      query(`
        SELECT
          f.id, f.about_department_id, f.name_th, f.name_en, f.role_th, f.role_en,
          f.email, f.phone, f.image, f.is_leadership, f.is_staff, f.sort_order,
          f.is_active, f.zoom, f.x, f.y,
          e.id          AS edu_id,
          e.degree      AS edu_degree,
          e.program     AS edu_program,
          e.university  AS edu_university,
          e.sort_order  AS edu_sort_order
        FROM about_department_faculty f
        LEFT JOIN about_department_faculty_education e ON e.faculty_id = f.id
        WHERE f.is_active = TRUE
        ORDER BY f.sort_order ASC, f.id ASC, e.sort_order ASC, e.id ASC
      `),
      query('SELECT * FROM about_department_facilities WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC'),
    ]) as [any[], any[]];

    // Group education rows under each faculty (single pass, O(n))
    const facultyMap = new Map<number, any>();
    for (const row of facultyRows) {
      if (!facultyMap.has(row.id)) {
        const { edu_id, edu_degree, edu_program, edu_university, edu_sort_order, ...facultyData } = row;
        facultyMap.set(row.id, { ...facultyData, education: [] });
      }
      if (row.edu_id) {
        facultyMap.get(row.id).education.push({
          id: row.edu_id,
          degree: row.edu_degree,
          program: row.edu_program,
          university: row.edu_university,
          sort_order: row.edu_sort_order,
        });
      }
    }
    const facultyWithData = Array.from(facultyMap.values());

    return NextResponse.json({
      about: aboutRows,
      faculty: facultyWithData,
      facilities: facilitiesRows
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about department data' },
      { status: 500 }
    );
  }
} 