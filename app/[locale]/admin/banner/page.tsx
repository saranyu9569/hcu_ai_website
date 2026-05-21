'use client';
import { BannerSlide } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, MoveUp, MoveDown } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function BannerManagement() {
  const router = useRouter();
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerSlide | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    title_th: '',
    title_en: '',
    description_th: '',
    description_en: '',
    image_path: '',
    cta_text_th: '',
    cta_text_en: '',
    cta_url: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchBannerSlides();
  }, []);

  const fetchBannerSlides = async () => {
    try {
      const response = await fetch('/api/admin/banner');
      if (response.ok) {
        const data = await response.json();
        setBannerSlides(data);
      }
    } catch (error) {
      console.error('Failed to fetch banner slides:', error);
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
      const response = await fetch('/api/admin/banner', {
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
          description_th: '',
          description_en: '',
          image_path: '',
          cta_text_th: '',
          cta_text_en: '',
          cta_url: '',
          sort_order: 0,
          is_active: true
        });
        setIsAdding(false);
        fetchBannerSlides();
      }
    } catch (error) {
      console.error('Failed to add banner slide:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/banner/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setEditingItem(null);
        fetchBannerSlides();
      }
    } catch (error) {
      console.error('Failed to update banner slide:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner slide?')) return;

    try {
      const response = await fetch(`/api/admin/banner/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchBannerSlides();
      }
    } catch (error) {
      console.error('Failed to delete banner slide:', error);
    }
  };

  const handleMoveUp = async (id: number) => {
    const currentIndex = bannerSlides.findIndex(slide => slide.id === id);
    if (currentIndex <= 0) return;

    const updatedSlides = [...bannerSlides];
    const temp = updatedSlides[currentIndex];
    updatedSlides[currentIndex] = updatedSlides[currentIndex - 1];
    updatedSlides[currentIndex - 1] = temp;

    // Update sort_order
    updatedSlides[currentIndex].sort_order = currentIndex;
    updatedSlides[currentIndex - 1].sort_order = currentIndex - 1;

    setBannerSlides(updatedSlides);

    // Update in database
    try {
      await fetch(`/api/admin/banner/${updatedSlides[currentIndex].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSlides[currentIndex])
      });
      await fetch(`/api/admin/banner/${updatedSlides[currentIndex - 1].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSlides[currentIndex - 1])
      });
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  };

  const handleMoveDown = async (id: number) => {
    const currentIndex = bannerSlides.findIndex(slide => slide.id === id);
    if (currentIndex >= bannerSlides.length - 1) return;

    const updatedSlides = [...bannerSlides];
    const temp = updatedSlides[currentIndex];
    updatedSlides[currentIndex] = updatedSlides[currentIndex + 1];
    updatedSlides[currentIndex + 1] = temp;

    // Update sort_order
    updatedSlides[currentIndex].sort_order = currentIndex;
    updatedSlides[currentIndex + 1].sort_order = currentIndex + 1;

    setBannerSlides(updatedSlides);

    // Update in database
    try {
      await fetch(`/api/admin/banner/${updatedSlides[currentIndex].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSlides[currentIndex])
      });
      await fetch(`/api/admin/banner/${updatedSlides[currentIndex + 1].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSlides[currentIndex + 1])
      });
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  };

  const renderBannerSlide = (slide: BannerSlide) => {
    const isEditing = editingItem?.id === slide.id;
    const slideData = isEditing ? editingItem! : slide;

    return (
      <div key={slide.id} className="border rounded-lg p-4 mb-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Title (Thai)"
                    value={slideData.title_th}
                    onChange={(e) => setEditingItem({...slideData, title_th: e.target.value})}
                  />
                  <Input
                    placeholder="Title (English)"
                    value={slideData.title_en}
                    onChange={(e) => setEditingItem({...slideData, title_en: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea
                    placeholder="Description (Thai)"
                    value={slideData.description_th}
                    onChange={(e) => setEditingItem({...slideData, description_th: e.target.value})}
                    rows={3}
                  />
                  <Textarea
                    placeholder="Description (English)"
                    value={slideData.description_en}
                    onChange={(e) => setEditingItem({...slideData, description_en: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="CTA Text (Thai)"
                    value={slideData.cta_text_th}
                    onChange={(e) => setEditingItem({...slideData, cta_text_th: e.target.value})}
                  />
                  <Input
                    placeholder="CTA Text (English)"
                    value={slideData.cta_text_en}
                    onChange={(e) => setEditingItem({...slideData, cta_text_en: e.target.value})}
                  />
                  <Input
                    placeholder="CTA URL"
                    value={slideData.cta_url}
                    onChange={(e) => setEditingItem({...slideData, cta_url: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Sort Order"
                    value={slideData.sort_order}
                    onChange={(e) => setEditingItem({...slideData, sort_order: parseInt(e.target.value)})}
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={slideData.is_active}
                      onChange={(e) => setEditingItem({...slideData, is_active: e.target.checked})}
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
                  {slideData.image_path && (
                    <div className="mt-2">
                      <img src={slideData.image_path} alt="Preview" className="w-32 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className={`font-medium ${slide.is_active ? 'text-slate-900' : 'text-gray-400'}`}>
                  {slide.title_th} / {slide.title_en}
                </div>
                <div className={`text-sm ${slide.is_active ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                  {slide.description_th.substring(0, 100)}...
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  CTA: {slide.cta_text_th} | URL: {slide.cta_url} | Order: {slide.sort_order} |
                  <span className={slide.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {slide.is_active ? ' Active' : ' Inactive'}
                  </span>
                </div>
                {slide.image_path && (
                  <img src={slide.image_path} alt="Banner" className="w-32 h-20 object-cover rounded mt-2" />
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
                <Button size="sm" variant="outline" onClick={() => handleMoveUp(slide.id)} disabled={bannerSlides.indexOf(slide) === 0}>
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleMoveDown(slide.id)} disabled={bannerSlides.indexOf(slide) === bannerSlides.length - 1}>
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingItem(slide)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(slide.id)}>
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
            <h1 className="text-2xl font-bold text-slate-900">Banner Slider Management</h1>
            <p className="text-gray-600">Manage your website banner slider</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Add New Banner Slide */}
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Banner Slide</CardTitle>
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
                  placeholder="Description (Thai)"
                  value={newItem.description_th}
                  onChange={(e) => setNewItem({...newItem, description_th: e.target.value})}
                  rows={4}
                />
                <Textarea
                  placeholder="Description (English)"
                  value={newItem.description_en}
                  onChange={(e) => setNewItem({...newItem, description_en: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="CTA Text (Thai)"
                  value={newItem.cta_text_th}
                  onChange={(e) => setNewItem({...newItem, cta_text_th: e.target.value})}
                />
                <Input
                  placeholder="CTA Text (English)"
                  value={newItem.cta_text_en}
                  onChange={(e) => setNewItem({...newItem, cta_text_en: e.target.value})}
                />
                <Input
                  placeholder="CTA URL"
                  value={newItem.cta_url}
                  onChange={(e) => setNewItem({...newItem, cta_url: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Sort Order"
                  value={newItem.sort_order}
                  onChange={(e) => setNewItem({...newItem, sort_order: parseInt(e.target.value)})}
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
            Add Banner Slide
          </Button>
        )}

        {/* Banner Slides List */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Slides</CardTitle>
          </CardHeader>
          <CardContent>
            {bannerSlides.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No banner slides found. Add your first banner slide above.
              </div>
            ) : (
              <div className="space-y-2">
                {bannerSlides.map(slide => renderBannerSlide(slide))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 