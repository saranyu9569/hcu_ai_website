'use client';
import { Quote } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function QuoteAdminPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Quote | null>(null);
  const [newItem, setNewItem] = useState({
    title_th: '',
    title_en: '',
    description_th: '',
    description_en: '',
    button_th: '',
    button_en: '',
    is_active: false
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/admin/quote');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        setNewItem({
          title_th: '',
          title_en: '',
          description_th: '',
          description_en: '',
          button_th: '',
          button_en: '',
          is_active: false
        });
        setIsAdding(false);
        fetchQuotes();
      }
    } catch (error) {
      console.error('Failed to add quote:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    try {
      const response = await fetch(`/api/admin/quote/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        setEditingItem(null);
        fetchQuotes();
      }
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    try {
      const response = await fetch(`/api/admin/quote/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchQuotes();
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  const handleSetActive = async (id: number) => {
    const quote = quotes.find(q => q.id === id);
    if (!quote) return;
    const updated = { ...quote, is_active: true };
    try {
      const response = await fetch(`/api/admin/quote/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (response.ok) {
        fetchQuotes();
      }
    } catch (error) {
      console.error('Failed to set active:', error);
    }
  };

  const renderQuote = (quote: Quote) => {
    const isEditing = editingItem?.id === quote.id;
    const quoteData = isEditing ? editingItem! : quote;
    return (
      <div key={quote.id} className={`border rounded-lg p-4 mb-4 bg-white ${quote.is_active ? 'border-cyan-500' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Title (TH)" value={quoteData.title_th} onChange={e => setEditingItem({ ...quoteData, title_th: e.target.value })} />
                  <Input placeholder="Title (EN)" value={quoteData.title_en} onChange={e => setEditingItem({ ...quoteData, title_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea placeholder="Description (TH)" value={quoteData.description_th} onChange={e => setEditingItem({ ...quoteData, description_th: e.target.value })} rows={3} />
                  <Textarea placeholder="Description (EN)" value={quoteData.description_en} onChange={e => setEditingItem({ ...quoteData, description_en: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Button (TH)" value={quoteData.button_th} onChange={e => setEditingItem({ ...quoteData, button_th: e.target.value })} />
                  <Input placeholder="Button (EN)" value={quoteData.button_en} onChange={e => setEditingItem({ ...quoteData, button_en: e.target.value })} />
                </div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={quoteData.is_active} onChange={e => setEditingItem({ ...quoteData, is_active: e.target.checked })} />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            ) : (
              <div>
                <div className="font-medium text-slate-900 flex items-center gap-2">
                  {quote.title_th} / {quote.title_en}
                  {quote.is_active && <CheckCircle className="h-4 w-4 text-cyan-500" aria-label="Active" />}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {quote.description_th.substring(0, 100)}...
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Button: {quote.button_th} / {quote.button_en}
                </div>
                {quote.is_active && <div className="text-xs text-cyan-600 font-semibold mt-1">Active</div>}
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
                {!quote.is_active && <Button size="sm" variant="outline" onClick={() => handleSetActive(quote.id)}>Set Active</Button>}
                <Button size="sm" variant="outline" onClick={() => setEditingItem(quote)}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(quote.id)}><Trash2 className="h-4 w-4" /></Button>
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
            <h1 className="text-2xl font-bold text-slate-900">Quote Management</h1>
            <p className="text-gray-600">Manage homepage quote (TH/EN)</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </div>
        {isAdding ? (
          <Card className="mb-6">
            <CardHeader><CardTitle>Add New Quote</CardTitle></CardHeader>
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
                <Input placeholder="Button (TH)" value={newItem.button_th} onChange={e => setNewItem({ ...newItem, button_th: e.target.value })} />
                <Input placeholder="Button (EN)" value={newItem.button_en} onChange={e => setNewItem({ ...newItem, button_en: e.target.value })} />
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
          <Button onClick={() => setIsAdding(true)} className="mb-6"><Plus className="h-4 w-4 mr-2" />Add Quote</Button>
        )}
        <Card>
          <CardHeader><CardTitle>Quotes</CardTitle></CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No quotes found. Add your first quote above.</div>
            ) : (
              <div className="space-y-2">{quotes.map(renderQuote)}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 