"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Calendar, Download, FileQuestion } from "lucide-react";

const PROGRAM_TYPES = [
  { value: "all",           label: "All" },
  { value: "short_course",  label: "Short Course" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate",      label: "Graduate" },
  { value: "doctoral",      label: "Doctoral" },
];

type Program = {
  id: number;
  type: string;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  start_date: string;
  end_date: string;
  image: string;
  course_file?: string;
};

function typeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");
}

function formatDateDMY(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-5/6 bg-slate-100 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 w-24 bg-slate-100 rounded-lg" />
          <div className="h-8 w-24 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Program card ─────────────────────────────────────────────────────────────
function ProgramCard({
  program,
  locale,
  onClick,
}: {
  program: Program;
  locale: string;
  onClick: () => void;
}) {
  const name = locale === "th" ? program.name_th : program.name_en;
  const desc = locale === "th" ? program.description_th : program.description_en;
  const dateRange = [formatDateDMY(program.start_date), formatDateDMY(program.end_date)]
    .filter(Boolean)
    .join(" — ");

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl ring-1 ring-slate-200 hover:ring-slate-300 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-44 bg-slate-100 flex-shrink-0 overflow-hidden">
        {program.image ? (
          <img
            src={program.image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-slate-300" />
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          {typeLabel(program.type)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 flex-1">{desc}</p>

        {dateRange && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{dateRange}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClick}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            View Details
          </button>
          {program.course_file && (
            <a
              href={program.course_file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AllProgramsPage() {
  const locale = useLocale();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs");
      if (!res.ok) throw new Error("Failed to fetch programs");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const filtered =
    activeFilter === "all"
      ? programs
      : programs.filter((p) => p.type === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Programs</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            Explore our full range of academic programs, from short courses to doctoral degrees.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {PROGRAM_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveFilter(t.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                activeFilter === t.value
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <FileQuestion className="w-14 h-14 text-slate-300" />
            <p className="text-xl font-semibold text-slate-700">No programs found</p>
            <p className="text-sm text-slate-400">Try selecting a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                locale={locale}
                onClick={() => router.push(`/programs/all-program/${program.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
