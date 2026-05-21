"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function AdminUndergraduatePage() {
  // Overview
  const [overview, setOverview] = useState<any>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [overviewEdit, setOverviewEdit] = useState<any>({});
  const [highlightEdit, setHighlightEdit] = useState<any>({ title: "", description: "" });
  const [highlightEditIdx, setHighlightEditIdx] = useState<number | null>(null);
  // Curriculum
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [curriculumEdit, setCurriculumEdit] = useState<any>({ year_number: "", year_title: "" });
  const [curriculumEditIdx, setCurriculumEditIdx] = useState<number | null>(null);
  const [subjectEdit, setSubjectEdit] = useState<any>({ curriculum_year_id: "", subject_name: "" });
  const [subjectEditIdx, setSubjectEditIdx] = useState<{yearId:number, idx:number}|null>(null);
  // Careers
  const [careers, setCareers] = useState<any[]>([]);
  const [careerEdit, setCareerEdit] = useState<any>({ name: "", description: "", salary: "", color: "" });
  const [careerEditIdx, setCareerEditIdx] = useState<number | null>(null);
  const [metricEdit, setMetricEdit] = useState<any>({});
  const [metricEditIdx, setMetricEditIdx] = useState<number | null>(null);
  // เพิ่ม state เพื่อแยกโหมดแก้ไข metrics
  const [editMode, setEditMode] = useState<'career' | 'metrics' | null>(null);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const params = useParams();
  const locale = params?.locale || 'en';
  const metricLabels: Record<string, string> = {
    'Technical Skills': locale === 'th' ? 'ทักษะเทคนิค' : 'Technical Skills',
    'Problem Solving': locale === 'th' ? 'การแก้ปัญหา' : 'Problem Solving',
    'Communication': locale === 'th' ? 'การสื่อสาร' : 'Communication',
    'Leadership': locale === 'th' ? 'ภาวะผู้นำ' : 'Leadership',
    'Research': locale === 'th' ? 'การวิจัย' : 'Research',
    'Business Impact': locale === 'th' ? 'ผลกระทบทางธุรกิจ' : 'Business Impact',
  };

  // Fetch all data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/undergraduate/overview").then((r) => r.json()),
      fetch("/api/undergraduate/curriculum").then((r) => r.json()),
      fetch("/api/undergraduate/careers").then((r) => r.json()),
    ]).then(([overviewData, curriculumData, careersData]) => {
      setOverview(overviewData);
      setOverviewEdit(overviewData);
      setHighlights(overviewData.highlights || []);
      setCurriculum(curriculumData);
      setCareers(careersData);
      setLoading(false);
    });
  }, []);

  // --- Overview CRUD ---
  const handleOverviewSave = async () => {
    await fetch("/api/undergraduate/overview", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overviewEdit),
    });
    setOverview(overviewEdit);
    alert("Overview updated");
  };
  // Highlight CRUD
  const handleHighlightAdd = async () => {
    if (!highlightEdit.title) return;
    const res = await fetch("/api/undergraduate/overview/highlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(highlightEdit),
    });
    const newHighlight = await res.json();
    setHighlights([...highlights, newHighlight]);
    setHighlightEdit({ title: "", description: "" });
  };
  const handleHighlightEdit = (idx: number) => {
    setHighlightEditIdx(idx);
    setHighlightEdit(highlights[idx]);
  };
  const handleHighlightSave = async (idx: number) => {
    const hl = highlights[idx];
    await fetch(`/api/undergraduate/overview/highlight/${hl.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(highlightEdit),
    });
    const newHighlights = [...highlights];
    newHighlights[idx] = { ...hl, ...highlightEdit };
    setHighlights(newHighlights);
    setHighlightEditIdx(null);
    setHighlightEdit({ title: "", description: "" });
  };
  const handleHighlightDelete = async (id: number) => {
    await fetch(`/api/undergraduate/overview/highlight/${id}`, {
      method: 'DELETE',
    });
    setHighlights(highlights.filter(h => h.id !== id));
  };
  // --- Curriculum CRUD ---
  const handleCurriculumAdd = async () => {
    if (!curriculumEdit.year_title) return;
    const res = await fetch("/api/undergraduate/curriculum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curriculumEdit),
    });
    const newYear = await res.json();
    setCurriculum([...curriculum, { ...newYear, subjects: [] }]);
    setCurriculumEdit({ year_number: "", year_title: "" });
  };
  const handleCurriculumEdit = (idx: number) => {
    setCurriculumEditIdx(idx);
    setCurriculumEdit(curriculum[idx]);
  };
  const handleCurriculumSave = async (idx: number) => {
    const year = curriculum[idx];
    await fetch(`/api/undergraduate/curriculum/${year.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curriculumEdit),
    });
    const newCurriculum = [...curriculum];
    newCurriculum[idx] = { ...year, ...curriculumEdit };
    setCurriculum(newCurriculum);
    setCurriculumEditIdx(null);
    setCurriculumEdit({ year_number: "", year_title: "" });
  };
  // Subject CRUD
  const handleSubjectAdd = async () => {
    if (!subjectEdit.subject_name || !subjectEdit.curriculum_year_id) return;
    const res = await fetch("/api/undergraduate/curriculum/subject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subjectEdit),
    });
    const newSubject = await res.json();
    setCurriculum(
      curriculum.map((y) =>
        y.id === subjectEdit.curriculum_year_id
          ? { ...y, subjects: [...(y.subjects || []), newSubject] }
          : y
      )
    );
    setSubjectEdit({ curriculum_year_id: "", subject_name: "" });
  };
  const handleSubjectEdit = (yearId: number, idx: number) => {
    setSubjectEditIdx({ yearId, idx });
    const year = curriculum.find(y => y.id === yearId);
    setSubjectEdit({ curriculum_year_id: yearId, subject_name: year.subjects[idx].subject_name });
  };
  const handleSubjectSave = async (yearId: number, subjectId: number, idx: number) => {
    await fetch(`/api/undergraduate/curriculum/subject/${subjectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subjectEdit),
    });
    setCurriculum(
      curriculum.map((y) =>
        y.id === yearId
          ? { ...y, subjects: y.subjects.map((s: any, i: number) => i === idx ? { ...s, subject_name: subjectEdit.subject_name } : s) }
          : y
      )
    );
    setSubjectEditIdx(null);
    setSubjectEdit({ curriculum_year_id: "", subject_name: "" });
  };
  // --- Careers CRUD ---
  const handleCareerAdd = async () => {
    if (!careerEdit.name) return;
    const res = await fetch("/api/undergraduate/careers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(careerEdit),
    });
    const newCareer = await res.json();
    setCareers([...careers, { ...newCareer, metrics: {} }]);
    setCareerEdit({ name: "", description: "", salary: "", color: "" });
  };
  const handleCareerEdit = (idx: number) => {
    setCareerEditIdx(idx);
    setCareerEdit(careers[idx]);
    setMetricEdit(careers[idx].metrics || {});
    setEditMode('career');
  };
  const handleCareerSave = async (idx: number) => {
    const c = careers[idx];
    await fetch(`/api/undergraduate/careers/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(careerEdit),
    });
    const newCareers = [...careers];
    newCareers[idx] = { ...c, ...careerEdit };
    setCareers(newCareers);
    setCareerEditIdx(null);
    setCareerEdit({ name: "", description: "", salary: "", color: "", name_th: "", description_th: "", salary_th: "" });
    setMetricEdit({});
    setEditMode(null);
  };
  // Metric CRUD
  const handleMetricEdit = (idx: number) => {
    setCareerEditIdx(idx);
    setCareerEdit(careers[idx]);
    setMetricEdit(careers[idx].metrics || {});
    setEditMode('metrics');
  };
  const handleMetricSave = async (careerId: number, idx: number) => {
    await fetch(`/api/undergraduate/careers/${careerId}/metrics`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metricEdit),
    });
    const newCareers = [...careers];
    newCareers[idx].metrics = { ...metricEdit };
    setCareers(newCareers);
    setMetricEditIdx(null);
    setMetricEdit({});
    setEditMode(null);
  };

  // File upload handlers
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await uploadImage(file);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadImage(file);
  };
  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/undergraduate/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.path) setOverviewEdit((prev: any) => ({ ...prev, lab_image: data.path }));
    setUploading(false);
  };

  const handleCancelEdit = () => {
    setCareerEditIdx(null);
    setCareerEdit({ name: '', description: '', salary: '', color: '', name_th: '', description_th: '', salary_th: '' });
    setMetricEdit({});
    setEditMode(null);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin: Undergraduate Program</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-2">Edit Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">English</h3>
                  <Input
                    value={overviewEdit.overview_heading || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, overview_heading: e.target.value })}
                    placeholder="Overview Heading (EN)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.program_title || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, program_title: e.target.value })}
                    placeholder="Program Title (EN)"
                    className="mb-2"
                  />
                  <Textarea
                    value={overviewEdit.program_description || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, program_description: e.target.value })}
                    placeholder="Description (EN)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.duration || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, duration: e.target.value })}
                    placeholder="Duration (EN)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.credits || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, credits: e.target.value })}
                    placeholder="Credits (EN)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.degree || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, degree: e.target.value })}
                    placeholder="Degree (EN)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.class_size || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, class_size: e.target.value })}
                    placeholder="Class Size (EN)"
                    className="mb-2"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ภาษาไทย</h3>
                  <Input
                    value={overviewEdit.overview_heading_th || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, overview_heading_th: e.target.value })}
                    placeholder="หัวข้อ Overview (TH)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.program_title_th || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, program_title_th: e.target.value })}
                    placeholder="ชื่อโปรแกรม (TH)"
                    className="mb-2"
                  />
                  <Textarea
                    value={overviewEdit.program_description_th || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, program_description_th: e.target.value })}
                    placeholder="รายละเอียด (TH)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.duration_th || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, duration_th: e.target.value })}
                    placeholder="ระยะเวลา (TH)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.credits_th || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, credits_th: e.target.value })}
                    placeholder="หน่วยกิต (TH)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.degree_th || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, degree_th: e.target.value })}
                    placeholder="ปริญญา (TH)"
                    className="mb-2"
                  />
                  <Input
                    value={overviewEdit.class_size_th || ""}
                    onChange={e => setOverviewEdit({ ...overviewEdit, class_size_th: e.target.value })}
                    placeholder="ขนาดชั้นเรียน (TH)"
                    className="mb-2"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block font-medium mb-1">Lab Image</label>
                <div
                  className="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:bg-gray-50 relative"
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ minHeight: 100 }}
                >
                  {uploading ? (
                    <div className="text-gray-500">Uploading...</div>
                  ) : overviewEdit.lab_image ? (
                    <img src={overviewEdit.lab_image} alt="Lab" className="mx-auto max-h-32 mb-2" />
                  ) : (
                    <div className="text-gray-400">Drag & drop or click to select image</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {overviewEdit.lab_image && (
                    <div className="text-xs text-gray-500 mt-1">{overviewEdit.lab_image}</div>
                  )}
                </div>
              </div>
              <Button onClick={handleOverviewSave}>Save Overview</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Program Highlights</h2>
              {/* Add new highlight */}
              <div className="mb-6 flex flex-col md:flex-row gap-2 items-start md:items-end">
                <Input
                  value={highlightEdit.title}
                  onChange={e => setHighlightEdit({ ...highlightEdit, title: e.target.value })}
                  placeholder="Highlight Title"
                  className="mb-2 md:mb-0"
                />
                <Textarea
                  value={highlightEdit.description}
                  onChange={e => setHighlightEdit({ ...highlightEdit, description: e.target.value })}
                  placeholder="Highlight Description"
                  className="mb-2 md:mb-0"
                />
                <Button onClick={handleHighlightAdd} className="self-stretch md:self-auto">Add</Button>
              </div>
              {/* List highlights */}
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Title</th>
                      <th className="p-2 border">Description</th>
                      <th className="p-2 border w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highlights.map((hl, idx) => (
                      <tr key={hl.id || idx} className="border-b">
                        {highlightEditIdx === idx ? (
                          <>
                            <td className="p-2 border">
                              <Input
                                value={highlightEdit.title}
                                onChange={e => setHighlightEdit({ ...highlightEdit, title: e.target.value })}
                                placeholder="Highlight Title"
                              />
                            </td>
                            <td className="p-2 border">
                              <Textarea
                                value={highlightEdit.description}
                                onChange={e => setHighlightEdit({ ...highlightEdit, description: e.target.value })}
                                placeholder="Highlight Description"
                              />
                            </td>
                            <td className="p-2 border flex gap-2">
                              <Button size="sm" onClick={() => handleHighlightSave(idx)}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => { setHighlightEditIdx(null); setHighlightEdit({ title: "", description: "" }); }}>Cancel</Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-2 border">{hl.title}</td>
                            <td className="p-2 border">{hl.description}</td>
                            <td className="p-2 border flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => handleHighlightEdit(idx)} aria-label="Edit">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleHighlightDelete(hl.id)} aria-label="Delete">
                                <Trash className="w-4 h-4 text-red-500" />
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Curriculum Tab */}
        <TabsContent value="curriculum">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Add Year</h2>
              <Input
                value={curriculumEdit.year_number}
                onChange={e => setCurriculumEdit({ ...curriculumEdit, year_number: e.target.value })}
                placeholder="Year Number"
                className="mb-2"
              />
              <Input
                value={curriculumEdit.year_title}
                onChange={e => setCurriculumEdit({ ...curriculumEdit, year_title: e.target.value })}
                placeholder="Year Title"
                className="mb-2"
              />
              <Button onClick={handleCurriculumAdd}>Add Year</Button>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Curriculum Years & Subjects</h2>
              <ul className="space-y-4">
                {curriculum.map((year, yIdx) => (
                  <li key={year.id || yIdx} className="border p-2 rounded">
                    {curriculumEditIdx === yIdx ? (
                      <>
                        <Input
                          value={curriculumEdit.year_number}
                          onChange={e => setCurriculumEdit({ ...curriculumEdit, year_number: e.target.value })}
                          placeholder="Year Number"
                          className="mb-2"
                        />
                        <Input
                          value={curriculumEdit.year_title}
                          onChange={e => setCurriculumEdit({ ...curriculumEdit, year_title: e.target.value })}
                          placeholder="Year Title"
                          className="mb-2"
                        />
                        <Button size="sm" onClick={() => handleCurriculumSave(yIdx)}>Save</Button>
                      </>
                    ) : (
                      <>
                        <strong>{year.year_title}</strong> (Year {year.year_number})
                        <Button size="sm" className="ml-2" onClick={() => handleCurriculumEdit(yIdx)}>Edit</Button>
                      </>
                    )}
                    <ul className="ml-4 mt-2 list-disc">
                      {year.subjects.map((sub: {id: number, subject_name: string}, sIdx: number) => (
                        <li key={sub.id}>
                          {subjectEditIdx && subjectEditIdx.yearId === year.id && subjectEditIdx.idx === sIdx ? (
                            <>
                              <Input
                                value={subjectEdit.subject_name}
                                onChange={e => setSubjectEdit({ ...subjectEdit, subject_name: e.target.value })}
                                placeholder="Subject Name"
                                className="mb-2"
                              />
                              <Button size="sm" onClick={() => handleSubjectSave(year.id, sub.id, sIdx)}>Save</Button>
                            </>
                          ) : (
                            <>
                              {sub.subject_name}
                              <Button size="sm" className="ml-2" onClick={() => handleSubjectEdit(year.id, sIdx)}>Edit</Button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Add Subject to Year</h2>
              <select
                value={subjectEdit.curriculum_year_id}
                onChange={e => setSubjectEdit({ ...subjectEdit, curriculum_year_id: Number(e.target.value) })}
                className="mb-2 border rounded p-2 w-full"
              >
                <option value="">Select Year</option>
                {curriculum.map((y) => (
                  <option key={y.id} value={y.id}>{y.year_title}</option>
                ))}
              </select>
              <Input
                value={subjectEdit.subject_name}
                onChange={e => setSubjectEdit({ ...subjectEdit, subject_name: e.target.value })}
                placeholder="Subject Name"
                className="mb-2"
              />
              <Button onClick={handleSubjectAdd}>Add Subject</Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Careers Tab */}
        <TabsContent value="careers">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{careerEditIdx !== null ? 'Edit Career' : 'Add Career'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">English</h3>
                  <Input
                    value={careerEdit.name}
                    onChange={e => setCareerEdit({ ...careerEdit, name: e.target.value })}
                    placeholder="Career Name (EN)"
                    className="mb-2"
                  />
                  <Textarea
                    value={careerEdit.description}
                    onChange={e => setCareerEdit({ ...careerEdit, description: e.target.value })}
                    placeholder="Description (EN)"
                    className="mb-2"
                  />
                  <Input
                    value={careerEdit.salary}
                    onChange={e => setCareerEdit({ ...careerEdit, salary: e.target.value })}
                    placeholder="Salary (EN)"
                    className="mb-2"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ภาษาไทย</h3>
                  <Input
                    value={careerEdit.name_th || ""}
                    onChange={e => setCareerEdit({ ...careerEdit, name_th: e.target.value })}
                    placeholder="ชื่อตำแหน่ง (TH)"
                    className="mb-2"
                  />
                  <Textarea
                    value={careerEdit.description_th || ""}
                    onChange={e => setCareerEdit({ ...careerEdit, description_th: e.target.value })}
                    placeholder="รายละเอียด (TH)"
                    className="mb-2"
                  />
                  <Input
                    value={careerEdit.salary_th || ""}
                    onChange={e => setCareerEdit({ ...careerEdit, salary_th: e.target.value })}
                    placeholder="เงินเดือน (TH)"
                    className="mb-2"
                  />
                </div>
              </div>
              <Input
                value={careerEdit.color}
                onChange={e => setCareerEdit({ ...careerEdit, color: e.target.value })}
                placeholder="Color (hex)"
                className="mb-2"
              />
              {/* Metrics input เฉพาะโหมด metrics */}
              {editMode === 'metrics' && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Metrics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(metricLabels).map((metric) => (
                      <div key={metric} className="flex flex-col">
                        <label className="text-xs mb-1">{metricLabels[metric]}</label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={metricEdit[metric] ?? ''}
                          onChange={e => setMetricEdit({ ...metricEdit, [metric]: e.target.value })}
                          placeholder={metricLabels[metric]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                {careerEditIdx !== null ? (
                  <>
                    <Button size="sm" onClick={editMode === 'metrics' ? () => handleMetricSave(careerEdit.id, careerEditIdx) : () => handleCareerSave(careerEditIdx)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={handleCareerAdd}>Add Career</Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Careers & Metrics</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Name (EN)</th>
                      <th className="p-2 border">Name (TH)</th>
                      <th className="p-2 border">Description (EN)</th>
                      <th className="p-2 border">Description (TH)</th>
                      <th className="p-2 border">Salary (EN)</th>
                      <th className="p-2 border">Salary (TH)</th>
                      <th className="p-2 border">Color</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careers.map((career, cIdx) => (
                      <tr key={career.id || cIdx} className="border-b">
                        <td className="p-2 border">{career.name}</td>
                        <td className="p-2 border">{career.name_th}</td>
                        <td className="p-2 border">{career.description}</td>
                        <td className="p-2 border">{career.description_th}</td>
                        <td className="p-2 border">{career.salary}</td>
                        <td className="p-2 border">{career.salary_th}</td>
                        <td className="p-2 border"><span style={{ color: career.color }}>{career.color}</span></td>
                        <td className="p-2 border flex flex-col gap-2">
                          <Button size="sm" onClick={() => handleCareerEdit(cIdx)}>Edit</Button>
                          <Button size="sm" onClick={() => handleMetricEdit(cIdx)}>Edit Metrics</Button>
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
  );
} 