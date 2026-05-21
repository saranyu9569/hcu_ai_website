"use client";
import { DynamicStudentProject, DynamicPublication } from '@/lib';

import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  ScanEye,
  BookOpen,
  ExternalLink,
  AudioWaveform,
  HeartPulse,
} from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/skeleton-loaders';


const researchAreas = [
  {
    name: "Computer Vision",
    description: "Developing algorithms to help computers see and understand the world.",
    icon: ScanEye,
  },
  {
    name: "Signal Processing",
    description: "Analyzing and modifying signals like audio, images, and sensor data.",
    icon: AudioWaveform,
  },
  {
    name: "Medical Application",
    description: "Applying AI to improve diagnostics, treatment, and patient outcomes.",
    icon: HeartPulse,
  },
];

export default function ResearchPage() {
  const t = useTranslations('project-research');
  const locale = useLocale();
  // Search and filter states
  const [publicationSearch, setPublicationSearch] = useState("");
  const [publicationYear, setPublicationYear] = useState("all");
  const [projectSearch, setProjectSearch] = useState("");
  const [projectYear, setProjectYear] = useState("all");
  const [projectCategory, setProjectCategory] = useState("all");
  const [tab, setTab] = useState("projects");
  const router = useRouter();

  // Dynamic data
  const { data: studentProjects = [], isLoading: loadingProjects } = useQuery<DynamicStudentProject[]>({
    queryKey: ['student-projects', locale],
    queryFn: async () => {
      const res = await fetch('/api/student-projects');
      if (!res.ok) throw new Error('Failed to fetch student projects');
      return res.json();
    },
  });
  const { data: publications = [], isLoading: loadingPublications } = useQuery<DynamicPublication[]>({
    queryKey: ['publications', locale],
    queryFn: async () => {
      const res = await fetch('/api/publications');
      if (!res.ok) throw new Error('Failed to fetch publications');
      return res.json();
    },
  });
  const loading = loadingProjects || loadingPublications;

  // Get unique years and categories for filter options
  const projectYears = [...new Set(studentProjects.map((p) => p.year))].sort().reverse();
  // For dynamic, you may want to add a category field to the DB, but for now, just use 'All'
  const projectCategories = ["All"];
  const publicationYears = [...new Set(publications.map((p) => p.year))].sort().reverse();

  // Filter functions
  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      (locale === 'th'
        ? ((pub.title_th || '').toLowerCase().includes(publicationSearch.toLowerCase()) ||
           (pub.authors_th || '').toLowerCase().includes(publicationSearch.toLowerCase()) ||
           (pub.description_th || '').toLowerCase().includes(publicationSearch.toLowerCase()))
        : ((pub.title_en || '').toLowerCase().includes(publicationSearch.toLowerCase()) ||
           (pub.authors_en || '').toLowerCase().includes(publicationSearch.toLowerCase()) ||
           (pub.description_en || '').toLowerCase().includes(publicationSearch.toLowerCase()))
      );
    const matchesYear = publicationYear === "all" || pub.year.toString() === publicationYear;
    return matchesSearch && matchesYear;
  });

  const filteredProjects = studentProjects.filter((project) => {
    const matchesSearch =
      (locale === 'th'
        ? ((project.title_th || '').toLowerCase().includes(projectSearch.toLowerCase()) ||
           (project.description_th || '').toLowerCase().includes(projectSearch.toLowerCase()))
        : ((project.title_en || '').toLowerCase().includes(projectSearch.toLowerCase()) ||
           (project.description_en || '').toLowerCase().includes(projectSearch.toLowerCase()))
      );
    const matchesYear = projectYear === "all" || project.year.toString() === projectYear;
    // No category in DB, so always true
    return matchesSearch && matchesYear;
  });

  // Reset filters function
  const resetProjectFilters = () => {
    setProjectSearch("");
    setProjectYear("all");
    setProjectCategory("all");
  };

  const resetPublicationFilters = () => {
    setPublicationSearch("");
    setPublicationYear("all");
  };


  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/AIGen/AI07.png')] bg-cover bg-center opacity-10"></div>
          <div className="relative text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              {t('sub-title')}
            </p>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Tabs value={tab} onValueChange={setTab} className="space-y-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-200 p-1 rounded-lg">
            <TabsTrigger value="projects" className="rounded-md px-1 py-1.5 text-[10px] sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md">{t('student-project')}</TabsTrigger>
            <TabsTrigger value="publications" className="rounded-md px-1 py-1.5 text-[10px] sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md">{t('publications-title')}</TabsTrigger>
          </TabsList>
          
          {/* Student Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="w-full md:w-1/4">
                <div className="space-y-6 sticky top-24 bg-white p-6 rounded-lg shadow-sm">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('search-student')}</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('search-student')}
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="pl-10 bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('year')}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge onClick={() => setProjectYear("all")} variant={projectYear === 'all' ? 'default' : 'outline'} className="cursor-pointer">All</Badge>
                      {projectYears.map((year) => (
                        <Badge key={year} onClick={() => setProjectYear(year.toString())} variant={projectYear === year.toString() ? 'default' : 'outline'} className="cursor-pointer">{year}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* No category filter for now */}

                  <div className="pt-4 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-sky-600 hover:bg-teal-100" onClick={resetProjectFilters}>
                      {t('reset')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">{t('student-project')}</h2>
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredProjects.length} of {studentProjects.length} projects
                  </div>
                </div>
                
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                      <Card 
                        key={project.id} 
                        className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                        onClick={() => router.push(`/project-research/${project.id}`)}
                      >
                        <CardContent className="p-0 h-full flex flex-col">
                          <div className="relative h-48">
                            <Image src={project.image} alt={project.title_en} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                          </div>
                          <div className="p-4 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              {/* No category in DB, so skip */}
                              <Badge variant="secondary">{project.year}</Badge>
                            </div>
                            <h3 className="font-semibold mb-2 flex-grow">{locale === 'th' ? project.title_th : project.title_en}</h3>
                            {/* No student/advisor in DB, so skip */}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground mb-4">There are no projects matching your current filters.</p>
                    <Button onClick={resetProjectFilters}>{t('reset')}</Button>
                  </div>
                )}
              </div>
            </div>

          </TabsContent>

          {/* Publications Tab */}
          <TabsContent value="publications" className="space-y-8">
            {/* Research Areas Section */}
            <section>
                <h2 className="text-3xl font-bold text-center mb-10">{t('research-title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {researchAreas.map((area, idx) => (
                    <div key={area.name} className="bg-white p-6 rounded-lg shadow-sm text-center transition-all hover:shadow-lg hover:-translate-y-1">
                      <area.icon className="h-12 w-12 mx-auto text-sky-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{t(`area${idx+1}`) || area.name}</h3>
                      <p className="text-gray-600">{t(area.name.toLowerCase().replace(/ /g, '-') + '-subtitle') || area.description}</p>
                    </div>
                  ))}
                </div>
              </section>
              
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="w-full md:w-1/4">
                <div className="space-y-6 sticky top-24 bg-white p-6 rounded-lg shadow-sm">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('search-publications')}</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('search-publications')}
                        value={publicationSearch}
                        onChange={(e) => setPublicationSearch(e.target.value)}
                        className="pl-10 bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('year')}</h3>
                     <div className="flex flex-wrap gap-2">
                      <Badge onClick={() => setPublicationYear("all")} variant={publicationYear === 'all' ? 'default' : 'outline'} className="cursor-pointer">All</Badge>
                      {publicationYears.map((year) => (
                        <Badge key={year} onClick={() => setPublicationYear(year.toString())} variant={publicationYear === year.toString() ? 'default' : 'outline'} className="cursor-pointer">{year}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-sky-600 hover:bg-teal-100" onClick={resetPublicationFilters}>
                      {t('reset')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">{t('publications-title')}</h2>
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredPublications.length} of {publications.length} publications
                  </div>
                </div>

                {filteredPublications.length > 0 ? (
                  <div className="space-y-6">
                    {filteredPublications.map((pub) => (
                      <Card key={pub.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">{pub.year}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{locale === 'th' ? pub.title_th : pub.title_en}</h3>
                          {/* Authors under title */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(pub.authors && Array.isArray(pub.authors) && pub.authors.length > 0
                              ? pub.authors.map((a: any, idx: number) => (
                                  <span key={idx} className="bg-teal-100 text-slate-700 px-2 py-1 rounded text-xs">
                                    {locale === 'th' ? a.name_th : a.name_en}
                                  </span>
                                ))
                              : (typeof (locale === 'th' ? pub.authors_th : pub.authors_en) === 'string'
                                  ? ((locale === 'th' ? pub.authors_th : pub.authors_en) as string).split(',').map((name: string, idx: number) => (
                                      name.trim() && <span key={idx} className="bg-teal-100 text-slate-700 px-2 py-1 rounded text-xs">{name.trim()}</span>
                                    ))
                                  : null
                                )
                            )}
                          </div>
                          <div className="bg-gray-100 p-4 rounded-md mb-4 border-l-4 border-teal-300">
                            <p className="text-sm text-slate-700 italic">{locale === 'th' ? pub.description_th : pub.description_en}</p>
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            {pub.link && (
                              <Button asChild variant="link" className="p-0 text-sky-600">
                                <Link href={pub.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                    {t('view-publication') || 'View Publication'} <ExternalLink className="h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                            {/* Keywords as tags at bottom right */}
                            <div className="flex flex-wrap gap-1 ml-auto">
                              {(pub.keywords && Array.isArray(pub.keywords) && pub.keywords.length > 0
                                ? pub.keywords.map((kw: string, idx: number) => (
                                    <span key={idx} className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs">{kw}</span>
                                  ))
                                : (typeof pub.keywords === 'string' ? (pub.keywords as string).split(',').map((kw: string, idx: number) => (
                                    kw.trim() && <span key={idx} className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs">{kw.trim()}</span>
                                  )) : null)
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No publications found</h3>
                    <p className="text-muted-foreground mb-4">There are no publications matching your search criteria.</p>
                    <Button onClick={resetPublicationFilters}>{t('reset')}</Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
