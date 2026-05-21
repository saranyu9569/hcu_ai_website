'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, ChevronRight, Link2, Check } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons';
import { Badge } from '@/components/ui/badge';
import { NewsItem } from '@/lib';

// ─── Share section ────────────────────────────────────────────────────────────

function ShareSection({ title }: { title: string }) {
  const [pageUrl, setPageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

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
    <div className="my-10 py-8 border-t border-b border-gray-100">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
        Share this article
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

        {/* Instagram — no direct web-share URL; opens instagram.com */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Instagram"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
          style={{
            background:
              'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
          }}
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
          {copied ? (
            <><Check className="w-4 h-4" />Copied!</>
          ) : (
            <><Link2 className="w-4 h-4" />Copy link</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Article content renderer ─────────────────────────────────────────────────

function NewsContent({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none text-slate-700">
      {content.split('\n\n').map((paragraph, index) => {
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          return (
            <h3 key={index} className="text-xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-cyan-500 rounded-full inline-block flex-shrink-0" />
              {paragraph.replace(/\*\*/g, '')}
            </h3>
          );
        }
        if (paragraph.includes('•') || paragraph.includes('- ')) {
          const lines = paragraph.split('\n');
          const title = lines[0];
          const bullets = lines.slice(1).filter(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
          return (
            <div key={index} className="my-4">
              {title && !title.startsWith('•') && !title.startsWith('-') && (
                <p className="font-medium mb-2">{title}</p>
              )}
              <ul className="space-y-2 pl-4">
                {bullets.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <span className="mt-2.5 w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                    <span>{item.replace(/^[•\-]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        if (paragraph.trim()) {
          return <p key={index} className="leading-relaxed mb-4">{paragraph}</p>;
        }
        return null;
      })}
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

interface Props {
  news: NewsItem | null;
  locale: string;
}

export default function NewsDetailClient({ news, locale }: Props) {
  const router = useRouter();

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800 mb-4">News not found</p>
          <Link
            href="/news-events/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const title = locale === 'th' ? news.title_th : (news.title_en || news.title_th);
  const content = locale === 'th' ? news.content_th : (news.content_en || news.content_th);
  const formattedDate = new Date(news.publish_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-[420px] bg-slate-900 overflow-hidden">
        {news.image_path ? (
          <Image
            src={news.image_path}
            alt={title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-cyan-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-6 left-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
              {news.category}
            </span>
            <span className="flex items-center gap-1.5 text-white/80 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-cyan-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/news-events/news" className="hover:text-cyan-600 transition-colors">News</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-700 line-clamp-1 max-w-xs">{title}</span>
          </nav>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          {title}
        </h1>

        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-100">
          <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 font-medium px-3 py-1">
            <Tag className="w-3 h-3 mr-1.5" />
            {news.category}
          </Badge>
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
        </div>

        <NewsContent content={content} />

        <ShareSection title={title} />

        <div className="mt-14 pt-8 border-t border-gray-100">
          <Link
            href="/news-events/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All News
          </Link>
        </div>
      </div>
    </div>
  );
}
