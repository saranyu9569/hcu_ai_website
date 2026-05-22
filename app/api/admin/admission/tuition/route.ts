import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

// admission_tuition_fees was removed in normalization.
// Tuition data is now stored in admission_section.tuition_domestic and tuition_international.
// These endpoints proxy to admission_section for backward compatibility.

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  const rows = await query<any>(
    'SELECT id, tuition_domestic AS amount, tuition_international AS amount_en, is_active FROM admission_section WHERE is_active = TRUE ORDER BY id ASC'
  );
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const body = await req.json();
  const { id, tuition_domestic, tuition_international } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query(
    'UPDATE admission_section SET tuition_domestic = ?, tuition_international = ? WHERE id = ?',
    [tuition_domestic, tuition_international, id]
  );
  return NextResponse.json({ message: 'Updated' });
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Use POST /api/admin/admission to create an admission section with tuition data.' },
    { status: 405 }
  );
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    { error: 'Tuition fees cannot be deleted independently. Manage them via /api/admin/admission.' },
    { status: 405 }
  );
}
