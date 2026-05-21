import { NextRequest, NextResponse } from 'next/server';
import { pool, query } from '@/lib/database';

// GET - Fetch all navbar menu items
export async function GET() {
  try {
    const rows = await query(`
      SELECT * FROM navbar_menu 
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

    return NextResponse.json(rootItems);
  } catch (error) {
    console.error('Failed to fetch navbar items:', error);
    return NextResponse.json({ error: 'Failed to fetch navbar items' }, { status: 500 });
  }
}

// POST - Create new navbar menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title_th, title_en, url, parent_id, order_index, is_dropdown } = body;

    const result = await query(`
      INSERT INTO navbar_menu (title_th, title_en, url, parent_id, order_index, is_dropdown)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title_th, title_en, url, parent_id, order_index, is_dropdown]);

    return NextResponse.json({ id: (result as any).insertId });
  } catch (error) {
    console.error('Failed to create navbar item:', error);
    return NextResponse.json({ error: 'Failed to create navbar item' }, { status: 500 });
  }
} 