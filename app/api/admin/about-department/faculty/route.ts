import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

const safe = (v: any) => v === undefined ? null : v;

// GET - Fetch all faculty members
export async function GET(request: NextRequest) {
  try {
    const facultyRows = await query(
      'SELECT * FROM about_department_faculty ORDER BY sort_order ASC, id ASC'
    );

    const educationRows = await query(
      'SELECT * FROM about_department_faculty_education ORDER BY sort_order ASC, id ASC'
    );

    // Combine faculty with their education
    const facultyWithData = (facultyRows as any[]).map(faculty => ({
      ...faculty,
      education: (educationRows as any[]).filter(edu => edu.faculty_id === faculty.id)
    }));

    return NextResponse.json(facultyWithData);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch faculty data' },
      { status: 500 }
    );
  }
}

// POST - Create new faculty member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      about_department_id,
      name_th, name_en, role_th, role_en, email, phone,
      image, zoom, x, y, is_leadership, is_staff, sort_order
    } = body;

    const result = await query(
      `INSERT INTO about_department_faculty (
        about_department_id, name_th, name_en, role_th, role_en, email, phone,
        image, zoom, x, y, is_leadership, is_staff, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        safe(about_department_id), safe(name_th), safe(name_en), safe(role_th), safe(role_en),
        safe(email), safe(phone), safe(image), safe(zoom), safe(x), safe(y), safe(is_leadership), safe(is_staff), safe(sort_order) || 0
      ]
    );

    return NextResponse.json({
      id: (result as any).insertId,
      message: 'Faculty member created successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create faculty member' },
      { status: 500 }
    );
  }
}

// PUT - Update faculty member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name_th, name_en, role_th, role_en, email, phone,
      image, zoom, x, y, is_leadership, is_staff, sort_order
    } = body;

    await query(
      `UPDATE about_department_faculty SET
        name_th = ?, name_en = ?, role_th = ?, role_en = ?, email = ?, phone = ?,
        image = ?, zoom = ?, x = ?, y = ?, is_leadership = ?, is_staff = ?, sort_order = ?
      WHERE id = ?`,
      [
        safe(name_th), safe(name_en), safe(role_th), safe(role_en), safe(email), safe(phone),
        safe(image), safe(zoom), safe(x), safe(y), safe(is_leadership), safe(is_staff), safe(sort_order) || 0, id
      ]
    );

    return NextResponse.json({
      message: 'Faculty member updated successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update faculty member' },
      { status: 500 }
    );
  }
}

// DELETE - Delete faculty member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    // Delete faculty education (due to foreign key constraint)
    await query(
      'DELETE FROM about_department_faculty_education WHERE faculty_id = ?',
      [id]
    );

    // Delete faculty member
    await query(
      'DELETE FROM about_department_faculty WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Faculty member deleted successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete faculty member' },
      { status: 500 }
    );
  }
} 