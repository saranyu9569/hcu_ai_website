import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { requireAuth } from '@/lib/auth';

// GET all tracks with requirements
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  const tracks = await query('SELECT * FROM admission_tracks WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC');
  const requirements = await query('SELECT * FROM admission_track_requirements ORDER BY sort_order ASC, id ASC');
  const result = (tracks as any[]).map(track => ({
    ...track,
    requirements: (requirements as any[]).filter(r => r.track_id === track.id)
  }));
  return NextResponse.json(result);
}

// POST create track (with requirements)
export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const body = await req.json();
  const { title_th, title_en, description_th, description_en, icon, link, sort_order, is_active, requirements } = body;
  const result = await query(
    'INSERT INTO admission_tracks (title_th, title_en, description_th, description_en, icon, link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title_th, title_en, description_th, description_en, icon, link, sort_order ?? 0, is_active ?? true]
  );
  const trackId = (result as any).insertId;
  if (Array.isArray(requirements)) {
    for (const [idx, req] of requirements.entries()) {
      await query(
        'INSERT INTO admission_track_requirements (track_id, requirement_th, requirement_en, sort_order) VALUES (?, ?, ?, ?)',
        [trackId, req.requirement_th, req.requirement_en, req.sort_order ?? idx]
      );
    }
  }
  return NextResponse.json({ id: trackId });
}

// PUT update track (and requirements)
export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const body = await req.json();
  const { id, title_th, title_en, description_th, description_en, icon, link, sort_order, is_active, requirements } = body;
  await query(
    'UPDATE admission_tracks SET title_th=?, title_en=?, description_th=?, description_en=?, icon=?, link=?, sort_order=?, is_active=? WHERE id=?',
    [title_th, title_en, description_th, description_en, icon, link, sort_order ?? 0, is_active ?? true, id]
  );
  await query('DELETE FROM admission_track_requirements WHERE track_id=?', [id]);
  if (Array.isArray(requirements)) {
    for (const [idx, req] of requirements.entries()) {
      await query(
        'INSERT INTO admission_track_requirements (track_id, requirement_th, requirement_en, sort_order) VALUES (?, ?, ?, ?)',
        [id, req.requirement_th, req.requirement_en, req.sort_order ?? idx]
      );
    }
  }
  return NextResponse.json({ message: 'Updated' });
}

// DELETE track (and requirements)
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query('DELETE FROM admission_tracks WHERE id=?', [id]);
  return NextResponse.json({ message: 'Deleted' });
}
