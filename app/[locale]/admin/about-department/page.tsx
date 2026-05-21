"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectItem } from '@/components/ui/select';

export default function AdminAboutDepartmentPage() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [faculty, setFaculty] = useState<any[]>([]);
  const [facility, setFacility] = useState<any[]>([]);
  const [facultyForm, setFacultyForm] = useState<any>({});
  const [facilityForm, setFacilityForm] = useState<any>({});
  const [editingFaculty, setEditingFaculty] = useState<number|null>(null);
  const [editingFacility, setEditingFacility] = useState<number|null>(null);
  const [eduInputs, setEduInputs] = useState([{ degree: '', program: '', university: '' }]);
  const [academicWorksInputs, setAcademicWorksInputs] = useState([{ title_th: '', title_en: '', description_th: '', description_en: '', year: '' }]);
  const facultyImageInputRef = useRef<HTMLInputElement>(null);
  const facilityImageInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number; zoom: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [facultyImageUploading, setFacultyImageUploading] = useState(false);
  const [facultyImageError, setFacultyImageError] = useState("");
  const [facilityImageUploading, setFacilityImageUploading] = useState(false);
  const [facilityImageError, setFacilityImageError] = useState("");

  // Load data from database
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/about-department');
      const data = await res.json();
      
      if (data.about && data.about.length > 0) {
        setForm(data.about[0]);
      }
      setFaculty(data.faculty || []);
      setFacility(data.facilities || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFacultyChange = (e: any) => setFacultyForm({ ...facultyForm, [e.target.name]: e.target.value });
  const handleFacilityChange = (e: any) => setFacilityForm({ ...facilityForm, [e.target.name]: e.target.value });

  // Image upload handlers
  const handleFacultyImageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setFacultyImageError("");
    setFacultyImageUploading(true);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "faculty");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.imagePath) {
      setFacultyForm((f: any) => ({ ...f, image: data.imagePath }));
    } else {
      setFacultyImageError(data.error || "Upload failed");
    }
    setFacultyImageUploading(false);
  };

  const handleFacultyImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFacultyImageError("");
    setFacultyImageUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", "faculty");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.imagePath) {
      setFacultyForm((f: any) => ({ ...f, image: data.imagePath }));
    } else {
      setFacultyImageError(data.error || "Upload failed");
    }
    setFacultyImageUploading(false);
  };

  const handleFacultyImageDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const zoom = dragStateRef.current.zoom;
    const dx = ((e.clientX - dragStateRef.current.startX) / rect.width) * 100 / zoom;
    const dy = ((e.clientY - dragStateRef.current.startY) / rect.height) * 100 / zoom;
    const newX = Math.round(Math.min(100, Math.max(0, dragStateRef.current.startPosX - dx)));
    const newY = Math.round(Math.min(100, Math.max(0, dragStateRef.current.startPosY - dy)));
    setFacultyForm((f: any) => ({ ...f, x: newX, y: newY }));
  }, []);

  const handleDragEnd = useCallback(() => {
    dragStateRef.current = null;
    setIsDragging(false);
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  }, [handleDragMove]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: facultyForm.x ?? 50,
      startPosY: facultyForm.y ?? 50,
      zoom: facultyForm.zoom ?? 1,
    };
    setIsDragging(true);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }, [facultyForm.x, facultyForm.y, facultyForm.zoom, handleDragMove, handleDragEnd]);

  const handleFacilityImageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setFacilityImageError("");
    setFacilityImageUploading(true);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "facilities");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.imagePath) {
      setFacilityForm((f: any) => ({ ...f, image: data.imagePath }));
    } else {
      setFacilityImageError(data.error || "Upload failed");
    }
    setFacilityImageUploading(false);
  };

  const handleFacilityImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFacilityImageError("");
    setFacilityImageUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", "facilities");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.imagePath) {
      setFacilityForm((f: any) => ({ ...f, image: data.imagePath }));
    } else {
      setFacilityImageError(data.error || "Upload failed");
    }
    setFacilityImageUploading(false);
  };

  const handleFacilityImageDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  // Faculty CRUD operations
  const handleEditFaculty = (f: any) => {
    setEditingFaculty(f.id);
    setFacultyForm(f);
    setEduInputs(f.education?.map((edu: any) => ({ degree: edu.degree, program: edu.program, university: edu.university })) || []);
    setAcademicWorksInputs(f.academic_works?.map((work: any) => ({ 
      title_th: work.title_th, 
      title_en: work.title_en, 
      description_th: work.description_th, 
      description_en: work.description_en, 
      year: work.year?.toString() || '' 
    })) || []);
  };

  const handleAddFaculty = async () => {
    try {
      const res = await fetch("/api/admin/about-department/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...facultyForm, about_department_id: form.id || 1 })
      });
      
      if (res.ok) {
        const result = await res.json();
        // Find the new faculty in the refreshed list and set as editing
        await fetchData();
        const newFaculty = faculty.find(f => f.id === result.id);
        if (newFaculty) {
          setEditingFaculty(newFaculty.id);
          setFacultyForm(newFaculty);
        } else {
          // fallback: set to the last faculty
          const last = faculty[faculty.length - 1];
          if (last) {
            setEditingFaculty(last.id);
            setFacultyForm(last);
          }
        }
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
    }
  };

  const handleUpdateFaculty = async () => {
    try {
      const res = await fetch("/api/admin/about-department/faculty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facultyForm)
    });
      
      if (res.ok) {
        setEditingFaculty(null);
        setFacultyForm({});
        fetchData();
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
    }
  };

  const handleDeleteFaculty = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/about-department/faculty?id=${id}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  // Facility CRUD operations
  const handleEditFacility = (f: any) => {
    setEditingFacility(f.id);
    setFacilityForm(f);
  };

  const handleAddFacility = async () => {
    try {
      const res = await fetch("/api/admin/about-department/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...facilityForm, about_department_id: form.id || 1 })
      });
      
      if (res.ok) {
        setFacilityForm({});
        setEditingFacility(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error adding facility:', error);
    }
  };

  const handleUpdateFacility = async () => {
    try {
      const res = await fetch("/api/admin/about-department/facilities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facilityForm)
    });
      
      if (res.ok) {
        setEditingFacility(null);
        setFacilityForm({});
        fetchData();
      }
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  const handleDeleteFacility = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/about-department/facilities?id=${id}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  // Education management
  const handleEduInputChange = (idx: number, field: string, value: string) => {
    setEduInputs(inputs => inputs.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleAddEduRow = () => {
    setEduInputs(inputs => [...inputs, { degree: '', program: '', university: '' }]);
  };

  const handleRemoveEduRow = (idx: number) => {
    setEduInputs(inputs => inputs.filter((_, i) => i !== idx));
  };

  const handleSaveAllEducation = async () => {
    if (!editingFaculty) return;
    
    try {
    for (const edu of eduInputs) {
        if (edu.degree || edu.program || edu.university) {
          await fetch("/api/admin/about-department/faculty/education", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...edu, faculty_id: editingFaculty })
        });
      }
    }
      setEduInputs([{ degree: '', program: '', university: '' }]);
      fetchData();
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDeleteEducation = async (id: number) => {
    try {
      await fetch(`/api/admin/about-department/faculty/education?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  // Reorder education
  const handleMoveEducation = async (eduId: number, direction: 'up' | 'down') => {
    if (!editingFaculty) return;
    const facultyObj = faculty.find(f => f.id === editingFaculty);
    if (!facultyObj || !facultyObj.education) return;
    // Always work on a sorted copy
    const list = [...facultyObj.education].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const idx = list.findIndex((e: any) => e.id === eduId);
    if (idx === -1) return;
    let swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    // Move the item in the array
    const moved = list.splice(idx, 1)[0];
    list.splice(swapIdx, 0, moved);
    // Re-assign sort_order and update all
    for (let i = 0; i < list.length; i++) {
      const edu = list[i];
      const payload = {
        id: edu.id,
        degree: edu.degree,
        program: edu.program,
        university: edu.university,
        sort_order: i
      };
      await fetch('/api/admin/about-department/faculty/education', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    fetchData();
  };

  // Academic Works management
  const handleAcademicWorksInputChange = (idx: number, field: string, value: string) => {
    setAcademicWorksInputs(inputs => inputs.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleAddAcademicWorksRow = () => {
    setAcademicWorksInputs(inputs => [...inputs, { title_th: '', title_en: '', description_th: '', description_en: '', year: '' }]);
  };

  const handleRemoveAcademicWorksRow = (idx: number) => {
    setAcademicWorksInputs(inputs => inputs.filter((_, i) => i !== idx));
  };

  const handleSaveAllAcademicWorks = async () => {
    if (!editingFaculty) return;
    
    try {
      for (const work of academicWorksInputs) {
        if (work.title_th || work.title_en) {
          await fetch("/api/admin/about-department/faculty/academic-works", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              ...work, 
              faculty_id: editingFaculty,
              year: work.year ? parseInt(work.year) : null
            })
          });
        }
      }
      setAcademicWorksInputs([{ title_th: '', title_en: '', description_th: '', description_en: '', year: '' }]);
      fetchData();
    } catch (error) {
      console.error('Error saving academic works:', error);
    }
  };

  const handleDeleteAcademicWorks = async (id: number) => {
    try {
      await fetch(`/api/admin/about-department/faculty/academic-works?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting academic works:', error);
    }
  };

  // Save about department
  const handleSave = async () => {
    try {
    setSaving(true);
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch("/api/admin/about-department", {
        method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
      
      if (res.ok) {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    if (phone.startsWith('+66')) return `(+66) ${phone.slice(3)}`;
    return phone;
  };

  const DEGREE_OPTIONS = [
    { value: 'doctoral', label: 'ปริญญาเอก (Doctoral)' },
    { value: 'master', label: 'ปริญญาโท (Master)' },
    { value: 'bachelor', label: 'ปริญญาตรี (Bachelor)' },
    { value: 'other', label: 'อื่นๆ (Other)' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin: About Department</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-16">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-4 bg-gray-200 p-1 rounded-2">
            <TabsTrigger value="overview" className="rounded-2 data-[state=active]:bg-white data-[state=active]:shadow-md">Overview</TabsTrigger>
            <TabsTrigger value="mission" className="rounded-2 data-[state=active]:bg-white data-[state=active]:shadow-md">Mission & Vision</TabsTrigger>
            <TabsTrigger value="faculty" className="rounded-2 data-[state=active]:bg-white data-[state=active]:shadow-md">Faculty Member</TabsTrigger>
            <TabsTrigger value="facilities" className="rounded-2 data-[state=active]:bg-white data-[state=active]:shadow-md">Facilities</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-16">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input name="overview_title_th" value={form.overview_title_th || ""} onChange={handleChange} placeholder="หัวข้อ (TH)" className="mb-2" />
                    <Textarea name="overview_description_th" value={form.overview_description_th || ""} onChange={handleChange} placeholder="รายละเอียด (TH)" className="mb-2" />
                  </div>
                  <div>
                    <Input name="overview_title_en" value={form.overview_title_en || ""} onChange={handleChange} placeholder="Title (EN)" className="mb-2" />
                    <Textarea name="overview_description_en" value={form.overview_description_en || ""} onChange={handleChange} placeholder="Description (EN)" className="mb-2" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                  {success && <span className="text-green-600">Saved!</span>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mission" className="space-y-16">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-2">Mission & Vision</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input name="mission_title_th" value={form.mission_title_th || ""} onChange={handleChange} placeholder="หัวข้อพันธกิจ (TH)" className="mb-2" />
                    <Textarea name="mission_description_th" value={form.mission_description_th || ""} onChange={handleChange} placeholder="รายละเอียดพันธกิจ (TH)" className="mb-2" />
                    <Input name="vision_title_th" value={form.vision_title_th || ""} onChange={handleChange} placeholder="หัวข้อวิสัยทัศน์ (TH)" className="mb-2" />
                    <Textarea name="vision_description_th" value={form.vision_description_th || ""} onChange={handleChange} placeholder="รายละเอียดวิสัยทัศน์ (TH)" className="mb-2" />
                  </div>
                  <div>
                    <Input name="mission_title_en" value={form.mission_title_en || ""} onChange={handleChange} placeholder="Mission Title (EN)" className="mb-2" />
                    <Textarea name="mission_description_en" value={form.mission_description_en || ""} onChange={handleChange} placeholder="Mission Description (EN)" className="mb-2" />
                    <Input name="vision_title_en" value={form.vision_title_en || ""} onChange={handleChange} placeholder="Vision Title (EN)" className="mb-2" />
                    <Textarea name="vision_description_en" value={form.vision_description_en || ""} onChange={handleChange} placeholder="Vision Description (EN)" className="mb-2" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                  {success && <span className="text-green-600">Saved!</span>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="faculty" className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  {editingFaculty === null ? "Add Faculty Member" : "Edit Faculty Member"}
                </h2>

                <div className="flex flex-col xl:flex-row gap-8">

                  {/* ── Left: Input form ─────────────────────────────── */}
                  <div className="flex-1 min-w-0 space-y-4">

                    {/* Names */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">ชื่อ (TH)</label>
                        <Input name="name_th" value={facultyForm.name_th || ""} onChange={handleFacultyChange} placeholder="ชื่อ-นามสกุล" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Name (EN)</label>
                        <Input name="name_en" value={facultyForm.name_en || ""} onChange={handleFacultyChange} placeholder="Full name" />
                      </div>
                    </div>

                    {/* Roles */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">ตำแหน่ง (TH)</label>
                        <Input name="role_th" value={facultyForm.role_th || ""} onChange={handleFacultyChange} placeholder="ตำแหน่ง" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Role (EN)</label>
                        <Input name="role_en" value={facultyForm.role_en || ""} onChange={handleFacultyChange} placeholder="Position" />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Email</label>
                        <Input name="email" value={facultyForm.email || ""} onChange={handleFacultyChange} placeholder="email@hcu.ac.th" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Phone</label>
                        <div className="flex">
                          <span className="flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-50 text-slate-500 text-sm select-none">
                            +66
                          </span>
                          <Input
                            value={(facultyForm.phone || '').replace(/^\+66/, '')}
                            onChange={e => setFacultyForm((f: any) => ({ ...f, phone: '+66' + e.target.value }))}
                            placeholder="91-713-4910"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">Image</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-slate-400 ${facultyImageUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        onDrop={handleFacultyImageDrop}
                        onDragOver={handleFacultyImageDragOver}
                        onClick={() => facultyImageInputRef.current?.click()}
                        style={{ background: '#f8fafc' }}
                      >
                        {facultyForm.image ? (
                          <img src={facultyForm.image} alt="Uploaded" className="mx-auto h-20 object-contain mb-1 rounded" />
                        ) : (
                          <span className="text-slate-400 text-sm">Drag & drop or click to upload</span>
                        )}
                        <input type="file" accept="image/*" ref={facultyImageInputRef} className="hidden" onChange={handleFacultyImageSelect} disabled={facultyImageUploading} />
                        {facultyImageUploading && <p className="text-slate-500 text-xs mt-1">Uploading…</p>}
                        {facultyImageError && <p className="text-red-600 text-xs mt-1">{facultyImageError}</p>}
                      </div>

                      {/* Zoom slider */}
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium text-slate-500 shrink-0 w-10">Zoom</label>
                        <input type="range" min="1" max="2.5" step="0.05" value={facultyForm.zoom ?? 1} onChange={e => setFacultyForm((f: any) => ({ ...f, zoom: parseFloat(e.target.value) }))} className="flex-1" />
                        <span className="text-xs text-slate-500 w-10 text-right">{(facultyForm.zoom ?? 1).toFixed(2)}×</span>
                      </div>

                      {/* Position hint */}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>X: <strong className="text-slate-600">{facultyForm.x ?? 50}%</strong></span>
                        <span>Y: <strong className="text-slate-600">{facultyForm.y ?? 50}%</strong></span>
                        <button type="button" className="ml-auto underline hover:text-slate-700" onClick={() => setFacultyForm((f: any) => ({ ...f, x: 50, y: 50 }))}>Reset</button>
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center gap-5 pt-1">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" name="is_leadership" checked={!!facultyForm.is_leadership} onChange={e => handleFacultyChange({ target: { name: 'is_leadership', value: e.target.checked } })} className="rounded" />
                        Leadership
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" name="is_staff" checked={!!facultyForm.is_staff} onChange={e => handleFacultyChange({ target: { name: 'is_staff', value: e.target.checked } })} className="rounded" />
                        Staff
                      </label>
                    </div>

                    {/* Education */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700">Education</h3>

                      {/* Saved entries */}
                      {(editingFaculty !== null
                        ? (faculty.find((f: any) => f.id === editingFaculty)?.education || []).slice().sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        : []
                      ).map((edu: any, idx: number, arr: any[]) => (
                        <div key={edu.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{edu.degree}</p>
                            <p className="text-xs text-slate-500 truncate">{edu.program} {edu.university && `· ${edu.university}`}</p>
                          </div>
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-xs" onClick={() => handleMoveEducation(edu.id, 'up')} disabled={idx === 0}>↑</Button>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-xs" onClick={() => handleMoveEducation(edu.id, 'down')} disabled={idx === arr.length - 1}>↓</Button>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs text-red-500 hover:text-red-700" onClick={() => handleDeleteEducation(edu.id)}>Remove</Button>
                        </div>
                      ))}

                      {/* New inputs */}
                      {eduInputs.map((edu, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 rounded-lg border border-dashed border-slate-200 bg-slate-50">
                          <Input value={edu.degree} onChange={e => handleEduInputChange(idx, 'degree', e.target.value)} placeholder="Degree" />
                          <Input value={edu.program} onChange={e => handleEduInputChange(idx, 'program', e.target.value)} placeholder="Program / Field" />
                          <div className="flex gap-2">
                            <Input value={edu.university} onChange={e => handleEduInputChange(idx, 'university', e.target.value)} placeholder="University" className="flex-1" />
                            <Button size="sm" variant="outline" className="shrink-0 text-red-500 hover:text-red-700" onClick={() => handleRemoveEduRow(idx)}>✕</Button>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleAddEduRow}>+ Add row</Button>
                        <Button size="sm" onClick={handleSaveAllEducation}>Save education</Button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      {editingFaculty === null ? (
                        <Button onClick={handleAddFaculty}>Add Faculty Member</Button>
                      ) : (
                        <>
                          <Button onClick={handleUpdateFaculty}>Save Changes</Button>
                          <Button variant="outline" onClick={() => { setEditingFaculty(null); setFacultyForm({}); setEduInputs([{ degree: '', program: '', university: '' }]); }}>Cancel</Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Right: Live previews ──────────────────────────── */}
                  <div className="xl:w-72 shrink-0 space-y-6 xl:sticky xl:top-6 xl:self-start">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Live Preview</p>

                    {/* Cover card preview */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-slate-500">Cover Card</p>
                      <div
                        ref={previewRef}
                        className="relative h-72 rounded-xl overflow-hidden shadow-md select-none ring-1 ring-slate-200"
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        onMouseDown={handleDragStart}
                      >
                        <img
                          src={facultyForm.image || "/placeholder-image.jpg"}
                          alt=""
                          draggable={false}
                          className="w-full h-full object-cover pointer-events-none"
                          style={{
                            transform: `scale(${facultyForm.zoom ?? 1})`,
                            transformOrigin: `${facultyForm.x ?? 50}% ${facultyForm.y ?? 50}%`,
                            objectPosition: `${facultyForm.x ?? 50}% ${facultyForm.y ?? 50}%`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-4 text-white pointer-events-none">
                          <p className="font-bold text-xl leading-tight">{facultyForm.name_th || "ชื่อ-นามสกุล"}</p>
                          <p className="text-sm font-medium text-gray-200 mt-0.5">{facultyForm.role_th || "ตำแหน่ง"}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 text-center">Drag image to reposition</p>
                    </div>

                    {/* Details modal preview */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-slate-500">Details Modal</p>
                      <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
                        <div className="flex min-h-0">
                          {/* Photo panel */}
                          <div className="relative w-36 shrink-0 bg-slate-900" style={{ minHeight: '12rem' }}>
                            <img
                              src={facultyForm.image || "/placeholder-image.jpg"}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover"
                              style={{
                                objectPosition: `${facultyForm.x ?? 50}% ${facultyForm.y ?? 50}%`,
                                transform: `scale(${facultyForm.zoom ?? 1})`,
                                transformOrigin: `${facultyForm.x ?? 50}% ${facultyForm.y ?? 50}%`,
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <p className="text-white font-bold text-xs leading-tight">{facultyForm.name_th || "ชื่อ"}</p>
                              <p className="text-slate-300 text-[10px] mt-0.5">{facultyForm.role_th || "ตำแหน่ง"}</p>
                            </div>
                          </div>

                          {/* Info panel */}
                          <div className="flex-1 min-w-0 p-4 space-y-3 overflow-hidden">
                            <div className="border-b border-slate-100 pb-3">
                              <p className="font-bold text-slate-900 text-sm leading-tight">{facultyForm.name_en || "Name"}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{facultyForm.role_en || "Role"}</p>
                            </div>

                            {/* Education preview */}
                            {(() => {
                              const saved = editingFaculty !== null
                                ? (faculty.find((f: any) => f.id === editingFaculty)?.education || []).slice().sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                                : [];
                              const pending = eduInputs.filter(e => e.degree.trim());
                              const all = [...saved, ...pending];
                              return all.length > 0 ? (
                                <div>
                                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Education</p>
                                  <ol className="space-y-1.5">
                                    {all.map((edu: any, i: number) => (
                                      <li key={i} className="flex gap-2">
                                        <span className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                        <span className="text-[10px] text-slate-700 leading-snug">
                                          <span className="font-semibold">{edu.degree}</span>
                                          {edu.program && <span className="text-slate-500"> · {edu.program}</span>}
                                          {edu.university && <span className="text-slate-400 block text-[9px]">{edu.university}</span>}
                                        </span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              ) : null;
                            })()}

                            {/* Contact preview */}
                            {(facultyForm.email || facultyForm.phone) && (
                              <div className="pt-2 border-t border-slate-100">
                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contact</p>
                                {facultyForm.email && <p className="text-[10px] text-slate-600 break-all">{facultyForm.email}</p>}
                                {facultyForm.phone && <p className="text-[10px] text-slate-600">{formatPhone(facultyForm.phone)}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Faculty table */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">All Faculty Members</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Name (TH)</th>
                        <th className="p-2 border">Name (EN)</th>
                        <th className="p-2 border">Role (TH)</th>
                        <th className="p-2 border">Role (EN)</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Leadership</th>
                        <th className="p-2 border">Staff</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.map((f: any) => (
                        <tr key={f.id} className="border-b hover:bg-slate-50">
                          <td className="p-2 border">{f.name_th}</td>
                          <td className="p-2 border">{f.name_en}</td>
                          <td className="p-2 border">{f.role_th}</td>
                          <td className="p-2 border">{f.role_en}</td>
                          <td className="p-2 border text-xs">{f.email}</td>
                          <td className="p-2 border text-center">{f.is_leadership ? '✔️' : ''}</td>
                          <td className="p-2 border text-center">{f.is_staff ? '✔️' : ''}</td>
                          <td className="p-2 border">
                            <div className="flex gap-1.5">
                              <Button size="sm" onClick={() => handleEditFaculty(f)}>Edit</Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteFaculty(f.id)}>Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="facilities" className="space-y-16">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-2">Facilities</h2>
                {/* Add/Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Input name="name_th" value={facilityForm.name_th || ""} onChange={handleFacilityChange} placeholder="ชื่อ (TH)" className="mb-2" />
                    <Textarea name="description_th" value={facilityForm.description_th || ""} onChange={handleFacilityChange} placeholder="รายละเอียด (TH)" className="mb-2" />
                  </div>
                  <div>
                    <Input name="name_en" value={facilityForm.name_en || ""} onChange={handleFacilityChange} placeholder="Name (EN)" className="mb-2" />
                    <Textarea name="description_en" value={facilityForm.description_en || ""} onChange={handleFacilityChange} placeholder="Description (EN)" className="mb-2" />
                  </div>
                </div>
                {/* Facilities image input */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">Image</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${facilityImageUploading ? 'opacity-50' : ''}`}
                    onDrop={handleFacilityImageDrop}
                    onDragOver={handleFacilityImageDragOver}
                    onClick={() => facilityImageInputRef.current?.click()}
                    style={{ background: '#f8fafc' }}
                  >
                    {facilityForm.image ? (
                      <img src={facilityForm.image} alt="Preview" className="mx-auto h-24 object-contain mb-2" />
                    ) : (
                      <span className="text-gray-400">Drag & drop or click to upload image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={facilityImageInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFacilityImageSelect}
                      disabled={facilityImageUploading}
                    />
                    {facilityImageUploading && <div className="text-cyan-600 mt-2">Uploading...</div>}
                    {facilityImageError && <div className="text-red-600 mt-2">{facilityImageError}</div>}
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  {editingFacility === null ? (
                    <Button onClick={handleAddFacility}>Add</Button>
                  ) : (
                    <>
                      <Button onClick={handleUpdateFacility}>Save</Button>
                      <Button variant="outline" onClick={() => { setEditingFacility(null); setFacilityForm({}); }}>Cancel</Button>
                    </>
                  )}
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Name (TH)</th>
                        <th className="p-2 border">Name (EN)</th>
                        <th className="p-2 border">Description (TH)</th>
                        <th className="p-2 border">Description (EN)</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facility.map((f) => (
                        <tr key={f.id} className="border-b">
                          <td className="p-2 border">{f.name_th}</td>
                          <td className="p-2 border">{f.name_en}</td>
                          <td className="p-2 border">{f.description_th}</td>
                          <td className="p-2 border">{f.description_en}</td>
                          <td className="p-2 border flex gap-2">
                            <Button size="sm" onClick={() => handleEditFacility(f)}>Edit</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteFacility(f.id)}>Delete</Button>
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