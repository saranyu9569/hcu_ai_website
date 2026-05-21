'use client';
import { NavbarItem } from '@/lib';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  Save,
  X
} from 'lucide-react';


export default function NavbarManagement() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<NavbarItem[]>([]);
  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title_th: '',
    title_en: '',
    url: '',
    parent_id: null as number | null,
    order_index: 0,
    is_dropdown: false,
    is_active: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/navbar');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/navbar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        setNewItem({
          title_th: '',
          title_en: '',
          url: '',
          parent_id: null,
          order_index: 0,
          is_dropdown: false,
          is_active: true
        });
        setIsAdding(false);
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Failed to add menu item:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/navbar/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });

      if (response.ok) {
        setEditingItem(null);
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/navbar/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  const renderMenuItem = (item: NavbarItem, level: number = 0) => {
    const isEditing = editingItem?.id === item.id;
    const itemData = isEditing ? editingItem! : item;

    return (
      <div key={item.id} className="border rounded-lg p-4 mb-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Title (Thai)"
                    value={itemData.title_th}
                    onChange={(e) => setEditingItem({...itemData, title_th: e.target.value})}
                  />
                  <Input
                    placeholder="Title (English)"
                    value={itemData.title_en}
                    onChange={(e) => setEditingItem({...itemData, title_en: e.target.value})}
                  />
                </div>
                <Input
                  placeholder="URL"
                  value={itemData.url}
                  onChange={(e) => setEditingItem({...itemData, url: e.target.value})}
                />
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={itemData.is_dropdown}
                      onChange={(e) => setEditingItem({...itemData, is_dropdown: e.target.checked})}
                    />
                    <span className="text-sm">Dropdown Menu</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={itemData.is_active}
                      onChange={(e) => setEditingItem({...itemData, is_active: e.target.checked})}
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <div className={`font-medium ${item.is_active ? 'text-slate-900' : 'text-gray-400'}`}>
                  {item.title_th} / {item.title_en}
                </div>
                <div className={`text-sm ${item.is_active ? 'text-gray-500' : 'text-gray-400'}`}>
                  {item.url}
                </div>
                <div className="text-xs text-gray-400">
                  {item.is_dropdown ? 'Dropdown' : 'Link'} 
                  <span className={item.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleEdit}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Render children */}
        {item.children && item.children.length > 0 && (
          <div className="mt-4 ml-4">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Navbar Management</h1>
            <p className="text-gray-600">Manage your website navigation menu</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Add New Item */}
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Menu Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Title (Thai)"
                  value={newItem.title_th}
                  onChange={(e) => setNewItem({...newItem, title_th: e.target.value})}
                />
                <Input
                  placeholder="Title (English)"
                  value={newItem.title_en}
                  onChange={(e) => setNewItem({...newItem, title_en: e.target.value})}
                />
              </div>
              <Input
                placeholder="URL"
                value={newItem.url}
                onChange={(e) => setNewItem({...newItem, url: e.target.value})}
              />
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.is_dropdown}
                    onChange={(e) => setNewItem({...newItem, is_dropdown: e.target.checked})}
                  />
                  <span className="text-sm">Dropdown Menu</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.is_active}
                    onChange={(e) => setNewItem({...newItem, is_active: e.target.checked})}
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAdd}>Save</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setIsAdding(true)} className="mb-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        )}

        {/* Menu Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            {menuItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No menu items found. Add your first menu item above.
              </div>
            ) : (
              <div className="space-y-2">
                {menuItems.map(item => renderMenuItem(item))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 