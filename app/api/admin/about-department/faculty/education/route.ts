import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

// GET - Fetch education for a faculty member
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { searchParams } = new URL(request.url);
    const facultyId = searchParams.get('facultyId');

    if (!facultyId) {
      return NextResponse.json(
        { error: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT * FROM about_department_faculty_education WHERE faculty_id = ? ORDER BY sort_order ASC, id ASC',
      [facultyId]
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

// POST - Create new education
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const {
      faculty_id,
      degree, program, university, sort_order
    } = body;

    const result = await query(
      `INSERT INTO about_department_faculty_education (
        faculty_id, degree, program, university, sort_order
      ) VALUES (?, ?, ?, ?, ?)`,
      [faculty_id, degree, program, university, sort_order || 0]
    );

    return NextResponse.json({
      id: (result as any).insertId,
      message: 'Education created successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    );
  }
}

// PUT - Update education
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const {
      id,
      degree, program, university, sort_order
    } = body;

    await query(
      `UPDATE about_department_faculty_education SET
        degree = ?, program = ?, university = ?, sort_order = ?
      WHERE id = ?`,
      [degree, program, university, sort_order || 0, id]
    );

    return NextResponse.json({
      message: 'Education updated successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update education' },
      { status: 500 }
    );
  }
}

// DELETE - Delete education
export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM about_department_faculty_education WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Education deleted successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    );
  }
} 