'use client';
import { NewsItem } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, Upload, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function NewsManagement() {
  const router = useRouter();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    title_th: '',
    title_en: '',
    content_th: '',
    content_en: '',
    image_path: '',
    category: '',
    publish_date: '',
    is_active: true
  });

  const categories = ['Admission', 'Academic', 'Research', 'Training', 'Event', 'General'];

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      const response = await fetch('/api/admin/news');
      if (response.ok) {
        const data = await response.json();
        setNewsItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  const handleImageUpload = async (file: File, isEditing: boolean = false) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (isEditing && editingItem) {
          setEditingItem({ ...editingItem, image_path: result.imagePath });
        } else {
          setNewItem({ ...newItem, image_path: result.imagePath });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        setNewItem({
          title_th: '',
          title_en: '',
          content_th: '',
          content_en: '',
          image_path: '',
          category: '',
          publish_date: '',
          is_active: true
        });
        setIsAdding(false);
        fetchNewsItems();
      }
    } catch (error) {
      console.error('Failed to add news:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/news/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setEditingItem(null);
        fetchNewsItems();
      }
    } catch (error) {
      console.error('Failed to update news:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchNewsItems();
      }
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  const renderNewsItem = (item: NewsItem) => {
    const isEditing = editingItem?.id === item.id;
    const itemData = isEditing ? editingItem! : item;

    return (
      <div key={item.id} className="border rounded-lg p-4 mb-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <Textarea
                    placeholder="Content (Thai)"
                    value={itemData.content_th}
                    onChange={(e) => setEditingItem({...itemData, content_th: e.target.value})}
                    rows={3}
                  />
                  <Textarea
                    placeholder="Content (English)"
                    value={itemData.content_en}
                    onChange={(e) => setEditingItem({...itemData, content_en: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Select value={itemData.category} onValueChange={(value: string) => setEditingItem({...itemData, category: value})} placeholder="Category">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="date"
                    value={itemData.publish_date}
                    onChange={(e) => setEditingItem({...itemData, publish_date: e.target.value})}
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={itemData.is_active}
                      onChange={(e) => setEditingItem({...itemData, is_active: e.target.checked})}
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image Upload</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                      className="flex-1"
                    />
                    {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                  </div>
                  {itemData.image_path && (
                    <div className="mt-2">
                      <img src={itemData.image_path} alt="Preview" className="w-32 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className={`font-medium ${item.is_active ? 'text-slate-900' : 'text-gray-400'}`}>
                  {item.title_th} / {item.title_en}
                </div>
                <div className={`text-sm ${item.is_active ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                  {item.content_th.substring(0, 100)}...
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Category: {item.category} | Date: {new Date(item.publish_date).toLocaleDateString()} |
                  <span className={item.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {item.is_active ? ' Active' : ' Inactive'}
                  </span>
                </div>
                {item.image_path && (
                  <img src={item.image_path} alt="News" className="w-32 h-20 object-cover rounded mt-2" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">News Management</h1>
            <p className="text-gray-600">Manage your website news and announcements</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Add New News */}
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New News</CardTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <Textarea
                  placeholder="Content (Thai)"
                  value={newItem.content_th}
                  onChange={(e) => setNewItem({...newItem, content_th: e.target.value})}
                  rows={4}
                />
                <Textarea
                  placeholder="Content (English)"
                  value={newItem.content_en}
                  onChange={(e) => setNewItem({...newItem, content_en: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Select value={newItem.category} onValueChange={(value: string) => setNewItem({...newItem, category: value})} placeholder="Category">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </Select>
                <Input
                  type="date"
                  value={newItem.publish_date}
                  onChange={(e) => setNewItem({...newItem, publish_date: e.target.value})}
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.is_active}
                    onChange={(e) => setNewItem({...newItem, is_active: e.target.checked})}
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Upload</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="flex-1"
                  />
                  {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
                {newItem.image_path && (
                  <div className="mt-2">
                    <img src={newItem.image_path} alt="Preview" className="w-32 h-20 object-cover rounded" />
                  </div>
                )}
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
            Add News
          </Button>
        )}

        {/* News Items List */}
        <Card>
          <CardHeader>
            <CardTitle>News Items</CardTitle>
          </CardHeader>
          <CardContent>
            {newsItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No news items found. Add your first news item above.
              </div>
            ) : (
              <div className="space-y-2">
                {newsItems.map(item => renderNewsItem(item))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 