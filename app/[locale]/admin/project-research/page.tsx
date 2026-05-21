"use client";
import { AuthorAdvisor, StudentProject, Publication } from '@/lib';
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- Interfaces ---

export default function AdminStudentsPage() {
  // Tabs
  const [tab, setTab] = useState("projects");

  // Student Projects State
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [projectForm, setProjectForm] = useState<StudentProject>({
    title_th: "", title_en: "", course: "", details_th: "", details_en: "", year: new Date().getFullYear(), image: "", link: "", is_active: true, authors: [{ name_th: "", name_en: "" }], advisors: [{ name_th: "", name_en: "" }]
  });
  const [editingProject, setEditingProject] = useState<number|null>(null);
  const [projectImageUploading, setProjectImageUploading] = useState(false);

  // Publications State
  const [publications, setPublications] = useState<Publication[]>([]);
  const [publicationForm, setPublicationForm] = useState<Publication>({
    title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), authors: [{ name_th: "", name_en: "" }], keywords: [], published_at: "", link: "", is_active: true
  });
  const [newKeyword, setNewKeyword] = useState("");
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
    setProjectForm({ title_th: "", title_en: "", course: "", details_th: "", details_en: "", year: new Date().getFullYear(), image: "", link: "", is_active: true, authors: [{ name_th: "", name_en: "" }], advisors: [{ name_th: "", name_en: "" }] });
    setEditingProject(null);
    fetchProjects();
  };
  const handleProjectEdit = (p: StudentProject) => {
    setProjectForm({ ...p, authors: p.authors?.length ? p.authors : [{ name_th: "", name_en: "" }], advisors: p.advisors?.length ? p.advisors : [{ name_th: "", name_en: "" }] });
    setEditingProject(p.id!);
  };
  const handleProjectDelete = async (id: number) => {
    await fetch(`/api/student-projects?id=${id}`, { method: "DELETE" });
    fetchProjects();
  };
  // Image upload for project
  const handleProjectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setProjectImageUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'course'); // or 'news' or other folder if needed
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data && data.imagePath) {
      setProjectForm(f => ({ ...f, image: data.imagePath }));
    }
      setProjectImageUploading(false);
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
    setPublicationForm({ title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), authors: [{ name_th: "", name_en: "" }], keywords: [], published_at: "", link: "", is_active: true });
    setEditingPublication(null);
    fetchPublications();
  };
  const handlePublicationEdit = (p: Publication) => {
    setPublicationForm({ ...p, authors: p.authors?.length ? p.authors : [{ name_th: "", name_en: "" }], keywords: p.keywords || [] });
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
                  <Input placeholder="ชื่อโครงงาน (TH)" value={projectForm.title_th} onChange={e => setProjectForm(f => ({ ...f, title_th: e.target.value }))} />
                  <Input placeholder="Project Title (EN)" value={projectForm.title_en} onChange={e => setProjectForm(f => ({ ...f, title_en: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="รายวิชา (Course)" value={projectForm.course} onChange={e => setProjectForm(f => ({ ...f, course: e.target.value }))} />
                  <Input placeholder="Link" value={projectForm.link} onChange={e => setProjectForm(f => ({ ...f, link: e.target.value }))} />
                </div>
                {/* Dynamic Authors */}
                <div>
                  <div className="font-semibold mb-1">ผู้จัดทำ (Authors)</div>
                  {projectForm.authors!.map((author, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input placeholder="ชื่อ (TH)" value={author.name_th} onChange={e => setProjectForm(f => ({ ...f, authors: f.authors!.map((a, i) => i === idx ? { ...a, name_th: e.target.value } : a) }))} />
                      <Input placeholder="Name (EN)" value={author.name_en} onChange={e => setProjectForm(f => ({ ...f, authors: f.authors!.map((a, i) => i === idx ? { ...a, name_en: e.target.value } : a) }))} />
                      <Button type="button" variant="outline" onClick={() => setProjectForm(f => ({ ...f, authors: f.authors!.filter((_, i) => i !== idx) }))} disabled={projectForm.authors!.length === 1}>-</Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" onClick={() => setProjectForm(f => ({ ...f, authors: [...f.authors!, { name_th: "", name_en: "" }] }))}>+ Add Author</Button>
                </div>
                {/* Dynamic Advisors */}
                <div>
                  <div className="font-semibold mb-1 mt-4">ที่ปรึกษา (Advisors)</div>
                  {projectForm.advisors!.map((advisor, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input placeholder="ชื่อ (TH)" value={advisor.name_th} onChange={e => setProjectForm(f => ({ ...f, advisors: f.advisors!.map((a, i) => i === idx ? { ...a, name_th: e.target.value } : a) }))} />
                      <Input placeholder="Name (EN)" value={advisor.name_en} onChange={e => setProjectForm(f => ({ ...f, advisors: f.advisors!.map((a, i) => i === idx ? { ...a, name_en: e.target.value } : a) }))} />
                      <Button type="button" variant="outline" onClick={() => setProjectForm(f => ({ ...f, advisors: f.advisors!.filter((_, i) => i !== idx) }))} disabled={projectForm.advisors!.length === 1}>-</Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" onClick={() => setProjectForm(f => ({ ...f, advisors: [...f.advisors!, { name_th: "", name_en: "" }] }))}>+ Add Advisor</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Textarea placeholder="รายละเอียด (TH)" value={projectForm.details_th} onChange={e => setProjectForm(f => ({ ...f, details_th: e.target.value }))} />
                  <Textarea placeholder="Details (EN)" value={projectForm.details_en} onChange={e => setProjectForm(f => ({ ...f, details_en: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <Input type="file" accept="image/*" onChange={handleProjectImage} />
                    {projectImageUploading && <div className="text-cyan-600">Uploading...</div>}
                    {projectForm.image && <img src={projectForm.image} alt="Preview" className="h-24 mt-2 rounded" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Year</label>
                    <select
                      className="border rounded px-2 py-1"
                      value={projectForm.year}
                      onChange={e => setProjectForm(f => ({ ...f, year: parseInt(e.target.value) }))}
                    >
                      {Array.from({ length: 30 }).map((_, i) => {
                        const y = new Date().getFullYear() - i;
                        return (<option key={y} value={y}>{y}</option>);
                      })}
                    </select>
                    <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={projectForm.is_active} onChange={e => setProjectForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                  </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleProjectSave}>{editingProject ? "Save" : "Add"}</Button>
                  {editingProject && <Button variant="outline" onClick={() => { setEditingProject(null); setProjectForm({ title_th: "", title_en: "", course: "", details_th: "", details_en: "", year: new Date().getFullYear(), image: "", link: "", is_active: true, authors: [{ name_th: "", name_en: "" }], advisors: [{ name_th: "", name_en: "" }] }); }}>Cancel</Button>}
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
                  <Input placeholder="Published at (conference/journal)" value={publicationForm.published_at} onChange={e => setPublicationForm(f => ({ ...f, published_at: e.target.value }))} />
                </div>
                {/* Dynamic Authors */}
                <div>
                  <div className="font-semibold mb-1">Authors</div>
                  {publicationForm.authors!.map((author, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input placeholder="ชื่อ (TH)" value={author.name_th} onChange={e => setPublicationForm(f => ({ ...f, authors: f.authors!.map((a, i) => i === idx ? { ...a, name_th: e.target.value } : a) }))} />
                      <Input placeholder="Name (EN)" value={author.name_en} onChange={e => setPublicationForm(f => ({ ...f, authors: f.authors!.map((a, i) => i === idx ? { ...a, name_en: e.target.value } : a) }))} />
                      <Button type="button" variant="outline" onClick={() => setPublicationForm(f => ({ ...f, authors: f.authors!.filter((_, i) => i !== idx) }))} disabled={publicationForm.authors!.length === 1}>-</Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" onClick={() => setPublicationForm(f => ({ ...f, authors: [...f.authors!, { name_th: "", name_en: "" }] }))}>+ Add Author</Button>
                </div>
                {/* Keywords */}
                <div className="mb-2 mt-2">
                  <div className="font-semibold mb-1">Keywords</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {publicationForm.keywords!.map((kw, idx) => (
                      <span key={idx} className="bg-cyan-100 text-cyan-800 border-cyan-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {kw}
                        <button type="button" onClick={() => setPublicationForm(f => ({ ...f, keywords: f.keywords!.filter((_, i) => i !== idx) }))} className="ml-1 text-cyan-600 hover:text-red-600">×</button>
                      </span>
                    ))}
                    <Input
                      className="w-32"
                      placeholder="Add keyword"
                      value={newKeyword}
                      onChange={e => setNewKeyword(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newKeyword.trim()) {
                          setPublicationForm(f => ({ ...f, keywords: [...f.keywords!, newKeyword.trim()] }));
                          setNewKeyword("");
                          e.preventDefault();
                        }
                      }}
                      onBlur={() => {
                        if (newKeyword.trim()) {
                          setPublicationForm(f => ({ ...f, keywords: [...f.keywords!, newKeyword.trim()] }));
                          setNewKeyword("");
                        }
                      }}
                    />
                  </div>
                </div>
                <Input placeholder="Link" value={publicationForm.link} onChange={e => setPublicationForm(f => ({ ...f, link: e.target.value }))} />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={publicationForm.is_active} onChange={e => setPublicationForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                </label>
                <div className="flex gap-2">
                  <Button onClick={handlePublicationSave}>{editingPublication ? "Save" : "Add"}</Button>
                  {editingPublication && <Button variant="outline" onClick={() => { setEditingPublication(null); setPublicationForm({ title_th: "", title_en: "", description_th: "", description_en: "", year: new Date().getFullYear(), authors: [{ name_th: "", name_en: "" }], keywords: [], published_at: "", link: "", is_active: true }); }}>Cancel</Button>}
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