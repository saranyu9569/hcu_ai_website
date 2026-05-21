"use client";
import { AuthorAdvisor, StudentProject, StudentProjectModalProps } from '@/lib';

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from 'next-intl';



const StudentProjectModal: React.FC<StudentProjectModalProps> = ({ isOpen, onClose, project }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const locale = useLocale();
  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[95vh] mx-2 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Badge className="bg-cyan-700 text-white text-base px-3 py-1">{project.year}</Badge>
            <span className="text-slate-700 text-md font-bold">{project.course}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-500" />
          </Button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-96px)]">
          {/* Hero Image */}
          <div className="relative w-full h-72 md:h-80 overflow-hidden">
            <Image
              src={project.image}
              alt={project.title_th || 'Student project image'}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Project Content */}
          <div className="p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">
              {locale === 'th' ? project.title_th : project.title_en}
            </h1>
            {/* Authors */}
            <div className="mb-4">
              <div className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" />
                ผู้จัดทำ (Authors)
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.authors && project.authors.filter(a => (locale === 'th' ? a.name_th : a.name_en).trim() !== '').length > 0
                  ? project.authors.map((a, idx) => {
                      const name = locale === 'th' ? a.name_th : a.name_en;
                      return name.trim() !== '' ? (
                        <span key={idx} className="bg-cyan-100 text-cyan-800 border-cyan-200 px-3 py-1 text-sm rounded inline-block">{name}</span>
                      ) : null;
                    })
                  : <span className="text-gray-400">-</span>}
              </div>
            </div>

            {/* Advisors */}
            <div className="mb-4">
              <div className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                ที่ปรึกษา (Advisors)
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.advisors && project.advisors.filter(a => (locale === 'th' ? a.name_th : a.name_en).trim() !== '').length > 0
                  ? project.advisors.map((a, idx) => {
                      const name = locale === 'th' ? a.name_th : a.name_en;
                      return name.trim() !== '' ? (
                        <span key={idx} className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm rounded inline-block">{name}</span>
                      ) : null;
                    })
                  : <span className="text-gray-400">-</span>}
              </div>
            </div>

            {/* Details (current language only) */}
            <div className="mb-6">
              <div className="font-semibold text-slate-700 mb-2">
                {locale === 'th' ? 'รายละเอียด' : 'Details'}
              </div>
              <div className="prose max-w-none text-slate-800 text-base leading-relaxed bg-slate-50 rounded-xl p-4 border">
                {(locale === 'th' ? project.details_th : project.details_en)?.split('\n').map((para, idx) => (
                  <p key={idx} className="mb-2">{para}</p>
                ))}
              </div>
            </div>

            {/* Link (if any) */}
            {project.link && (
              <div className="mt-4">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-cyan-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-cyan-700 transition">
                  ดูรายละเอียด/สมัคร (More Info / Apply)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProjectModal; 