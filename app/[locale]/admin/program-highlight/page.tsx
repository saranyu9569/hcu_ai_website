'use client';
import { Topic, ProgramHighlight } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function ProgramHighlightAdminPage() {
  const router = useRouter();
  const [highlights, setHighlights] = useState<ProgramHighlight[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramHighlight | null>(null);
  const [newItem, setNewItem] = useState<any>({
    title_th: '', title_en: '', description_th: '', description_en: '',
    image: '', event_name_th: '', event_name_en: '', event_date: '', event_time: '',
    event_location_th: '', event_location_en: '', registration_url: '', qr_code: '',
    topics: [], is_active: false
  });
  const [newTopic, setNewTopic] = useState<Topic>({ topic_th: '', topic_en: '' });

  useEffect(() => { fetchHighlights(); }, []);

  const fetchHighlights = async () => {
    try {
      const response = await fetch('/api/admin/program-highlight');
      if (response.ok) {
        const data = await response.json();
        setHighlights(data);
      }
    } catch (error) {
      console.error('Failed to fetch program highlights:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/program-highlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        setNewItem({
          title_th: '', title_en: '', description_th: '', description_en: '',
          image: '', event_name_th: '', event_name_en: '', event_date: '', event_time: '',
          event_location_th: '', event_location_en: '', registration_url: '', qr_code: '',
          topics: [], is_active: false
        });
        setIsAdding(false);
        fetchHighlights();
      }
    } catch (error) {
      console.error('Failed to add program highlight:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    try {
      const response = await fetch(`/api/admin/program-highlight/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        setEditingItem(null);
        fetchHighlights();
      }
    } catch (error) {
      console.error('Failed to update program highlight:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program highlight?')) return;
    try {
      const response = await fetch(`/api/admin/program-highlight/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchHighlights();
      }
    } catch (error) {
      console.error('Failed to delete program highlight:', error);
    }
  };

  const handleSetActive = async (id: number) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight) return;
    const updated = { ...highlight, is_active: true };
    try {
      const response = await fetch(`/api/admin/program-highlight/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (response.ok) {
        fetchHighlights();
      }
    } catch (error) {
      console.error('Failed to set active:', error);
    }
  };

  // Topic handlers for add/edit
  const addTopic = (toEdit: boolean) => {
    if (!newTopic.topic_th && !newTopic.topic_en) return;
    if (toEdit && editingItem) {
      setEditingItem({ ...editingItem, topics: [...editingItem.topics, newTopic] });
    } else if (!toEdit) {
      setNewItem({ ...newItem, topics: [...newItem.topics, newTopic] });
    }
    setNewTopic({ topic_th: '', topic_en: '' });
  };
  const removeTopic = (idx: number, toEdit: boolean) => {
    if (toEdit && editingItem) {
      setEditingItem({ ...editingItem, topics: editingItem.topics.filter((_, i) => i !== idx) });
    } else if (!toEdit) {
      setNewItem({ ...newItem, topics: newItem.topics.filter((_: any, i: number) => i !== idx) });
    }
  };

  const renderHighlight = (highlight: ProgramHighlight) => {
    const isEditing = editingItem?.id === highlight.id;
    const data = isEditing ? editingItem! : highlight;
    return (
      <div key={highlight.id} className={`border rounded-lg p-4 mb-4 bg-white ${highlight.is_active ? 'border-cyan-500' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Title (TH)" value={data.title_th} onChange={e => setEditingItem({ ...data, title_th: e.target.value })} />
                  <Input placeholder="Title (EN)" value={data.title_en} onChange={e => setEditingItem({ ...data, title_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea placeholder="Description (TH)" value={data.description_th} onChange={e => setEditingItem({ ...data, description_th: e.target.value })} rows={3} />
                  <Textarea placeholder="Description (EN)" value={data.description_en} onChange={e => setEditingItem({ ...data, description_en: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Image Path" value={data.image} onChange={e => setEditingItem({ ...data, image: e.target.value })} />
                  <Input placeholder="QR Code Path" value={data.qr_code} onChange={e => setEditingItem({ ...data, qr_code: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Event Name (TH)" value={data.event_name_th} onChange={e => setEditingItem({ ...data, event_name_th: e.target.value })} />
                  <Input placeholder="Event Name (EN)" value={data.event_name_en} onChange={e => setEditingItem({ ...data, event_name_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Event Date" value={data.event_date} onChange={e => setEditingItem({ ...data, event_date: e.target.value })} />
                  <Input placeholder="Event Time" value={data.event_time} onChange={e => setEditingItem({ ...data, event_time: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Event Location (TH)" value={data.event_location_th} onChange={e => setEditingItem({ ...data, event_location_th: e.target.value })} />
                  <Input placeholder="Event Location (EN)" value={data.event_location_en} onChange={e => setEditingItem({ ...data, event_location_en: e.target.value })} />
                </div>
                <Input placeholder="Registration URL" value={data.registration_url} onChange={e => setEditingItem({ ...data, registration_url: e.target.value })} />
                {/* Topics */}
                <div>
                  <div className="font-semibold mb-2">Topics</div>
                  <div className="flex gap-2 mb-2">
                    <Input placeholder="Topic (TH)" value={newTopic.topic_th} onChange={e => setNewTopic({ ...newTopic, topic_th: e.target.value })} />
                    <Input placeholder="Topic (EN)" value={newTopic.topic_en} onChange={e => setNewTopic({ ...newTopic, topic_en: e.target.value })} />
                    <Button size="sm" onClick={() => addTopic(true)}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.topics.map((topic, idx) => (
                      <div key={idx} className="bg-cyan-100 px-2 py-1 rounded flex items-center gap-1">
                        <span>{topic.topic_th} / {topic.topic_en}</span>
                        <button onClick={() => removeTopic(idx, true)}><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={data.is_active} onChange={e => setEditingItem({ ...data, is_active: e.target.checked })} />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            ) : (
              <div>
                <div className="font-medium text-slate-900 flex items-center gap-2">
                  {highlight.title_th} / {highlight.title_en}
                  {highlight.is_active && <CheckCircle className="h-4 w-4 text-cyan-500" aria-label="Active" />}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {highlight.description_th.substring(0, 100)}...
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Event: {highlight.event_name_th} / {highlight.event_name_en}
                </div>
                {highlight.is_active && <div className="text-xs text-cyan-600 font-semibold mt-1">Active</div>}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleEdit}><Save className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}><X className="h-4 w-4" /></Button>
              </>
            ) : (
              <>
                {!highlight.is_active && <Button size="sm" variant="outline" onClick={() => handleSetActive(highlight.id)}>Set Active</Button>}
                <Button size="sm" variant="outline" onClick={() => setEditingItem(highlight)}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(highlight.id)}><Trash2 className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Program Highlight Management</h1>
            <p className="text-gray-600">Manage program highlights, event details, topics (TH/EN)</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </div>
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader><CardTitle>Add New Program Highlight</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Title (TH)" value={newItem.title_th} onChange={e => setNewItem({ ...newItem, title_th: e.target.value })} />
                <Input placeholder="Title (EN)" value={newItem.title_en} onChange={e => setNewItem({ ...newItem, title_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Textarea placeholder="Description (TH)" value={newItem.description_th} onChange={e => setNewItem({ ...newItem, description_th: e.target.value })} rows={3} />
                <Textarea placeholder="Description (EN)" value={newItem.description_en} onChange={e => setNewItem({ ...newItem, description_en: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Image Path" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} />
                <Input placeholder="QR Code Path" value={newItem.qr_code} onChange={e => setNewItem({ ...newItem, qr_code: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Event Name (TH)" value={newItem.event_name_th} onChange={e => setNewItem({ ...newItem, event_name_th: e.target.value })} />
                <Input placeholder="Event Name (EN)" value={newItem.event_name_en} onChange={e => setNewItem({ ...newItem, event_name_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Event Date" value={newItem.event_date} onChange={e => setNewItem({ ...newItem, event_date: e.target.value })} />
                <Input placeholder="Event Time" value={newItem.event_time} onChange={e => setNewItem({ ...newItem, event_time: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Event Location (TH)" value={newItem.event_location_th} onChange={e => setNewItem({ ...newItem, event_location_th: e.target.value })} />
                <Input placeholder="Event Location (EN)" value={newItem.event_location_en} onChange={e => setNewItem({ ...newItem, event_location_en: e.target.value })} />
              </div>
              <Input placeholder="Registration URL" value={newItem.registration_url} onChange={e => setNewItem({ ...newItem, registration_url: e.target.value })} />
              {/* Topics */}
              <div>
                <div className="font-semibold mb-2">Topics</div>
                <div className="flex gap-2 mb-2">
                  <Input placeholder="Topic (TH)" value={newTopic.topic_th} onChange={e => setNewTopic({ ...newTopic, topic_th: e.target.value })} />
                  <Input placeholder="Topic (EN)" value={newTopic.topic_en} onChange={e => setNewTopic({ ...newTopic, topic_en: e.target.value })} />
                  <Button size="sm" onClick={() => addTopic(false)}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newItem.topics.map((topic: Topic, idx: number) => (
                    <div key={idx} className="bg-cyan-100 px-2 py-1 rounded flex items-center gap-1">
                      <span>{topic.topic_th} / {topic.topic_en}</span>
                      <button onClick={() => removeTopic(idx, false)}><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={newItem.is_active} onChange={e => setNewItem({ ...newItem, is_active: e.target.checked })} />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex space-x-2">
                <Button onClick={handleAdd}>Save</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setIsAdding(true)} className="mb-6"><Plus className="h-4 w-4 mr-2" />Add Program Highlight</Button>
        )}
        <Card>
          <CardHeader><CardTitle>Program Highlights</CardTitle></CardHeader>
          <CardContent>
            {highlights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No program highlight found. Add your first program highlight above.</div>
            ) : (
              <div className="space-y-2">{highlights.map(renderHighlight)}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 