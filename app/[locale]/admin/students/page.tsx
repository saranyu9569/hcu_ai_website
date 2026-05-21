"use client";
import { StudentProject, Publication } from '@/lib';
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, ImagePlus } from "lucide-react";

type GalleryImage = { id: number; image_url: string };

// --- Interfaces ---

export default function AdminStudentsPage() {
  // Tabs
  const [tab, setTab] = useState("projects");

  // Student Projects State
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [projectForm, setProjectForm] = useState<StudentProject>({
    title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), image: "", link: "", is_active: true
  });
  const [editingProject, setEditingProject] = useState<number|null>(null);
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Publications State
  const [publications, setPublications] = useState<Publication[]>([]);
  const [publicationForm, setPublicationForm] = useState<Publication>({
    title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), authors_th: "", authors_en: "", link: "", is_active: true
  });
  const [editingPublication, setEditingPublication] = useState<number|null>(null);

  // --- Fetch Data ---
  useEffect(() => { fetchProjects(); fetchPublications(); }, []);
  const fetchProjects = async () => {
    const res = await fetch("/api/student-projects");
    if (res.ok) setProjects(await res.json());
  };
  const fetchPublications = async () => {
    const res = await fetch("/api/publications");
    if (res.ok) setPublications(await res.json());
  };

  // --- CRUD for Projects ---
  const handleProjectSave = async () => {
    if (editingProject) {
      await fetch("/api/student-projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...projectForm, id: editingProject })
      });
    } else {
      await fetch("/api/student-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm)
      });
    }
    setProjectForm({ title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), image: "", link: "", is_active: true });
    setEditingProject(null);
    fetchProjects();
  };
  const fetchGallery = async (projectId: number) => {
    const res = await fetch(`/api/student-projects/${projectId}/images`);
    if (res.ok) setGalleryImages(await res.json());
  };

  const handleProjectEdit = (p: StudentProject) => {
    setProjectForm(p);
    setEditingProject(p.id!);
    fetchGallery(p.id!);
  };
  const handleProjectDelete = async (id: number) => {
    await fetch(`/api/student-projects?id=${id}`, { method: "DELETE" });
    fetchProjects();
  };
  const uploadFile = async (file: File, type = 'student'): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    return data.imagePath ?? null;
  };

  const handleProjectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setProjectImageUploading(true);
    const path = await uploadFile(e.target.files[0]);
    if (path) setProjectForm(f => ({ ...f, image: path }));
    setProjectImageUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProject || !e.target.files?.length) return;
    setGalleryUploading(true);
    for (const file of Array.from(e.target.files)) {
      const path = await uploadFile(file);
      if (path) {
        await fetch(`/api/student-projects/${editingProject}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: path }),
        });
      }
    }
    await fetchGallery(editingProject);
    setGalleryUploading(false);
    e.target.value = '';
  };

  const handleGalleryDelete = async (imageId: number) => {
    if (!editingProject) return;
    await fetch(`/api/student-projects/${editingProject}/images?imageId=${imageId}`, { method: 'DELETE' });
    setGalleryImages(g => g.filter(i => i.id !== imageId));
  };

  // --- CRUD for Publications ---
  const handlePublicationSave = async () => {
    if (editingPublication) {
      await fetch("/api/publications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...publicationForm, id: editingPublication })
      });
    } else {
      await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publicationForm)
      });
    }
    setPublicationForm({ title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), authors_th: "", authors_en: "", link: "", is_active: true });
    setEditingPublication(null);
    fetchPublications();
  };
  const handlePublicationEdit = (p: Publication) => {
    setPublicationForm(p);
    setEditingPublication(p.id!);
  };
  const handlePublicationDelete = async (id: number) => {
    await fetch(`/api/publications?id=${id}`, { method: "DELETE" });
    fetchPublications();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Student Projects & Publications Management</h1>
        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="projects">Student Projects</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <Card className="mb-6">
              <CardHeader><CardTitle>{editingProject ? "Edit Project" : "Add Project"}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Title (TH)" value={projectForm.title_th} onChange={e => setProjectForm(f => ({ ...f, title_th: e.target.value }))} />
                  <Input placeholder="Title (EN)" value={projectForm.title_en} onChange={e => setProjectForm(f => ({ ...f, title_en: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea placeholder="Description (TH)" value={projectForm.description_th} onChange={e => setProjectForm(f => ({ ...f, description_th: e.target.value }))} />
                  <Textarea placeholder="Description (EN)" value={projectForm.description_en} onChange={e => setProjectForm(f => ({ ...f, description_en: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" placeholder="Year" value={projectForm.year} onChange={e => setProjectForm(f => ({ ...f, year: parseInt(e.target.value) }))} />
                  <Input placeholder="Link" value={projectForm.link} onChange={e => setProjectForm(f => ({ ...f, link: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Cover Image</p>
                    <Input type="file" accept="image/*" onChange={handleProjectImage} />
                    {projectImageUploading && <div className="flex items-center gap-2 text-slate-500 text-xs mt-1"><Loader2 className="w-3 h-3 animate-spin" />Uploading…</div>}
                    {projectForm.image && <img src={projectForm.image} alt="Preview" className="h-24 mt-2 rounded object-cover" />}
                  </div>
                  <label className="flex items-center gap-2 mt-6">
                    <input type="checkbox" checked={projectForm.is_active} onChange={e => setProjectForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                  </label>
                </div>

                {/* Gallery Images — only available when editing an existing project */}
                {editingProject && (
                  <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <ImagePlus className="w-4 h-4" />
                        Gallery Images
                      </p>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-700 transition-colors">
                        {galleryUploading
                          ? <><Loader2 className="w-3 h-3 animate-spin" />Uploading…</>
                          : <><ImagePlus className="w-3 h-3" />Add Images</>}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleGalleryUpload}
                          disabled={galleryUploading}
                        />
                      </label>
                    </div>

                    {galleryImages.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No gallery images yet. Upload some above.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {galleryImages.map(img => (
                          <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden ring-1 ring-slate-200">
                            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => handleGalleryDelete(img.id)}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400">Gallery images appear in the carousel on the project detail page.</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleProjectSave}>{editingProject ? "Save" : "Add"}</Button>
                  {editingProject && <Button variant="outline" onClick={() => { setEditingProject(null); setProjectForm({ title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), image: "", link: "", is_active: true }); setGalleryImages([]); }}>Cancel</Button>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>All Student Projects</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Title (TH)</th>
                        <th className="p-2 border">Title (EN)</th>
                        <th className="p-2 border">Year</th>
                        <th className="p-2 border">Active</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p.id} className="border-b">
                          <td className="p-2 border">{p.title_th}</td>
                          <td className="p-2 border">{p.title_en}</td>
                          <td className="p-2 border">{p.year}</td>
                          <td className="p-2 border text-center">{p.is_active ? '✔️' : ''}</td>
                          <td className="p-2 border flex gap-2">
                            <Button size="sm" onClick={() => handleProjectEdit(p)}>Edit</Button>
                            <Button size="sm" variant="outline" onClick={() => handleProjectDelete(p.id!)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="publications">
            <Card className="mb-6">
              <CardHeader><CardTitle>{editingPublication ? "Edit Publication" : "Add Publication"}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Title (TH)" value={publicationForm.title_th} onChange={e => setPublicationForm(f => ({ ...f, title_th: e.target.value }))} />
                  <Input placeholder="Title (EN)" value={publicationForm.title_en} onChange={e => setPublicationForm(f => ({ ...f, title_en: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea placeholder="Description (TH)" value={publicationForm.description_th} onChange={e => setPublicationForm(f => ({ ...f, description_th: e.target.value }))} />
                  <Textarea placeholder="Description (EN)" value={publicationForm.description_en} onChange={e => setPublicationForm(f => ({ ...f, description_en: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" placeholder="Year" value={publicationForm.year} onChange={e => setPublicationForm(f => ({ ...f, year: parseInt(e.target.value) }))} />
                  <Input placeholder="Authors (TH)" value={publicationForm.authors_th} onChange={e => setPublicationForm(f => ({ ...f, authors_th: e.target.value }))} />
                  <Input placeholder="Authors (EN)" value={publicationForm.authors_en} onChange={e => setPublicationForm(f => ({ ...f, authors_en: e.target.value }))} />
                  <Input placeholder="Link" value={publicationForm.link} onChange={e => setPublicationForm(f => ({ ...f, link: e.target.value }))} />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={publicationForm.is_active} onChange={e => setPublicationForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                </label>
                <div className="flex gap-2">
                  <Button onClick={handlePublicationSave}>{editingPublication ? "Save" : "Add"}</Button>
                  {editingPublication && <Button variant="outline" onClick={() => { setEditingPublication(null); setPublicationForm({ title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), authors_th: "", authors_en: "", link: "", is_active: true }); }}>Cancel</Button>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>All Publications</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Title (TH)</th>
                        <th className="p-2 border">Title (EN)</th>
                        <th className="p-2 border">Year</th>
                        <th className="p-2 border">Active</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {publications.map((p) => (
                        <tr key={p.id} className="border-b">
                          <td className="p-2 border">{p.title_th}</td>
                          <td className="p-2 border">{p.title_en}</td>
                          <td className="p-2 border">{p.year}</td>
                          <td className="p-2 border text-center">{p.is_active ? '✔️' : ''}</td>
                          <td className="p-2 border flex gap-2">
                            <Button size="sm" onClick={() => handlePublicationEdit(p)}>Edit</Button>
                            <Button size="sm" variant="outline" onClick={() => handlePublicationDelete(p.id!)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 