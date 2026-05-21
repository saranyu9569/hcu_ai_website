import { NextResponse } from 'next/server';
import { pool, query } from '@/lib/database';

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  
  await query(
    `UPDATE undergraduate_career_metric SET technical_skills=?, problem_solving=?, communication=?, leadership=?, research=?, business_impact=? WHERE career_id=?`,
    [
      data['Technical Skills'],
      data['Problem Solving'],
      data['Communication'],
      data['Leadership'],
      data['Research'],
      data['Business Impact'],
      id
    ]
  );
  
  return NextResponse.json({ success: true });
}