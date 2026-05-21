'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Calendar, Download,
  ExternalLink, FileText, Info, Link2, Check, PlayCircle,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons';
import type { Program } from './page';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function typeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
}

function formatDateDMY(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// Convert YouTube / Vimeo watch URLs to embed URLs
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
    }
    if (u.hostname === 'youtu.be') {
      const v = u.pathname.slice(1);
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const v = u.pathname.split('/').filter(Boolean).pop();
      if (v) return `https://player.vimeo.com/video/${v}`;
    }
    // Already an embed URL or direct video file — return as-is
    return url;
  } catch {
    return null;
  }
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

// ─── Video section ────────────────────────────────────────────────────────────

function VideoSection({ videoUrl }: { videoUrl: string }) {
  const embed = toEmbedUrl(videoUrl);
  if (!embed) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        <PlayCircle className="w-3.5 h-3.5" />
        Program Video
      </div>
      <div className="relative w-full rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-200 bg-slate-900" style={{ paddingTop: '56.25%' }}>
        {isDirectVideo(embed) ? (
          <video
            className="absolute inset-0 w-full h-full"
            controls
            preload="metadata"
          >
            <source src={embed} />
          </video>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embed}
            title="Program video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
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
        Share this program
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
          {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Link2 className="w-4 h-4" />Copy link</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

interface Props {
  program: Program | null;
  locale: string;
}

export default function ProgramDetailClient({ program, locale }: Props) {
  const router = useRouter();

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800 mb-4">Program not found</p>
          <Link
            href="/programs/all-program"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Programs
          </Link>
        </div>
      </div>
    );
  }

  const name       = locale === 'th' ? program.name_th        : program.name_en;
  const desc       = locale === 'th' ? program.description_th : program.description_en;
  const benefits   = locale === 'th' ? program.benefits_th    : program.benefits_en;
  const howToApply = locale === 'th' ? program.how_to_apply_th: program.how_to_apply_en;

  const dateRange = [formatDateDMY(program.start_date), formatDateDMY(program.end_date)]
    .filter(Boolean)
    .join(' — ');

  return (
    <div className="min-h-screen bg-white">

      {/* Hero image */}
      <div className="relative w-full h-64 sm:h-80 md:h-[400px] bg-slate-900 overflow-hidden">
        {program.image ? (
          <img
            src={program.image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-75"
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

        {/* Type badge + date */}
        <div className="absolute bottom-5 left-4 sm:left-6 right-4 sm:right-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full uppercase tracking-wide">
              {typeLabel(program.type)}
            </span>
            {dateRange && (
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                {dateRange}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/programs/all-program" className="hover:text-slate-800 transition-colors">All Programs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-700 line-clamp-1 max-w-xs">{name}</span>
          </nav>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Sidebar ─────────────────────────────── */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-5">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Type</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {typeLabel(program.type)}
                </span>
              </div>

              {/* Dates */}
              {dateRange && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</p>
                  <p className="text-sm text-slate-700">{dateRange}</p>
                </div>
              )}

              <div className="pt-1 flex flex-col gap-2">
                {program.apply_link && (
                  <a
                    href={program.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </a>
                )}
                {program.course_file && (
                  <a
                    href={program.course_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Course File
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────── */}
          <main className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-8">
              {name}
            </h1>

            <div className="space-y-8 text-slate-700">
              {desc && (
                <section>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    <Info className="w-3.5 h-3.5" />
                    Description
                  </div>
                  <p className="text-base leading-relaxed">{desc}</p>
                </section>
              )}

              {benefits && (
                <section className="pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    <FileText className="w-3.5 h-3.5" />
                    What You Will Get
                  </div>
                  <p className="text-base leading-relaxed">{benefits}</p>
                </section>
              )}

              {howToApply && (
                <section className="pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    <ExternalLink className="w-3.5 h-3.5" />
                    How to Apply
                  </div>
                  <p className="text-base leading-relaxed">{howToApply}</p>
                </section>
              )}
            </div>

            {/* Video — only renders when video_url exists */}
            {program.video_url && <VideoSection videoUrl={program.video_url} />}

            <ShareSection title={name} />
          </main>
        </div>
      </div>
    </div>
  );
}
