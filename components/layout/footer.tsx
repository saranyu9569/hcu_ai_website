"use client";

import { FooterLink, FooterSocial } from "@/lib";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faYoutube,
  faInstagram,
  faTiktok,
  faLine,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

const socialIconMap: Record<string, any> = {
  facebook: faFacebookF,
  instagram: faInstagram,
  youtube: faYoutube,
  tiktok: faTiktok,
  line: faLine,
  x: faXTwitter,
};

export default function Footer() {
  const tUniversity = useTranslations("UniversityName");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const { data } = useQuery({
    queryKey: ["footer", locale],
    queryFn: async () => {
      const res = await fetch("/api/footer");
      if (!res.ok) throw new Error("Failed to fetch footer");
      return res.json();
    },
  });

  const links: FooterLink[] = data?.links || [];
  const social: FooterSocial[] = data?.social || [];

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      {/* ── Main strip ── */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center gap-5 sm:gap-4">
        {/* LEFT — social icons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {social.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.icon}
              className="text-white hover:text-teal-400 transition-colors duration-200"
            >
              <FontAwesomeIcon
                icon={socialIconMap[s.icon] || faFacebookF}
                className="w-4 h-4"
              />
            </a>
          ))}
        </div>

        {/* CENTER spacer + links */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          {links.map((link, idx) => (
            <span key={link.id} className="flex items-center">
              <Link
                href={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors px-2 py-0.5"
              >
                {locale === "th" ? link.name_th : link.name_en}
              </Link>
              {idx < links.length - 1 && (
                <span className="text-slate-600 select-none">|</span>
              )}
            </span>
          ))}
        </div>

        {/* RIGHT — university name + logo (same as navbar) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white leading-tight">
              {tUniversity("fullName")}
            </p>
            <p className="text-xs text-slate-400 leading-tight mt-0.5">
              {tUniversity("aiProgram")}
            </p>
          </div>
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/logo/hcu-logo.svg"
              alt="HCU Logo"
              fill
              className="object-contain rounded-md"
            />
          </div>
        </Link>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center">
          <p className="text-xs text-slate-500">
            © {currentYear} Huachiew Chalermprakiat University, Artificial Intelligence Program · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
