import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // ดึง highlight ทั้งหมด (active)
    const highlights = await query('SELECT * FROM program_highlight WHERE is_active = TRUE ORDER BY id ASC');
    // ดึง topics
    const topics = await query('SELECT * FROM program_highlight_topic');
    // ดึง archive images
    const archives = await query('SELECT * FROM program_highlight_archive');
    // รวมข้อมูล
    const result = Array.isArray(highlights) ? highlights.map((h: any) => ({
      ...h,
      topics: (Array.isArray(topics) ? topics.filter((t: any) => t.program_highlight_id === h.id) : []),
      archiveImages: (Array.isArray(archives) ? archives.filter((a: any) => a.program_highlight_id === h.id) : [])
    })) : [];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch program highlights' }, { status: 500 });
  }
} 