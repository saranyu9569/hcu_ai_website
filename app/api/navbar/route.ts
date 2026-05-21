import { NextResponse } from 'next/server';
import { pool, query } from '@/lib/database';

// GET - Fetch navbar menu items for frontend
export const revalidate = 60;

export async function GET() {
  try {
    const rows = await query(`
      SELECT * FROM navbar_menu 
      WHERE is_active = TRUE 
      ORDER BY order_index ASC, id ASC
    `);

    // Build hierarchical structure
    const menuItems = rows as any[];
    const menuMap = new Map();
    const rootItems: any[] = [];

    // First pass: create map of all items
    menuItems.forEach(item => {
      menuMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build hierarchy
    menuItems.forEach(item => {
      if (item.parent_id === null) {
        rootItems.push(menuMap.get(item.id));
      } else {
        const parent = menuMap.get(item.parent_id);
        if (parent) {
          parent.children.push(menuMap.get(item.id));
        }
      }
    });

    // Rewrite admission URLs to the external admissions portal
    const rewriteAdmissionUrls = (items: any[]): any[] =>
      items.map(item => ({
        ...item,
        url: item.url === '/admission' ? 'https://admission.hcu.ac.th' : item.url,
        children: item.children?.length ? rewriteAdmissionUrls(item.children) : [],
      }));

    return NextResponse.json(rewriteAdmissionUrls(rootItems));
  } catch (error) {
    console.error('Failed to fetch navbar items:', error);
    return NextResponse.json({ error: 'Failed to fetch navbar items' }, { status: 500 });
  }
} 