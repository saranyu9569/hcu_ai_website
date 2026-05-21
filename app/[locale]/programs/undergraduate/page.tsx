"use client";
import { CareerMetric, Career } from '@/lib';
import { PageSkeleton } from '@/components/ui/skeleton-loaders';

import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, GraduationCap, Users, CheckCircle, Layers } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView } from 'framer-motion';



function YearGridCard({ year, index }: { year: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const yearNum = String(year.year_number || index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.12 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ring-1 ring-slate-200 hover:ring-slate-300 group">

        {/* White header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-slate-100 overflow-hidden">
          {/* Faded decorative year number */}
          <span
            aria-hidden="true"
            className="absolute -right-2 -bottom-4 text-[8rem] font-black leading-none select-none text-slate-100"
          >
            {yearNum}
          </span>

          {/* Year number circle + title */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center border border-slate-200">
              <span className="text-slate-200 font-bold text-lg">{year.year_number || index + 1}</span>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-lg leading-snug">{year.year_title}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">
                  {year.subjects?.length || 0} Subjects
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2">
            {year.subjects?.map((subject: any, i: number) => (
              <motion.span
                key={subject.id}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.25, ease: 'easeOut', delay: 0.18 + index * 0.08 + i * 0.04 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-default transition-colors duration-200 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300"
              >
                <BookOpen className="h-3 w-3 opacity-50 flex-shrink-0" />
                {subject.subject_name}
              </motion.span>
            ))}

            {(!year.subjects || year.subjects.length === 0) && (
              <span className="text-sm text-gray-400 italic py-2">No subjects listed</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function UndergraduatePage() {
  // State สำหรับข้อมูลแต่ละ section
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);

  const params = useParams();
  const locale = params?.locale || 'en';
  // Helper สำหรับเลือก field ตาม locale
  const getField = (en: string, th: string) => (locale === 'th' ? (th || en) : en);

  const tcurri = useTranslations('undergrad');

  const { data: overview, isLoading: loadingOverview, error: errorOverview } = useQuery<any>({
    queryKey: ['undergraduate-overview', locale],
    queryFn: async () => {
      const res = await fetch('/api/undergraduate/overview');
      if (!res.ok) throw new Error('Failed to load overview');
      return res.json();
    },
  });
  const { data: curriculum = [], isLoading: loadingCurriculum, error: errorCurriculum } = useQuery<any[]>({
    queryKey: ['undergraduate-curriculum', locale],
    queryFn: async () => {
      const res = await fetch('/api/undergraduate/curriculum');
      if (!res.ok) throw new Error('Failed to load curriculum');
      return res.json();
    },
  });
  const { data: careers = [], isLoading: loadingCareers, error: errorCareers } = useQuery<any[]>({
    queryKey: ['undergraduate-careers', locale],
    queryFn: async () => {
      const res = await fetch('/api/undergraduate/careers');
      if (!res.ok) throw new Error('Failed to load careers');
      return res.json();
    },
  });

  const loading = loadingOverview || loadingCurriculum || loadingCareers;
  const error = errorOverview?.message || errorCurriculum?.message || errorCareers?.message || null;

  // toggleCareer เหมือนเดิม
  const toggleCareer = (careerName: string) => {
    setSelectedCareers(prev => {
      if (prev.includes(careerName)) {
        return prev.filter(name => name !== careerName);
      } else {
        return [...prev, careerName];
      }
    });
  };

  // getChartData ใหม่: ใช้ careers state
  const getChartData = () => {
    const skills = ['Technical Skills', 'Problem Solving', 'Communication', 'Leadership', 'Research', 'Business Impact'];
    return skills.map(skill => {
      const dataPoint: { [key: string]: string | number } = { skill };
      selectedCareers.forEach(careerName => {
        const career = careers.find((c: any) => c.name === careerName);
        if (career && career.metrics) {
          dataPoint[careerName] = career.metrics[skill];
        }
      });
      return dataPoint;
    });
  };

  if (loading) return <PageSkeleton />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-500">{error}</div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{getField(overview?.program_title, overview?.program_title_th)}</h1>
        </div>
      </div>
      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-gray-100">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="careers">Careers</TabsTrigger>
            </TabsList>
          </div>
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            {/* Program Overview */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6">{getField('Program Overview: Course 2568', overview?.overview_heading_th)}</h2>
                <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 lg:mb-6">
                  {getField(overview?.program_description, overview?.program_description_th)}
                </p>
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                    <span className="text-xs sm:text-sm lg:text-base"><strong>Duration:</strong> {getField(overview?.duration, overview?.duration_th)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                    <span className="text-xs sm:text-sm lg:text-base"><strong>Credits:</strong> {getField(overview?.credits, overview?.credits_th)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                    <span className="text-xs sm:text-sm lg:text-base"><strong>Degree:</strong> {getField(overview?.degree, overview?.degree_th)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                    <span className="text-xs sm:text-sm lg:text-base"><strong>Class Size:</strong> {getField(overview?.class_size, overview?.class_size_th)}</span>
                  </div>
                </div>
              </div>
              <div className="relative h-48 sm:h-56 lg:h-64 xl:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                {overview?.lab_image ? (
                  <img
                    src={overview.lab_image}
                    alt="Lab"
                    className="object-contain max-h-full max-w-full mx-auto"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />
                ) : (
                  <span className="text-gray-500 text-xs sm:text-sm lg:text-base">AI Laboratory Image</span>
                )}
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-6">Program Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {overview?.highlights?.map((hl: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <CheckCircle className="h-8 w-8 text-sky-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{hl.title}</h3>
                      <p className="text-muted-foreground">{hl.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-4">
                  {tcurri('cirriculum-title')}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {tcurri('cirriculum-des')}
                </p>
              </motion.div>

              {/* 2x2 Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {curriculum.map((year: any, idx: number) => (
                  <YearGridCard
                    key={year.id}
                    year={year}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          {/* Careers Tab */}
          <TabsContent value="careers" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">{tcurri('career-title')}</h2>
              <p className="text-lg mb-8">
                {tcurri('career-des')}
              </p>
              <div className="space-y-8 xl:space-y-0 xl:gap-8 xl:grid xl:grid-cols-3">
                {/* Career Cards */}
                <div className="col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Select Careers to Compare</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                    {careers.map((career: any) => (
                      <Card
                        key={career.name}
                        className={`cursor-pointer transition-all duration-200 border border-gray-200 hover:shadow-xl rounded-xl bg-white ${selectedCareers.includes(career.name)
                          ? 'ring-2 ring-offset-2 shadow-lg border-cyan-400'
                          : 'hover:shadow-md'
                          }`}
                        style={{
                          borderColor: selectedCareers.includes(career.name) ? career.color : undefined,
                          '--tw-ring-color': selectedCareers.includes(career.name) ? career.color : undefined
                        } as React.CSSProperties}
                        onClick={() => toggleCareer(career.name)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-white shadow"
                              style={{ backgroundColor: career.color }}
                            />
                            <h4 className="font-semibold text-base text-slate-900">{getField(career.name, career.name_th)}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 min-h-[40px]">
                            {getField(career.description, career.description_th)}
                          </p>
                          <p className="text-xs font-medium text-slate-700 mb-1">{getField(career.salary, career.salary_th)}</p>
                          {selectedCareers.includes(career.name) && (
                            <div className="mt-2 text-xs text-cyan-600 font-medium">
                              ✓ Selected for comparison
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                {/* Spider Chart & Skills Comparison */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">Skills Comparison</h3>
                    {selectedCareers.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCareers([])}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  <Card className="p-6">
                    {selectedCareers.length === 0 ? (
                      <div className="h-96 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="text-4xl mb-4">📊</div>
                          <p>Select careers above to compare their skill requirements</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={getChartData()}>
                            <PolarGrid />
                            <PolarAngleAxis
                              dataKey="skill"
                              tick={{ fontSize: 10 }}
                              className="text-xs"
                            />
                            <PolarRadiusAxis
                              angle={90}
                              domain={[0, 100]}
                              tick={{ fontSize: 8 }}
                              tickCount={6}
                            />
                            {selectedCareers.map((careerName) => {
                              const career = careers.find((c: any) => c.name === careerName);
                              if (!career) return null;
                              return (
                                <Radar
                                  key={careerName}
                                  name={careerName}
                                  dataKey={careerName}
                                  stroke={career.color}
                                  fill={career.color}
                                  fillOpacity={0.1}
                                  strokeWidth={2}
                                />
                              );
                            })}
                            <Legend
                              wrapperStyle={{ fontSize: '10px' }}
                              iconType="line"
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </Card>
                  {selectedCareers.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-2">
                      <p className="mb-2 font-medium">Skills Scale (0-100):</p>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>Technical Skills:</strong> Programming, AI/ML expertise, system design</li>
                        <li>• <strong>Problem Solving:</strong> Analytical thinking, creative solutions</li>
                        <li>• <strong>Communication:</strong> Presenting ideas, documentation, teamwork</li>
                        <li>• <strong>Leadership:</strong> Project management, mentoring, decision making</li>
                        <li>• <strong>Research:</strong> Literature review, experimentation, innovation</li>
                        <li>• <strong>Business Impact:</strong> Commercial awareness, ROI understanding</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}