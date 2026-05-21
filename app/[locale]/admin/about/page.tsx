'use client';
import { AboutSection } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function AboutSectionAdminPage() {
  const router = useRouter();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutSection | null>(null);
  const [newItem, setNewItem] = useState({
    title_th: '',
    title_en: '',
    description_th: '',
    description_en: '',
    learn_more_button_th: '',
    learn_more_button_en: '',
    view_button_th: '',
    view_button_en: '',
    member_details_th: '',
    member_details_en: '',
    cirriculum_th: '',
    cirriculum_en: '',
    student_project_th: '',
    student_project_en: '',
    research_project_th: '',
    research_project_en: '',
    is_active: false
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/admin/about-section');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Failed to fetch about sections:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/about-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        setNewItem({
          title_th: '', title_en: '', description_th: '', description_en: '',
          learn_more_button_th: '', learn_more_button_en: '',
          view_button_th: '', view_button_en: '',
          member_details_th: '', member_details_en: '',
          cirriculum_th: '', cirriculum_en: '',
          student_project_th: '', student_project_en: '',
          research_project_th: '', research_project_en: '',
          is_active: false
        });
        setIsAdding(false);
        fetchSections();
      }
    } catch (error) {
      console.error('Failed to add about section:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    try {
      const response = await fetch(`/api/admin/about-section/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        setEditingItem(null);
        fetchSections();
      }
    } catch (error) {
      console.error('Failed to update about section:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this about section?')) return;
    try {
      const response = await fetch(`/api/admin/about-section/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchSections();
      }
    } catch (error) {
      console.error('Failed to delete about section:', error);
    }
  };

  const handleSetActive = async (id: number) => {
    const section = sections.find(s => s.id === id);
    if (!section) return;
    const updated = { ...section, is_active: true };
    try {
      const response = await fetch(`/api/admin/about-section/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (response.ok) {
        fetchSections();
      }
    } catch (error) {
      console.error('Failed to set active:', error);
    }
  };

  const renderSection = (section: AboutSection) => {
    const isEditing = editingItem?.id === section.id;
    const sectionData = isEditing ? editingItem! : section;
    return (
      <div key={section.id} className={`border rounded-lg p-4 mb-4 bg-white ${section.is_active ? 'border-cyan-500' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Title (TH)" value={sectionData.title_th} onChange={e => setEditingItem({ ...sectionData, title_th: e.target.value })} />
                  <Input placeholder="Title (EN)" value={sectionData.title_en} onChange={e => setEditingItem({ ...sectionData, title_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea placeholder="Description (TH)" value={sectionData.description_th} onChange={e => setEditingItem({ ...sectionData, description_th: e.target.value })} rows={3} />
                  <Textarea placeholder="Description (EN)" value={sectionData.description_en} onChange={e => setEditingItem({ ...sectionData, description_en: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Learn More Button (TH)" value={sectionData.learn_more_button_th} onChange={e => setEditingItem({ ...sectionData, learn_more_button_th: e.target.value })} />
                  <Input placeholder="Learn More Button (EN)" value={sectionData.learn_more_button_en} onChange={e => setEditingItem({ ...sectionData, learn_more_button_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="View Button (TH)" value={sectionData.view_button_th} onChange={e => setEditingItem({ ...sectionData, view_button_th: e.target.value })} />
                  <Input placeholder="View Button (EN)" value={sectionData.view_button_en} onChange={e => setEditingItem({ ...sectionData, view_button_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Member Details (TH)" value={sectionData.member_details_th} onChange={e => setEditingItem({ ...sectionData, member_details_th: e.target.value })} />
                  <Input placeholder="Member Details (EN)" value={sectionData.member_details_en} onChange={e => setEditingItem({ ...sectionData, member_details_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Cirriculum (TH)" value={sectionData.cirriculum_th} onChange={e => setEditingItem({ ...sectionData, cirriculum_th: e.target.value })} />
                  <Input placeholder="Cirriculum (EN)" value={sectionData.cirriculum_en} onChange={e => setEditingItem({ ...sectionData, cirriculum_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Student Project (TH)" value={sectionData.student_project_th} onChange={e => setEditingItem({ ...sectionData, student_project_th: e.target.value })} />
                  <Input placeholder="Student Project (EN)" value={sectionData.student_project_en} onChange={e => setEditingItem({ ...sectionData, student_project_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Research Project (TH)" value={sectionData.research_project_th} onChange={e => setEditingItem({ ...sectionData, research_project_th: e.target.value })} />
                  <Input placeholder="Research Project (EN)" value={sectionData.research_project_en} onChange={e => setEditingItem({ ...sectionData, research_project_en: e.target.value })} />
                </div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={sectionData.is_active} onChange={e => setEditingItem({ ...sectionData, is_active: e.target.checked })} />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            ) : (
              <div>
                <div className="font-medium text-slate-900 flex items-center gap-2">
                  {section.title_th} / {section.title_en}
                  {section.is_active && <CheckCircle className="h-4 w-4 text-cyan-500" aria-label="Active" />}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {section.description_th.substring(0, 100)}...
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Button: {section.learn_more_button_th} / {section.learn_more_button_en}
                </div>
                {section.is_active && <div className="text-xs text-cyan-600 font-semibold mt-1">Active</div>}
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
                {!section.is_active && <Button size="sm" variant="outline" onClick={() => handleSetActive(section.id)}>Set Active</Button>}
                <Button size="sm" variant="outline" onClick={() => setEditingItem(section)}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(section.id)}><Trash2 className="h-4 w-4" /></Button>
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
            <h1 className="text-2xl font-bold text-slate-900">About Section Management</h1>
            <p className="text-gray-600">Manage homepage about section (TH/EN)</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </div>
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader><CardTitle>Add New About Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Title (TH)" value={newItem.title_th} onChange={e => setNewItem({ ...newItem, title_th: e.target.value })} />
                <Input placeholder="Title (EN)" value={newItem.title_en} onChange={e => setNewItem({ ...newItem, title_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Textarea placeholder="Description (TH)" value={newItem.description_th} onChange={e => setNewItem({ ...newItem, description_th: e.target.value })} rows={4} />
                <Textarea placeholder="Description (EN)" value={newItem.description_en} onChange={e => setNewItem({ ...newItem, description_en: e.target.value })} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Learn More Button (TH)" value={newItem.learn_more_button_th} onChange={e => setNewItem({ ...newItem, learn_more_button_th: e.target.value })} />
                <Input placeholder="Learn More Button (EN)" value={newItem.learn_more_button_en} onChange={e => setNewItem({ ...newItem, learn_more_button_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="View Button (TH)" value={newItem.view_button_th} onChange={e => setNewItem({ ...newItem, view_button_th: e.target.value })} />
                <Input placeholder="View Button (EN)" value={newItem.view_button_en} onChange={e => setNewItem({ ...newItem, view_button_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Member Details (TH)" value={newItem.member_details_th} onChange={e => setNewItem({ ...newItem, member_details_th: e.target.value })} />
                <Input placeholder="Member Details (EN)" value={newItem.member_details_en} onChange={e => setNewItem({ ...newItem, member_details_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Cirriculum (TH)" value={newItem.cirriculum_th} onChange={e => setNewItem({ ...newItem, cirriculum_th: e.target.value })} />
                <Input placeholder="Cirriculum (EN)" value={newItem.cirriculum_en} onChange={e => setNewItem({ ...newItem, cirriculum_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Student Project (TH)" value={newItem.student_project_th} onChange={e => setNewItem({ ...newItem, student_project_th: e.target.value })} />
                <Input placeholder="Student Project (EN)" value={newItem.student_project_en} onChange={e => setNewItem({ ...newItem, student_project_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Research Project (TH)" value={newItem.research_project_th} onChange={e => setNewItem({ ...newItem, research_project_th: e.target.value })} />
                <Input placeholder="Research Project (EN)" value={newItem.research_project_en} onChange={e => setNewItem({ ...newItem, research_project_en: e.target.value })} />
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
          <Button onClick={() => setIsAdding(true)} className="mb-6"><Plus className="h-4 w-4 mr-2" />Add About Section</Button>
        )}
        <Card>
          <CardHeader><CardTitle>About Sections</CardTitle></CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No about section found. Add your first about section above.</div>
            ) : (
              <div className="space-y-2">{sections.map(renderSection)}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 