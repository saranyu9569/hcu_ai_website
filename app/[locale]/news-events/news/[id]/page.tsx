import { cache } from 'react';
import type { Metadata } from 'next';
import { query } from '@/lib/database';
import { NewsItem } from '@/lib';
import NewsDetailClient from './NewsDetailClient';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// Cached so generateMetadata and the page component share one DB round-trip
const getNewsById = cache(async (id: number): Promise<NewsItem | null> => {
  const rows = await query<NewsItem>(
    `SELECT n.id, n.title_th, n.title_en,
            n.content_th, n.content_en,
            n.image_path,
            cc.name_en AS category,
            n.publish_date, n.is_active
     FROM news n
     LEFT JOIN content_categories cc ON n.category_id = cc.id
     WHERE n.id = ? AND n.is_active = TRUE
     LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: idStr, locale } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) return { title: 'News Not Found' };

  const news = await getNewsById(id);
  if (!news) return { title: 'News Not Found' };

  const title = locale === 'th' ? news.title_th : (news.title_en || news.title_th);
  const rawContent = locale === 'th' ? news.content_th : (news.content_en || news.content_th);
  const description = rawContent.replace(/\*\*/g, '').replace(/\n/g, ' ').trim().substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: news.publish_date,
      images: news.image_path
        ? [{ url: news.image_path, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: news.image_path ? [news.image_path] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id: idStr, locale } = await params;
  const id = parseInt(idStr);
  const news = isNaN(id) ? null : await getNewsById(id);

  return <NewsDetailClient news={news} locale={locale} />;
}
