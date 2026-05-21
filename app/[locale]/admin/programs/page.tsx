"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus, Edit, Trash2, ArrowLeft, Upload, X, FileText,
  Calendar, Link2, Video, ImageIcon, Loader2, Search,
} from "lucide-react";

// ─── Types & constants ────────────────────────────────────────────────────────

const PROGRAM_TYPES = [
  { value: "short_course",  label: "Short Course" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate",      label: "Graduate" },
  { value: "doctoral",      label: "Doctoral" },
];

const TYPE_FILTERS = [{ value: "all", label: "All" }, ...PROGRAM_TYPES];

type Program = {
  id?: number;
  type: string;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  benefits_th: string;
  benefits_en: string;
  start_date: string;
  end_date: string;
  how_to_apply_th: string;
  how_to_apply_en: string;
  apply_link: string;
  image: string;
  course_file?: string;
  video_url?: string;
};

const EMPTY: Program = {
  type: "short_course",
  name_th: "", name_en: "",
  description_th: "", description_en: "",
  benefits_th: "", benefits_en: "",
  start_date: "", end_date: "",
  how_to_apply_th: "", how_to_apply_en: "",
  apply_link: "", image: "", course_file: "", video_url: "",
};

function typeLabel(type: string) {
  return PROGRAM_TYPES.find(t => t.value === type)?.label ?? type;
}

function typeBadgeColor(type: string) {
  const map: Record<string, string> = {
    short_course:  "bg-amber-50 text-amber-700 border-amber-200",
    undergraduate: "bg-sky-50 text-sky-700 border-sky-200",
    graduate:      "bg-violet-50 text-violet-700 border-violet-200",
    doctoral:      "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[type] ?? "bg-slate-50 text-slate-700 border-slate-200";
}

// ─── Field label helper ───────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-5">
      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">{icon}</div>
      <div>
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Upload zone ──────────────────────────────────────────────────────────────

function UploadZone({
  label, accept, uploading, value, preview,
  onFile, onRemove,
}: {
  label: string;
  accept: string;
  uploading: boolean;
  value: string;
  preview?: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  const filename = value.split("/").pop();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
          {preview ? (
            <img src={value} alt="preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-slate-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{filename}</p>
            <p className="text-xs text-slate-400 mt-0.5">Uploaded</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => ref.current?.click()}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Uploading…</span>
            </div>
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Drag & drop or <span className="text-slate-700 font-medium underline">browse</span></p>
            </>
          )}
          <input type="file" accept={accept} ref={ref} className="hidden"
            onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
        </div>
      )}
    </div>
  );
}

// ─── Program form (full-page) ─────────────────────────────────────────────────

function ProgramForm({
  initial, onSave, onCancel,
}: {
  initial?: Program | null;
  onSave: (form: Program) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Program>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const set = (field: keyof Program) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [field]: e.target.value }));

  async function upload(file: File, field: "image" | "course_file") {
    field === "image" ? setUploadingImage(true) : setUploadingFile(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/programs/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.path) setForm(f => ({ ...f, [field]: data.path }));
    field === "image" ? setUploadingImage(false) : setUploadingFile(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-slate-900">{initial ? "Edit Program" : "Add New Program"}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{initial ? `Editing: ${initial.name_en}` : "Fill in the details below"}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
          <Button type="submit" form="program-form" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : "Save Program"}
          </Button>
        </div>
      </div>

      {/* Form body */}
      <form
        id="program-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">

          {/* ── Basic Info ── */}
          <section>
            <SectionHeader icon={<FileText className="w-4 h-4" />} title="Basic Information" subtitle="Program type and name in both languages" />
            <div className="space-y-5">
              <div>
                <FieldLabel required>Program Type</FieldLabel>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="w-64">
                    <SelectValue>{typeLabel(form.type)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAM_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Name (Thai)</FieldLabel>
                  <Input name="name_th" value={form.name_th} onChange={set("name_th")} placeholder="ชื่อหลักสูตร" />
                </div>
                <div>
                  <FieldLabel required>Name (English)</FieldLabel>
                  <Input name="name_en" value={form.name_en} onChange={set("name_en")} placeholder="Program name in English" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Content ── */}
          <section>
            <SectionHeader icon={<FileText className="w-4 h-4" />} title="Content" subtitle="Descriptions and program details — shown on the detail page" />
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Description (Thai)</FieldLabel>
                  <Textarea rows={4} name="description_th" value={form.description_th} onChange={set("description_th")} placeholder="คำอธิบายหลักสูตร" className="resize-none" />
                </div>
                <div>
                  <FieldLabel>Description (English)</FieldLabel>
                  <Textarea rows={4} name="description_en" value={form.description_en} onChange={set("description_en")} placeholder="Describe the program" className="resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>What You Will Get (Thai)</FieldLabel>
                  <Textarea rows={4} name="benefits_th" value={form.benefits_th} onChange={set("benefits_th")} placeholder="สิ่งที่จะได้รับ" className="resize-none" />
                </div>
                <div>
                  <FieldLabel>What You Will Get (English)</FieldLabel>
                  <Textarea rows={4} name="benefits_en" value={form.benefits_en} onChange={set("benefits_en")} placeholder="Benefits and outcomes" className="resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>How to Apply (Thai)</FieldLabel>
                  <Textarea rows={3} name="how_to_apply_th" value={form.how_to_apply_th} onChange={set("how_to_apply_th")} placeholder="วิธีการสมัคร" className="resize-none" />
                </div>
                <div>
                  <FieldLabel>How to Apply (English)</FieldLabel>
                  <Textarea rows={3} name="how_to_apply_en" value={form.how_to_apply_en} onChange={set("how_to_apply_en")} placeholder="Steps to apply" className="resize-none" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Dates ── */}
          <section>
            <SectionHeader icon={<Calendar className="w-4 h-4" />} title="Program Dates" subtitle="Leave blank if not applicable" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div>
                <FieldLabel>Start Date</FieldLabel>
                <Input type="date" name="start_date" value={form.start_date} onChange={set("start_date")} />
              </div>
              <div>
                <FieldLabel>End Date</FieldLabel>
                <Input type="date" name="end_date" value={form.end_date} onChange={set("end_date")} />
              </div>
            </div>
          </section>

          {/* ── Links ── */}
          <section>
            <SectionHeader icon={<Link2 className="w-4 h-4" />} title="Links" subtitle="External URLs for applying and video content" />
            <div className="space-y-4 max-w-xl">
              <div>
                <FieldLabel>Apply Link</FieldLabel>
                <Input name="apply_link" value={form.apply_link} onChange={set("apply_link")} placeholder="https://admission.hcu.ac.th/…" />
              </div>
              <div>
                <FieldLabel>Video URL</FieldLabel>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    name="video_url"
                    value={form.video_url ?? ""}
                    onChange={set("video_url")}
                    placeholder="YouTube, Vimeo, or direct .mp4 link"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Supports YouTube, Vimeo, or a direct video file URL</p>
              </div>
            </div>
          </section>

          {/* ── Media ── */}
          <section>
            <SectionHeader icon={<ImageIcon className="w-4 h-4" />} title="Media" subtitle="Cover image and downloadable course file" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadZone
                label="Cover Image"
                accept="image/*"
                uploading={uploadingImage}
                value={form.image}
                preview
                onFile={f => upload(f, "image")}
                onRemove={() => setForm(f => ({ ...f, image: "" }))}
              />
              <UploadZone
                label="Course File (PDF / DOC / ZIP)"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
                uploading={uploadingFile}
                value={form.course_file ?? ""}
                onFile={f => upload(f, "course_file")}
                onRemove={() => setForm(f => ({ ...f, course_file: "" }))}
              />
            </div>
          </section>

          {/* Bottom save bar (redundant but helpful for long forms) */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : "Save Program"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white animate-pulse overflow-hidden">
      <div className="h-36 bg-slate-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-16 bg-slate-100 rounded-full" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-7 w-7 bg-slate-100 rounded-md" />
          <div className="h-7 w-7 bg-slate-100 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ─── Program card ─────────────────────────────────────────────────────────────

function ProgramCard({
  program, onEdit, onDelete,
}: {
  program: Program;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative h-36 bg-slate-100 flex-shrink-0 overflow-hidden">
        {program.image ? (
          <img
            src={program.image}
            alt={program.name_en}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-slate-300" />
          </div>
        )}
        {/* Action buttons — shown on hover */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md bg-white shadow text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md bg-white shadow text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className={`self-start px-2 py-0.5 text-xs font-medium rounded-full border ${typeBadgeColor(program.type)}`}>
          {typeLabel(program.type)}
        </span>
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1">{program.name_en}</h3>
        <p className="text-xs text-slate-500 line-clamp-1">{program.name_th}</p>
        {program.description_en && (
          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{program.description_en}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-slate-400">
          {program.start_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(program.start_date).getFullYear()}
            </span>
          )}
          {program.course_file && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              File
            </span>
          )}
          {program.video_url && (
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              Video
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminProgramsPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<Program | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs");
      if (!res.ok) throw new Error("Failed to fetch programs");
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: Program) => {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add program");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["programs"] }); setView("list"); },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, ...data }: Program & { id: number }) => {
      const res = await fetch(`/api/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update program");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["programs"] }); setView("list"); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete program");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["programs"] }); setDeleteTarget(null); },
  });

  const filtered = programs
    .filter(p => activeFilter === "all" || p.type === activeFilter)
    .filter(p => !search || p.name_en.toLowerCase().includes(search.toLowerCase()) || p.name_th.includes(search));

  // ── Form view ──
  if (view === "form") {
    return (
      <div className="min-h-screen bg-slate-50">
        <ProgramForm
          initial={editing}
          onSave={async (data) => {
            if (editing?.id) {
              await editMutation.mutateAsync({ id: editing.id, ...data });
            } else {
              await addMutation.mutateAsync(data);
            }
          }}
          onCancel={() => { setView("list"); setEditing(null); }}
        />
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Programs</h1>
            <p className="text-sm text-slate-500 mt-0.5">{programs.length} total program{programs.length !== 1 ? "s" : ""}</p>
          </div>
          <Button
            onClick={() => { setEditing(null); setView("form"); }}
            className="self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Program
          </Button>
        </div>

        {/* Filter + search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map(t => (
              <button
                key={t.value}
                onClick={() => setActiveFilter(t.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeFilter === t.value
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search programs…"
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">No programs found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting the filter or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(program => (
              <ProgramCard
                key={program.id}
                program={program}
                onEdit={() => { setEditing(program); setView("form"); }}
                onDelete={() => setDeleteTarget(program)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name_en}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
