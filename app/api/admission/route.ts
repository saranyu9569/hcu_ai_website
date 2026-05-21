import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // ดึง section ที่ active
    const sections = await query('SELECT * FROM admission_section WHERE is_active = TRUE LIMIT 1');
    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(null);
    }
    const section: any = sections[0];
    // ดึง list
    const lists = await query('SELECT * FROM admission_list WHERE section_id = ?', [section.id]);
    // ดึง dates
    const dates = await query('SELECT * FROM admission_dates WHERE section_id = ?', [section.id]);
    return NextResponse.json({ ...section, lists, dates });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch admission section' }, { status: 500 });
  }
} 