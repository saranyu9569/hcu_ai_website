import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

async function attachRelations(publications: any[]) {
  if (!publications.length) return;
  const ids = publications.map((p: any) => p.id);
  const placeholders = ids.map(() => '?').join(',');

  const [authors, keywords] = await Promise.all([
    query(`SELECT * FROM publication_authors  WHERE publication_id IN (${placeholders}) ORDER BY sort_order`, ids),
    query(`SELECT * FROM publication_keywords WHERE publication_id IN (${placeholders}) ORDER BY sort_order`, ids),
  ]) as [any[], any[]];

  for (const pub of publications) {
    pub.authors = (authors as any[]).filter((a) => a.publication_id === pub.id);
    pub.keywords = (keywords as any[])
      .filter((k) => k.publication_id === pub.id)
      .map((k) => k.keyword);
  }
}

async function replaceAuthors(publicationId: number, authors: any[]) {
  await query('DELETE FROM publication_authors WHERE publication_id = ?', [publicationId]);
  for (let i = 0; i < authors.length; i++) {
    const a = authors[i];
    await query(
      'INSERT INTO publication_authors (publication_id, name_th, name_en, sort_order) VALUES (?, ?, ?, ?)',
      [publicationId, a.name_th ?? a.name ?? '', a.name_en ?? a.name ?? '', i + 1]
    );
  }
}

async function replaceKeywords(publicationId: number, keywords: string[]) {
  await query('DELETE FROM publication_keywords WHERE publication_id = ?', [publicationId]);
  for (let i = 0; i < keywords.length; i++) {
    await query(
      'INSERT INTO publication_keywords (publication_id, keyword, sort_order) VALUES (?, ?, ?)',
      [publicationId, keywords[i], i + 1]
    );
  }
}

export async function GET() {
  const rows = await query('SELECT * FROM publications WHERE is_active = TRUE ORDER BY year DESC, id DESC');
  await attachRelations(rows as any[]);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title_th, title_en, description_th, description_en, year, authors, keywords, published_at, link, is_active } = body;
  const result = await query(
    'INSERT INTO publications (title_th, title_en, description_th, description_en, year, published_at, link, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title_th, title_en, description_th, description_en, year, published_at ?? '', link, is_active ?? true]
  );
  const newId = (result as any).insertId;
  await replaceAuthors(newId, authors ?? []);
  await replaceKeywords(newId, keywords ?? []);
  return NextResponse.json({ id: newId });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, title_th, title_en, description_th, description_en, year, authors, keywords, published_at, link, is_active } = body;
  await query(
    'UPDATE publications SET title_th=?, title_en=?, description_th=?, description_en=?, year=?, published_at=?, link=?, is_active=? WHERE id=?',
    [title_th, title_en, description_th, description_en, year, published_at ?? '', link, is_active ?? true, id]
  );
  await replaceAuthors(id, authors ?? []);
  await replaceKeywords(id, keywords ?? []);
  return NextResponse.json({ message: 'Updated' });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query('DELETE FROM publications WHERE id=?', [id]);
  return NextResponse.json({ message: 'Deleted' });
}