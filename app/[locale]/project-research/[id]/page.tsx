import { cache } from 'react';
import type { Metadata } from 'next';
import { query } from '@/lib/database';
import ProjectDetailClient from './ProjectDetailClient';

export type StudentProject = {
  id: number;
  title_th: string;
  title_en: string;
  course: string;
  details_th: string;
  details_en: string;
  year: number;
  image: string;
  link?: string;
  authors:  { name_th: string; name_en: string }[];
  advisors: { name_th: string; name_en: string }[];
  images:   { id: number; image_url: string }[];
};

type Props = { params: Promise<{ locale: string; id: string }> };

const getProjectById = cache(async (id: number): Promise<StudentProject | null> => {
  const rows = await query(
    'SELECT * FROM student_projects WHERE id = ? LIMIT 1',
    [id]
  ) as any[];
  if (!rows.length) return null;

  const project = rows[0];
  const [authors, advisors, images] = await Promise.all([
    query('SELECT name_th, name_en FROM student_project_authors WHERE project_id = ? ORDER BY sort_order', [id]),
    query('SELECT name_th, name_en FROM student_project_advisors WHERE project_id = ? ORDER BY sort_order', [id]),
    query('SELECT id, image_url FROM student_project_images WHERE project_id = ? ORDER BY sort_order ASC, id ASC', [id]),
  ]) as [any[], any[], any[]];
  project.authors  = authors;
  project.advisors = advisors;
  project.images   = images;
  return project;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: idStr, locale } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) return { title: 'Project Not Found' };

  const project = await getProjectById(id);
  if (!project) return { title: 'Project Not Found' };

  const title = locale === 'th' ? project.title_th : project.title_en;
  const description = (locale === 'th' ? project.details_th : project.details_en)
    ?.replace(/\n/g, ' ').trim().substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: project.image ? [{ url: project.image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id: idStr, locale } = await params;
  const id = parseInt(idStr);
  const project = isNaN(id) ? null : await getProjectById(id);
  return <ProjectDetailClient project={project} locale={locale} />;
}
