'use client';
import { EventItem } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function EventsManagement() {
  const router = useRouter();
  const [eventItems, setEventItems] = useState<EventItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  const [newItem, setNewItem] = useState({
    title_th: '',
    title_en: '',
    content_th: '',
    content_en: '',
    category: '',
    tags: '',
    event_date: '',
    event_time: '',
    location: '',
    is_active: true
  });

  const categories = ['Academic', 'Training', 'Competition', 'Lecture', 'Workshop', 'Seminar', 'Conference'];
  const availableTags = ['ปีที่ 1', 'ปีที่ 2', 'ปีที่ 3', 'ปีที่ 4', 'ทุกชั้นปี', 'บุคลากร', 'ภายนอก'];

  useEffect(() => {
    fetchEventItems();
  }, []);

  const fetchEventItems = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEventItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };



  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/events', {
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
          category: '',
          tags: '',
          event_date: '',
          event_time: '',
          location: '',
          is_active: true
        });
        setIsAdding(false);
        fetchEventItems();
      }
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/events/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setEditingItem(null);
        fetchEventItems();
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchEventItems();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleTagToggle = (tag: string, isEditing: boolean = false) => {
    if (isEditing && editingItem) {
      const currentTags = editingItem.tags.split(',').map(t => t.trim()).filter(t => t);
      const newTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      setEditingItem({ ...editingItem, tags: newTags.join(', ') });
    } else {
      const currentTags = newItem.tags.split(',').map(t => t.trim()).filter(t => t);
      const newTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      setNewItem({ ...newItem, tags: newTags.join(', ') });
    }
  };

  const renderEventItem = (item: EventItem) => {
    const isEditing = editingItem?.id === item.id;
    const itemData = isEditing ? editingItem! : item;
    const itemTags = itemData.tags.split(',').map(t => t.trim()).filter(t => t);

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
                <div className="grid grid-cols-2 gap-4">
                  <Select value={itemData.category} onValueChange={(value: string) => setEditingItem({...itemData, category: value})} placeholder="Category">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="date"
                    value={itemData.event_date}
                    onChange={(e) => setEditingItem({...itemData, event_date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Time (e.g., 09:00 - 17:00)"
                    value={itemData.event_time}
                    onChange={(e) => setEditingItem({...itemData, event_time: e.target.value})}
                  />
                  <Input
                    placeholder="Location"
                    value={itemData.location}
                    onChange={(e) => setEditingItem({...itemData, location: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={itemData.is_active}
                    onChange={(e) => setEditingItem({...itemData, is_active: e.target.checked})}
                  />
                  <span className="text-sm">Active</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag, true)}
                        className={`px-2 py-1 text-xs rounded-full border ${
                          itemTags.includes(tag)
                            ? 'bg-cyan-100 text-cyan-700 border-cyan-300'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Selected: {itemTags.join(', ') || 'None'}</p>
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
                  Category: {item.category} | Date: {new Date(item.event_date).toLocaleDateString()} | Time: {item.event_time} | Location: {item.location} |
                  <span className={item.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {item.is_active ? ' Active' : ' Inactive'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.split(',').map(tag => tag.trim()).filter(tag => tag).map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

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
            <h1 className="text-2xl font-bold text-slate-900">Events Management</h1>
            <p className="text-gray-600">Manage your website events and activities</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Add New Event */}
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Event</CardTitle>
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
                              <div className="grid grid-cols-2 gap-4">
                  <Select value={newItem.category} onValueChange={(value: string) => setNewItem({...newItem, category: value})} placeholder="Category">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="date"
                    value={newItem.event_date}
                    onChange={(e) => setNewItem({...newItem, event_date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Time (e.g., 09:00 - 17:00)"
                    value={newItem.event_time}
                    onChange={(e) => setNewItem({...newItem, event_time: e.target.value})}
                  />
                  <Input
                    placeholder="Location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.is_active}
                    onChange={(e) => setNewItem({...newItem, is_active: e.target.checked})}
                  />
                  <span className="text-sm">Active</span>
                </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-2 py-1 text-xs rounded-full border ${
                        newItem.tags.split(',').map(t => t.trim()).includes(tag)
                          ? 'bg-cyan-100 text-cyan-700 border-cyan-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Selected: {newItem.tags.split(',').map(t => t.trim()).filter(t => t).join(', ') || 'None'}</p>
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
            Add Event
          </Button>
        )}

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            {eventItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events found. Add your first event above.
              </div>
            ) : (
              <div className="space-y-2">
                {eventItems.map(item => renderEventItem(item))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 