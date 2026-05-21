'use client';
import { FooterLink, FooterSocial, FooterContact } from '@/lib';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function FooterAdminPage() {
  const router = useRouter();
  // Links
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [newLink, setNewLink] = useState<any>({ name_th: '', name_en: '', href: '', sort_order: 1, is_active: true });
  // Social
  const [socials, setSocials] = useState<FooterSocial[]>([]);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingSocial, setEditingSocial] = useState<FooterSocial | null>(null);
  const [newSocial, setNewSocial] = useState<any>({ icon: '', href: '', sort_order: 1, is_active: true });
  // Contact
  const [contacts, setContacts] = useState<FooterContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<FooterContact | null>(null);
  const [newContact, setNewContact] = useState<any>({ type: '', value_th: '', value_en: '', sort_order: 1, is_active: true });

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    fetchLinks(); fetchSocials(); fetchContacts();
  };
  const fetchLinks = async () => {
    const res = await fetch('/api/admin/footer/links');
    if (res.ok) setLinks(await res.json());
  };
  const fetchSocials = async () => {
    const res = await fetch('/api/admin/footer/social');
    if (res.ok) setSocials(await res.json());
  };
  const fetchContacts = async () => {
    const res = await fetch('/api/admin/footer/contact');
    if (res.ok) setContacts(await res.json());
  };

  // --- Links ---
  const handleAddLink = async () => {
    const res = await fetch('/api/admin/footer/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newLink) });
    if (res.ok) { setNewLink({ name_th: '', name_en: '', href: '', sort_order: 1, is_active: true }); setIsAddingLink(false); fetchLinks(); }
  };
  const handleEditLink = async () => {
    if (!editingLink) return;
    const res = await fetch(`/api/admin/footer/links/${editingLink.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingLink) });
    if (res.ok) { setEditingLink(null); fetchLinks(); }
  };
  const handleDeleteLink = async (id: number) => {
    if (!confirm('Delete this link?')) return;
    const res = await fetch(`/api/admin/footer/links/${id}`, { method: 'DELETE' });
    if (res.ok) fetchLinks();
  };

  // --- Social ---
  const handleAddSocial = async () => {
    const res = await fetch('/api/admin/footer/social', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newSocial) });
    if (res.ok) { setNewSocial({ icon: '', href: '', sort_order: 1, is_active: true }); setIsAddingSocial(false); fetchSocials(); }
  };
  const handleEditSocial = async () => {
    if (!editingSocial) return;
    const res = await fetch(`/api/admin/footer/social/${editingSocial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingSocial) });
    if (res.ok) { setEditingSocial(null); fetchSocials(); }
  };
  const handleDeleteSocial = async (id: number) => {
    if (!confirm('Delete this social?')) return;
    const res = await fetch(`/api/admin/footer/social/${id}`, { method: 'DELETE' });
    if (res.ok) fetchSocials();
  };

  // --- Contact ---
  const handleAddContact = async () => {
    const res = await fetch('/api/admin/footer/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newContact) });
    if (res.ok) { setNewContact({ type: '', value_th: '', value_en: '', sort_order: 1, is_active: true }); setIsAddingContact(false); fetchContacts(); }
  };
  const handleEditContact = async () => {
    if (!editingContact) return;
    const res = await fetch(`/api/admin/footer/contact/${editingContact.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingContact) });
    if (res.ok) { setEditingContact(null); fetchContacts(); }
  };
  const handleDeleteContact = async (id: number) => {
    if (!confirm('Delete this contact?')) return;
    const res = await fetch(`/api/admin/footer/contact/${id}`, { method: 'DELETE' });
    if (res.ok) fetchContacts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Footer Management</h1>
            <p className="text-gray-600">Manage footer quick links, social, and contact info (TH/EN)</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </div>
        {/* Quick Links */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
          <CardContent>
            {isAddingLink ? (
              <div className="mb-4 flex flex-col gap-2">
                <Input placeholder="Name (TH)" value={newLink.name_th} onChange={e => setNewLink({ ...newLink, name_th: e.target.value })} />
                <Input placeholder="Name (EN)" value={newLink.name_en} onChange={e => setNewLink({ ...newLink, name_en: e.target.value })} />
                <Input placeholder="URL" value={newLink.href} onChange={e => setNewLink({ ...newLink, href: e.target.value })} />
                <Input type="number" placeholder="Sort Order" value={newLink.sort_order} onChange={e => setNewLink({ ...newLink, sort_order: parseInt(e.target.value) })} />
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={newLink.is_active} onChange={e => setNewLink({ ...newLink, is_active: e.target.checked })} />
                  <span className="text-sm">Active</span>
                </label>
                <div className="flex gap-2">
                  <Button onClick={handleAddLink}>Save</Button>
                  <Button variant="outline" onClick={() => setIsAddingLink(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAddingLink(true)} className="mb-4"><Plus className="h-4 w-4 mr-2" />Add Link</Button>
            )}
            {links.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No links found.</div>
            ) : (
              <div className="space-y-2">
                {links.map(link => (
                  <div key={link.id} className={`border rounded p-2 flex items-center justify-between ${link.is_active ? 'border-cyan-500' : ''}`}>
                    {editingLink?.id === link.id ? (
                      <div className="flex-1 flex flex-col gap-1">
                        <Input placeholder="Name (TH)" value={editingLink.name_th} onChange={e => setEditingLink({ ...editingLink, name_th: e.target.value })} />
                        <Input placeholder="Name (EN)" value={editingLink.name_en} onChange={e => setEditingLink({ ...editingLink, name_en: e.target.value })} />
                        <Input placeholder="URL" value={editingLink.href} onChange={e => setEditingLink({ ...editingLink, href: e.target.value })} />
                        <Input type="number" placeholder="Sort Order" value={editingLink.sort_order} onChange={e => setEditingLink({ ...editingLink, sort_order: parseInt(e.target.value) })} />
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={editingLink.is_active} onChange={e => setEditingLink({ ...editingLink, is_active: e.target.checked })} />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className="font-medium">{link.name_th} / {link.name_en}</span>
                        <span className="ml-2 text-xs text-gray-500">{link.href}</span>
                        <span className="ml-2 text-xs text-gray-500">Order: {link.sort_order}</span>
                        {link.is_active && <CheckCircle className="h-3 w-3 text-cyan-500 inline ml-2" aria-label="Active" />}
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-2">
                      {editingLink?.id === link.id ? (
                        <>
                          <Button size="sm" onClick={handleEditLink}><Save className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingLink(null)}><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingLink(link)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteLink(link.id)}><Trash2 className="h-4 w-4" /></Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Social Media */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
          <CardContent>
            {isAddingSocial ? (
              <div className="mb-4 flex flex-col gap-2">
                <Input placeholder="Icon (facebook, instagram, youtube, etc.)" value={newSocial.icon} onChange={e => setNewSocial({ ...newSocial, icon: e.target.value })} />
                <Input placeholder="URL" value={newSocial.href} onChange={e => setNewSocial({ ...newSocial, href: e.target.value })} />
                <Input type="number" placeholder="Sort Order" value={newSocial.sort_order} onChange={e => setNewSocial({ ...newSocial, sort_order: parseInt(e.target.value) })} />
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={newSocial.is_active} onChange={e => setNewSocial({ ...newSocial, is_active: e.target.checked })} />
                  <span className="text-sm">Active</span>
                </label>
                <div className="flex gap-2">
                  <Button onClick={handleAddSocial}>Save</Button>
                  <Button variant="outline" onClick={() => setIsAddingSocial(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAddingSocial(true)} className="mb-4"><Plus className="h-4 w-4 mr-2" />Add Social</Button>
            )}
            {socials.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No social found.</div>
            ) : (
              <div className="space-y-2">
                {socials.map(social => (
                  <div key={social.id} className={`border rounded p-2 flex items-center justify-between ${social.is_active ? 'border-cyan-500' : ''}`}>
                    {editingSocial?.id === social.id ? (
                      <div className="flex-1 flex flex-col gap-1">
                        <Input placeholder="Icon" value={editingSocial.icon} onChange={e => setEditingSocial({ ...editingSocial, icon: e.target.value })} />
                        <Input placeholder="URL" value={editingSocial.href} onChange={e => setEditingSocial({ ...editingSocial, href: e.target.value })} />
                        <Input type="number" placeholder="Sort Order" value={editingSocial.sort_order} onChange={e => setEditingSocial({ ...editingSocial, sort_order: parseInt(e.target.value) })} />
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={editingSocial.is_active} onChange={e => setEditingSocial({ ...editingSocial, is_active: e.target.checked })} />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className="font-medium">{social.icon}</span>
                        <span className="ml-2 text-xs text-gray-500">{social.href}</span>
                        <span className="ml-2 text-xs text-gray-500">Order: {social.sort_order}</span>
                        {social.is_active && <CheckCircle className="h-3 w-3 text-cyan-500 inline ml-2" aria-label="Active" />}
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-2">
                      {editingSocial?.id === social.id ? (
                        <>
                          <Button size="sm" onClick={handleEditSocial}><Save className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingSocial(null)}><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingSocial(social)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteSocial(social.id)}><Trash2 className="h-4 w-4" /></Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Contact Info */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
          <CardContent>
            {isAddingContact ? (
              <div className="mb-4 flex flex-col gap-2">
                <Input placeholder="Type (address, phone, email)" value={newContact.type} onChange={e => setNewContact({ ...newContact, type: e.target.value })} />
                <Input placeholder="Value (TH)" value={newContact.value_th} onChange={e => setNewContact({ ...newContact, value_th: e.target.value })} />
                <Input placeholder="Value (EN)" value={newContact.value_en} onChange={e => setNewContact({ ...newContact, value_en: e.target.value })} />
                <Input type="number" placeholder="Sort Order" value={newContact.sort_order} onChange={e => setNewContact({ ...newContact, sort_order: parseInt(e.target.value) })} />
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={newContact.is_active} onChange={e => setNewContact({ ...newContact, is_active: e.target.checked })} />
                  <span className="text-sm">Active</span>
                </label>
                <div className="flex gap-2">
                  <Button onClick={handleAddContact}>Save</Button>
                  <Button variant="outline" onClick={() => setIsAddingContact(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAddingContact(true)} className="mb-4"><Plus className="h-4 w-4 mr-2" />Add Contact</Button>
            )}
            {contacts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No contact found.</div>
            ) : (
              <div className="space-y-2">
                {contacts.map(contact => (
                  <div key={contact.id} className={`border rounded p-2 flex items-center justify-between ${contact.is_active ? 'border-cyan-500' : ''}`}>
                    {editingContact?.id === contact.id ? (
                      <div className="flex-1 flex flex-col gap-1">
                        <Input placeholder="Type" value={editingContact.type} onChange={e => setEditingContact({ ...editingContact, type: e.target.value })} />
                        <Input placeholder="Value (TH)" value={editingContact.value_th} onChange={e => setEditingContact({ ...editingContact, value_th: e.target.value })} />
                        <Input placeholder="Value (EN)" value={editingContact.value_en} onChange={e => setEditingContact({ ...editingContact, value_en: e.target.value })} />
                        <Input type="number" placeholder="Sort Order" value={editingContact.sort_order} onChange={e => setEditingContact({ ...editingContact, sort_order: parseInt(e.target.value) })} />
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={editingContact.is_active} onChange={e => setEditingContact({ ...editingContact, is_active: e.target.checked })} />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className="font-medium">{contact.type}</span>
                        <span className="ml-2 text-xs text-gray-500">{contact.value_th} / {contact.value_en}</span>
                        <span className="ml-2 text-xs text-gray-500">Order: {contact.sort_order}</span>
                        {contact.is_active && <CheckCircle className="h-3 w-3 text-cyan-500 inline ml-2" aria-label="Active" />}
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-2">
                      {editingContact?.id === contact.id ? (
                        <>
                          <Button size="sm" onClick={handleEditContact}><Save className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingContact(null)}><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingContact(contact)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteContact(contact.id)}><Trash2 className="h-4 w-4" /></Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 