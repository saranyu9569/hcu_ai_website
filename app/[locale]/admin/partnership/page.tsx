'use client';
import { Partner } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, CheckCircle, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function PartnershipAdminPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [newItem, setNewItem] = useState<any>({
    name: '', logo: '', url: '', width: 100, height: 100, is_active: true
  });

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners');
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        setNewItem({ name: '', logo: '', url: '', width: 100, height: 100, is_active: true });
        setIsAdding(false);
        fetchPartners();
      }
    } catch (error) {
      console.error('Failed to add partner:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    try {
      const response = await fetch(`/api/admin/partners/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        setEditingItem(null);
        fetchPartners();
      }
    } catch (error) {
      console.error('Failed to update partner:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchPartners();
      }
    } catch (error) {
      console.error('Failed to delete partner:', error);
    }
  };

  const handleSetActive = async (id: number) => {
    const partner = partners.find(p => p.id === id);
    if (!partner) return;
    const updated = { ...partner, is_active: true };
    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (response.ok) {
        fetchPartners();
      }
    } catch (error) {
      console.error('Failed to set active:', error);
    }
  };

  const renderPartner = (partner: Partner) => {
    const isEditing = editingItem?.id === partner.id;
    const data = isEditing ? editingItem! : partner;
    return (
      <div key={partner.id} className={`border rounded-lg p-4 mb-4 bg-white ${partner.is_active ? 'border-cyan-500' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input placeholder="Name" value={data.name} onChange={e => setEditingItem({ ...data, name: e.target.value })} />
                <Input placeholder="Logo URL" value={data.logo} onChange={e => setEditingItem({ ...data, logo: e.target.value })} />
                <Input placeholder="Website URL" value={data.url} onChange={e => setEditingItem({ ...data, url: e.target.value })} />
                <div className="flex gap-2">
                  <Input type="number" placeholder="Width" value={data.width} onChange={e => setEditingItem({ ...data, width: parseInt(e.target.value) })} />
                  <Input type="number" placeholder="Height" value={data.height} onChange={e => setEditingItem({ ...data, height: parseInt(e.target.value) })} />
                </div>
                {/* รูปตัวอย่าง preview */}
                {data.logo && (
                  <div className="mt-2">
                    <Image
                      src={data.logo}
                      alt={data.name}
                      width={data.width || 100}
                      height={data.height || 100}
                      className="object-contain border rounded bg-white"
                      style={{ maxWidth: `${data.width || 100}px`, maxHeight: `${data.height || 100}px` }}
                      unoptimized
                    />
                    <div className="text-xs text-gray-500 mt-1">Preview ({data.width || 100} x {data.height || 100})</div>
                  </div>
                )}
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={data.is_active} onChange={e => setEditingItem({ ...data, is_active: e.target.checked })} />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            ) : (
              <div>
                <div className="font-medium text-slate-900 flex items-center gap-2">
                  {partner.name}
                  {partner.is_active && <CheckCircle className="h-4 w-4 text-cyan-500" aria-label="Active" />}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  <span className="flex items-center gap-1"><ImageIcon className="h-3 w-3" />{partner.logo}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><LinkIcon className="h-3 w-3" />{partner.url}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Size: {partner.width} x {partner.height}
                </div>
                {/* รูปตัวอย่าง preview */}
                {partner.logo && (
                  <div className="mt-2">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width || 100}
                      height={partner.height || 100}
                      className="object-contain border rounded bg-white"
                      style={{ maxWidth: `${partner.width || 100}px`, maxHeight: `${partner.height || 100}px` }}
                      unoptimized
                    />
                    <div className="text-xs text-gray-500 mt-1">Preview ({partner.width || 100} x {partner.height || 100})</div>
                  </div>
                )}
                {partner.is_active && <div className="text-xs text-cyan-600 font-semibold mt-1">Active</div>}
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
                {!partner.is_active && <Button size="sm" variant="outline" onClick={() => handleSetActive(partner.id)}>Set Active</Button>}
                <Button size="sm" variant="outline" onClick={() => setEditingItem(partner)}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(partner.id)}><Trash2 className="h-4 w-4" /></Button>
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
            <h1 className="text-2xl font-bold text-slate-900">Partnership Management</h1>
            <p className="text-gray-600">Manage partners carousel (logo, url, size)</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </div>
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader><CardTitle>Add New Partner</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
              <Input placeholder="Logo URL" value={newItem.logo} onChange={e => setNewItem({ ...newItem, logo: e.target.value })} />
              <Input placeholder="Website URL" value={newItem.url} onChange={e => setNewItem({ ...newItem, url: e.target.value })} />
              <div className="flex gap-2">
                <Input type="number" placeholder="Width" value={newItem.width} onChange={e => setNewItem({ ...newItem, width: parseInt(e.target.value) })} />
                <Input type="number" placeholder="Height" value={newItem.height} onChange={e => setNewItem({ ...newItem, height: parseInt(e.target.value) })} />
              </div>
              {/* รูปตัวอย่าง preview */}
              {newItem.logo && (
                <div className="mt-2">
                  <Image
                    src={newItem.logo}
                    alt={newItem.name}
                    width={newItem.width || 100}
                    height={newItem.height || 100}
                    className="object-contain border rounded bg-white"
                    style={{ maxWidth: `${newItem.width || 100}px`, maxHeight: `${newItem.height || 100}px` }}
                    unoptimized
                  />
                  <div className="text-xs text-gray-500 mt-1">Preview ({newItem.width || 100} x {newItem.height || 100})</div>
                </div>
              )}
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
          <Button onClick={() => setIsAdding(true)} className="mb-6"><Plus className="h-4 w-4 mr-2" />Add Partner</Button>
        )}
        <Card>
          <CardHeader><CardTitle>Partners</CardTitle></CardHeader>
          <CardContent>
            {partners.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No partner found. Add your first partner above.</div>
            ) : (
              <div className="space-y-2">{partners.map(renderPartner)}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 