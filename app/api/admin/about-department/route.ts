import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all about department data for admin
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    // Get all about department records
    const aboutRows = await query(
      'SELECT * FROM about_department ORDER BY id DESC'
    );

    // Get all faculty members
    const facultyRows = await query(
      'SELECT * FROM about_department_faculty ORDER BY sort_order ASC, id ASC'
    );

    // Get all faculty education
    const educationRows = await query(
      'SELECT * FROM about_department_faculty_education ORDER BY sort_order ASC, id ASC'
    );

    // Get all facilities
    const facilityRows = await query(
      'SELECT * FROM about_department_facilities ORDER BY sort_order ASC, id ASC'
    );

    // Combine faculty with their education
    const facultyWithEducation = (facultyRows as any[]).map(faculty => ({
      ...faculty,
      education: (educationRows as any[]).filter(edu => edu.faculty_id === faculty.id)
    }));

    return NextResponse.json({
      about: aboutRows,
      faculty: facultyWithEducation,
      facilities: facilityRows
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about department data' },
      { status: 500 }
    );
  }
}

// POST - Create new about department record
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const {
      overview_title_th, overview_description_th, overview_title_en, overview_description_en,
      mission_title_th, mission_description_th, vision_title_th, vision_description_th,
      mission_title_en, mission_description_en, vision_title_en, vision_description_en,
      is_active
    } = body;

    // If setting as active, deactivate others
    if (is_active) {
      await query('UPDATE about_department SET is_active = FALSE');
    }

    const result = await query(
      `INSERT INTO about_department (
        overview_title_th, overview_description_th, overview_title_en, overview_description_en,
        mission_title_th, mission_description_th, vision_title_th, vision_description_th,
        mission_title_en, mission_description_en, vision_title_en, vision_description_en,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        overview_title_th, overview_description_th, overview_title_en, overview_description_en,
        mission_title_th, mission_description_th, vision_title_th, vision_description_th,
        mission_title_en, mission_description_en, vision_title_en, vision_description_en,
        is_active
      ]
    );

    return NextResponse.json({
      id: (result as any).insertId,
      message: 'About department created successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create about department' },
      { status: 500 }
    );
  }
}

// PUT - Update about department record
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const {
      id,
      overview_title_th, overview_description_th, overview_title_en, overview_description_en,
      mission_title_th, mission_description_th, vision_title_th, vision_description_th,
      mission_title_en, mission_description_en, vision_title_en, vision_description_en,
      is_active
    } = body;

    // If setting as active, deactivate others
    if (is_active) {
      await query('UPDATE about_department SET is_active = FALSE WHERE id != ?', [id]);
    }

    await query(
      `UPDATE about_department SET
        overview_title_th = ?, overview_description_th = ?, overview_title_en = ?, overview_description_en = ?,
        mission_title_th = ?, mission_description_th = ?, vision_title_th = ?, vision_description_th = ?,
        mission_title_en = ?, mission_description_en = ?, vision_title_en = ?, vision_description_en = ?,
        is_active = ?
      WHERE id = ?`,
      [
        overview_title_th, overview_description_th, overview_title_en, overview_description_en,
        mission_title_th, mission_description_th, vision_title_th, vision_description_th,
        mission_title_en, mission_description_en, vision_title_en, vision_description_en,
        is_active, id
      ]
    );

    return NextResponse.json({
      message: 'About department updated successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update about department' },
      { status: 500 }
    );
  }
} 