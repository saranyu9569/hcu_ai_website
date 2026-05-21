"use client";

import { FacultyMember, FacultyMemberModalProps } from '@/lib';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Mail, Phone, GraduationCap, X } from "lucide-react";
import { useLocale } from 'next-intl';

function formatPhone(phone: string) {
  if (!phone) return '';
  if (phone.startsWith('+66')) return `(+66) ${phone.slice(3)}`;
  return phone;
}

export default function FacultyMemberModal({ isOpen, onClose, member }: FacultyMemberModalProps) {
  const locale = useLocale();
  if (!member) return null;

  const name = locale === 'th' ? member.name_th : member.name_en;
  const role = locale === 'th' ? member.role_th : member.role_en;

  const imgStyle = {
    objectPosition: `${member.x ?? 50}% ${member.y ?? 50}%`,
    transform: `scale(${member.zoom ?? 1})`,
    transformOrigin: `${member.x ?? 50}% ${member.y ?? 50}%`,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden max-w-[calc(100vw-2rem)] sm:max-w-2xl border-0 shadow-2xl rounded-2xl"
      >
        {/* Required by Radix for accessibility */}
        <DialogTitle className="sr-only">{name}</DialogTitle>

        <div className="flex flex-col sm:flex-row max-h-[92dvh] sm:max-h-[85dvh]">

          {/* ── Photo panel ──────────────────────────────────── */}
          <div className="relative shrink-0 h-64 sm:h-auto sm:w-64 md:w-72 bg-slate-900">
            <Image
              src={member.image || "/placeholder-image.jpg"}
              alt={name}
              fill
              className="object-cover"
              style={imgStyle}
              sizes="(max-width: 640px) 100vw, 288px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            {/* Name overlay — visible on mobile (info is below), hidden on sm+ (duplicated in header) */}
            <div className="absolute bottom-4 left-4 right-4 sm:hidden">
              <p className="text-white font-bold text-lg leading-tight drop-shadow">{name}</p>
              <p className="text-slate-300 text-sm mt-0.5 drop-shadow">{role}</p>
            </div>
          </div>

          {/* ── Info panel ───────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
              <div className="min-w-0 pr-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{name}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{role}</p>
              </div>
              <button
                onClick={() => onClose()}
                aria-label="Close"
                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

              {/* Education */}
              {Array.isArray(member.education) && member.education.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Education
                  </div>
                  <ol className="space-y-3">
                    {[...member.education]
                      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                      .map((edu: any) => (
                        <li key={edu.id} className="flex gap-3">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                          <span className="text-sm text-slate-700 leading-snug">
                            <span className="font-semibold">{edu.degree}</span>
                            {edu.program && <span className="text-slate-500"> · {edu.program}</span>}
                            {edu.university && (
                              <span className="text-slate-400 block text-xs mt-0.5">{edu.university}</span>
                            )}
                          </span>
                        </li>
                      ))}
                  </ol>
                </section>
              )}

              {/* Contact */}
              {(member.email || member.phone) && (
                <section className="pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Contact
                  </div>
                  <div className="space-y-2.5">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors group"
                      >
                        <Mail className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                        <span className="break-all">{member.email}</span>
                      </a>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{formatPhone(member.phone)}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
