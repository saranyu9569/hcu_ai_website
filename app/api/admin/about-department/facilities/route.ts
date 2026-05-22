import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all facilities
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const rows = await query(
      'SELECT * FROM about_department_facilities ORDER BY sort_order ASC, id ASC'
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch facilities' },
      { status: 500 }
    );
  }
}

// POST - Create new facility
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const {
      about_department_id,
      name_th, name_en, description_th, description_en, image, sort_order
    } = body;

    const result = await query(
      `INSERT INTO about_department_facilities (
        about_department_id, name_th, name_en, description_th, description_en, image, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        about_department_id, name_th, name_en, description_th, description_en, image, sort_order || 0
      ]
    );

    return NextResponse.json({
      id: (result as any).insertId,
      message: 'Facility created successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create facility' },
      { status: 500 }
    );
  }
}

// PUT - Update facility
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const {
      id,
      name_th, name_en, description_th, description_en, image, sort_order
    } = body;

    await query(
      `UPDATE about_department_facilities SET
        name_th = ?, name_en = ?, description_th = ?, description_en = ?, image = ?, sort_order = ?
      WHERE id = ?`,
      [
        name_th, name_en, description_th, description_en, image, sort_order || 0, id
      ]
    );

    return NextResponse.json({
      message: 'Facility updated successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update facility' },
      { status: 500 }
    );
  }
}

// DELETE - Delete facility
export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Facility ID is required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM about_department_facilities WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      message: 'Facility deleted successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete facility' },
      { status: 500 }
    );
  }
} 