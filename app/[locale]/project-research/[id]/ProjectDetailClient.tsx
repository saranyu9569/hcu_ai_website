'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, ChevronLeft, Users, Check, Link2, ExternalLink, Images } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons';
import type { StudentProject } from './page';

// ─── Image carousel ──────────────────────────────────────────────────────────

function ImageCarousel({ images }: { images: { id: number; image_url: string }[] }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() =>
    setCurrent(c => (c + 1) % images.length), [images.length]);

  if (!images.length) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        <Images className="w-3.5 h-3.5" />
        Gallery
      </div>

      <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200" style={{ paddingTop: '56.25%' }}>
        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-500 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image
              src={img.image_url}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
        ))}

        {/* Arrows — only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/40 text-white text-xs font-medium">
            {current + 1} / {images.length}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Share section ────────────────────────────────────────────────────────────

function ShareSection({ title }: { title: string }) {
  const [pageUrl, setPageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { setPageUrl(window.location.href); }, []);

  const encoded = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: 'Facebook',
      icon: faFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      bg: 'bg-[#1877F2] hover:bg-[#0e63d0]',
    },
    {
      label: 'X',
      icon: faXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      bg: 'bg-black hover:bg-zinc-700',
    },
    {
      label: 'Line',
      icon: faLine,
      href: `https://social-plugins.line.me/lineit/share?url=${encoded}`,
      bg: 'bg-[#00B900] hover:bg-[#009900]',
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      const el = document.createElement('input');
      el.value = pageUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-10 py-8 border-t border-b border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
        Share this project
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        {shareLinks.map(({ label, icon, href, bg }) => (
          <a
            key={label}
            href={pageUrl ? href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${label}`}
            className={`inline-flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm ${bg}`}
          >
            <FontAwesomeIcon icon={icon} className="w-5 h-5" />
          </a>
        ))}

        {/* Instagram */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Instagram"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
          style={{ background: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
        >
          <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
        </a>

        {/* Copy link */}
        <button
          onClick={copyLink}
          aria-label="Copy link"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
            copied
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {copied
            ? <><Check className="w-4 h-4" />Copied!</>
            : <><Link2 className="w-4 h-4" />Copy link</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  project: StudentProject | null;
  locale: string;
}

export default function ProjectDetailClient({ project, locale }: Props) {
  const router = useRouter();

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800 mb-4">Project not found</p>
          <Link
            href="/project-research"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research
          </Link>
        </div>
      </div>
    );
  }

  const title = locale === 'th' ? project.title_th : project.title_en;
  const details = locale === 'th' ? project.details_th : project.details_en;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero image */}
      <div className="relative w-full h-64 sm:h-80 md:h-[420px] bg-slate-900 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={title}
            fill
            className="object-cover opacity-75"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-5 left-4 sm:left-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Year + course badge */}
        <div className="absolute bottom-5 left-4 sm:left-6 flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full uppercase tracking-wide">
            {project.year}
          </span>
          {project.course && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {project.course}
            </span>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/project-research" className="hover:text-slate-800 transition-colors">Projects & Research</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-700 line-clamp-1 max-w-xs">{title}</span>
          </nav>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-8">
          {title}
        </h1>

        <div className="space-y-8">
          {/* Authors + Advisors on the same row */}
          {(project.authors?.some(a => (locale === 'th' ? a.name_th : a.name_en).trim()) ||
            project.advisors?.some(a => (locale === 'th' ? a.name_th : a.name_en).trim())) && (
            <section className="flex flex-wrap gap-x-10 gap-y-5">
              {project.authors?.filter(a => (locale === 'th' ? a.name_th : a.name_en).trim()).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    {locale === 'th' ? 'ผู้จัดทำ' : 'Authors'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.authors
                      .filter(a => (locale === 'th' ? a.name_th : a.name_en).trim())
                      .map((a, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full border border-slate-200">
                          {locale === 'th' ? a.name_th : a.name_en}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              {project.advisors?.filter(a => (locale === 'th' ? a.name_th : a.name_en).trim()).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    {locale === 'th' ? 'ที่ปรึกษา' : 'Advisors'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.advisors
                      .filter(a => (locale === 'th' ? a.name_th : a.name_en).trim())
                      .map((a, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full border border-slate-200">
                          {locale === 'th' ? a.name_th : a.name_en}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Gallery carousel */}
          {project.images?.length > 0 && (
            <ImageCarousel images={project.images} />
          )}

          {/* Details */}
          {details && (
            <section className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Details
              </div>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-3">
                {details.split('\n').filter(Boolean).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* External link */}
          {project.link && (
            <div className="pt-2">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {locale === 'th' ? 'ดูรายละเอียด' : 'View Project'}
              </a>
            </div>
          )}
        </div>

        <ShareSection title={title} />
      </div>
    </div>
  );
}
