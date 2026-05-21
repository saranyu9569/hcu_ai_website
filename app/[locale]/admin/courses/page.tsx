"use client";
import { CLO } from '@/lib';
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectItem } from '@/components/ui/select';


export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<any>({
    code: "",
    title_th: "",
    title_en: "",
    description_en: "",
    description_th: "",
    credits: "",
    category: "หมวดวิชาเฉพาะ",
    group: "วิชาบังคับ",
    prerequisites_en: "",
    prerequisites_th: "",
    clos: [] as CLO[],
  });
  const [cloInput, setCloInput] = useState<CLO>({ clo_en: "", clo_th: "" });

  // เพิ่มตัวแปรสำหรับ Combobox
  const CATEGORY_OPTIONS = ['หมวดวิชาเฉพาะ', 'หมวดวิชาประสบการณ์ภาคสนาม', 'หมวดวิชาศึกษาทั่วไป'];
  const GROUP_OPTIONS = ['วิชาบังคับ', 'วิชาเลือก', 'กลุ่มพื้นฐานวิชาชีพ', 'กลุ่มวิชาเอกบังคับ', 'กลุ่มวิชาเอกเลือก', 'ไม่มี'];

  // Fetch all courses
  useEffect(() => {
    fetchCourses();
  }, []);
  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  };

  // Form handlers
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCloChange = (e: any) => {
    setCloInput({ ...cloInput, [e.target.name]: e.target.value });
  };
  const handleAddClo = () => {
    if (!cloInput.clo_th) return;
    setForm({ ...form, clos: [...form.clos, cloInput] });
    setCloInput({ clo_en: "", clo_th: "" });
  };
  const handleRemoveClo = (idx: number) => {
    setForm({ ...form, clos: form.clos.filter((_: any, i: number) => i !== idx) });
  };

  // CRUD
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setForm({ ...courses[idx], clos: (courses[idx].clos || []).map((c: any) => ({ clo_en: c.clo_en, clo_th: c.clo_th })) });
    setCloInput({ clo_en: "", clo_th: "" });
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };
  const handleCancel = () => {
    setEditIdx(null);
    setForm({
      code: "",
      title_th: "",
      title_en: "",
      description_en: "",
      description_th: "",
      credits: "",
      category: "หมวดวิชาเฉพาะ",
      group: "วิชาบังคับ",
      prerequisites_en: "",
      prerequisites_th: "",
      clos: [],
    });
    setCloInput({ clo_en: "", clo_th: "" });
  };
  const handleSave = async () => {
    if (!form.code || !form.title_th || !form.title_en) return alert("Code, Thai Title, and English Title required");
    if (editIdx !== null) {
      // update
      await fetch(`/api/courses/${courses[editIdx].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // create
      await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    handleCancel();
    fetchCourses();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin: Course Syllabus</h1>
      <Card className="mb-8">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">{editIdx !== null ? "Edit Course" : "Add Course"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input name="code" value={form.code} onChange={handleChange} placeholder="Course Code" className="mb-2" />
              <Input name="title_en" value={form.title_en} onChange={handleChange} placeholder="Title (EN)" className="mb-2" />
              <Textarea name="description_en" value={form.description_en} onChange={handleChange} placeholder="Description (EN)" className="mb-2" />
              <label className="block mb-1 font-medium">หมวดวิชา</label>
              <Select value={form.category} onValueChange={val => setForm({ ...form, category: val })} className="mb-2">
                {CATEGORY_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </Select>
              <label className="block mb-1 font-medium">กลุ่มวิชา</label>
              <Select value={form.group} onValueChange={val => setForm({ ...form, group: val })} className="mb-2">
                {GROUP_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </Select>
              <Input name="prerequisites_en" value={form.prerequisites_en} onChange={handleChange} placeholder="Prerequisites (EN)" className="mb-2" />
            </div>
            <div>
              <Input name="title_th" value={form.title_th} onChange={handleChange} placeholder="ชื่อวิชา (TH)" className="mb-2" />
              <Textarea name="description_th" value={form.description_th} onChange={handleChange} placeholder="รายละเอียด (TH)" className="mb-2" />
              <Input name="prerequisites_th" value={form.prerequisites_th} onChange={handleChange} placeholder="วิชาที่ต้องเรียนมาก่อน (TH)" className="mb-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="credits" value={form.credits} onChange={handleChange} placeholder="Credits (3(2/2-1/3-0))" className="mb-2" />
          </div>
          {/* CLOs */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">CLOs (TH)</h3>
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <Input name="clo_en" value={cloInput.clo_en} onChange={handleCloChange} placeholder="CLO (EN)" className="mb-2" />
              <Input name="clo_th" value={cloInput.clo_th} onChange={handleCloChange} placeholder="CLO (TH)" className="mb-2" />
              <Button onClick={handleAddClo} type="button">Add CLO</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.clos.map((clo: CLO, idx: number) => (
                <Badge key={idx} className="flex items-center gap-1 bg-cyan-100 text-cyan-800 border-cyan-200">
                  {clo.clo_en && <span>{clo.clo_en}</span>}
                  {clo.clo_th && <span className="ml-1">({clo.clo_th})</span>}
                  <Button size="icon" variant="ghost" className="ml-1" onClick={() => handleRemoveClo(idx)}><span className="text-red-500">×</span></Button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{editIdx !== null ? "Save" : "Add Course"}</Button>
            {editIdx !== null && <Button variant="outline" onClick={handleCancel}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>
      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Courses</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Code</th>
                    <th className="p-2 border">Title (TH)</th>
                    <th className="p-2 border">Title (EN)</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Group</th>
                    <th className="p-2 border">Credits</th>
                    <th className="p-2 border">CLOs</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, idx) => (
                    <tr key={course.id} className="border-b">
                      <td className="p-2 border">{course.code}</td>
                      <td className="p-2 border">{course.title_th}</td>
                      <td className="p-2 border">{course.title_en}</td>
                      <td className="p-2 border">{course.category_th}</td>
                      <td className="p-2 border">{course.group_th}</td>
                      <td className="p-2 border">{course.credits}</td>
                      <td className="p-2 border">
                        <div className="flex flex-wrap gap-1">
                          {course.clos && course.clos.map((clo: any, i: number) => (
                            <Badge key={i} className="bg-cyan-50 text-cyan-800 border-cyan-200">
                              {clo.clo_en && <span>{clo.clo_en}</span>}
                              {clo.clo_th && <span className="ml-1">({clo.clo_th})</span>}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 border flex gap-2">
                        <Button size="sm" onClick={() => handleEdit(idx)}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(course.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 