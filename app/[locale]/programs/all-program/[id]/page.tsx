import { cache } from 'react';
import type { Metadata } from 'next';
import { query } from '@/lib/database';
import ProgramDetailClient from './ProgramDetailClient';

export type Program = {
  id: number;
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

type Props = { params: Promise<{ locale: string; id: string }> };

const getProgramById = cache(async (id: number): Promise<Program | null> => {
  const rows = await query<Program>('SELECT * FROM programs WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: idStr, locale } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) return { title: 'Program Not Found' };

  const program = await getProgramById(id);
  if (!program) return { title: 'Program Not Found' };

  const title = locale === 'th' ? program.name_th : program.name_en;
  const description = (locale === 'th' ? program.description_th : program.description_en)
    ?.replace(/\n/g, ' ')
    .trim()
    .substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: program.image ? [{ url: program.image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: program.image ? [program.image] : [],
    },
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { id: idStr, locale } = await params;
  const id = parseInt(idStr);
  const program = isNaN(id) ? null : await getProgramById(id);
  return <ProgramDetailClient program={program} locale={locale} />;
}
