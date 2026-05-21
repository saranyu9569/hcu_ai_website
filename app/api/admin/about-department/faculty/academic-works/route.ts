import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - Fetch academic works for a faculty member
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const facultyId = searchParams.get('facultyId');

    if (!facultyId) {
      return NextResponse.json(
        { error: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT * FROM about_department_faculty_academic_works WHERE faculty_id = ? ORDER BY sort_order ASC, year DESC, id ASC',
      [facultyId]
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch academic works' },
      { status: 500 }
    );
  }
}

// POST - Create new academic work
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      faculty_id,
      title_th, title_en, description_th, description_en, year, sort_order
    } = body;

    const result = await query(
      `INSERT INTO about_department_faculty_academic_works (
        faculty_id, title_th, title_en, description_th, description_en, year, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [faculty_id, title_th, title_en, description_th, description_en, year, sort_order || 0]
    );

    return NextResponse.json({
      id: (result as any).insertId,
      message: 'Academic work created successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create academic work' },
      { status: 500 }
    );
  }
}

// PUT - Update academic work
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title_th, title_en, description_th, description_en, year, sort_order
    } = body;

    await query(
      `UPDATE about_department_faculty_academic_works SET
        title_th = ?, title_en = ?, description_th = ?, description_en = ?, year = ?, sort_order = ?
      WHERE id = ?`,
      [title_th, title_en, description_th, description_en, year, sort_order || 0, id]
    );

    return NextResponse.json({
      message: 'Academic work updated successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update academic work' },
      { status: 500 }
    );
  }
}

// DELETE - Delete academic work
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Academic work ID is required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM about_department_faculty_academic_works WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Academic work deleted successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete academic work' },
      { status: 500 }
    );
  }
} 