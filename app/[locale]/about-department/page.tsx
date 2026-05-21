"use client";
import { AboutDepartmentData } from '@/lib';

import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Users,
  BookOpen,
  Target,
  Eye,
  Heart,
  Briefcase,
} from "lucide-react";
import FacultyMemberModal from "@/components/about/FacultyMemberModal";
import { FacultyMember } from "@/lib";
import { useTranslations, useLocale } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton-loaders';


export default function AboutPage() {
  const t = useTranslations('aboutDepartment');
  const tCore = useTranslations('coreValues');
  const tmember = useTranslations('faculty-member');
  const tfacility = useTranslations('facilities');
  const locale = useLocale();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null);
  const { data, isLoading: loadingAbout } = useQuery<AboutDepartmentData | null>({
    queryKey: ['about-department', locale],
    queryFn: async () => {
      const res = await fetch('/api/about-department');
      if (!res.ok) throw new Error('Failed to fetch about department');
      return res.json();
    },
  });

  const { data: projects, isLoading: loadingProjects } = useQuery<any[]>({
    queryKey: ['student-projects', locale],
    queryFn: async () => {
      const res = await fetch('/api/student-projects');
      if (!res.ok) throw new Error('Failed to fetch student projects');
      return res.json();
    },
  });

  const { data: publications, isLoading: loadingPublications } = useQuery<any[]>({
    queryKey: ['publications', locale],
    queryFn: async () => {
      const res = await fetch('/api/publications');
      if (!res.ok) throw new Error('Failed to fetch publications');
      return res.json();
    },
  });

  const loading = loadingAbout || loadingProjects || loadingPublications;
  const projectCount = Array.isArray(projects) ? projects.length : 0;
  const publicationCount = Array.isArray(publications) ? publications.length : 0;

  const handleMemberClick = (member: FacultyMember) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const values = [
    {
      title: tCore('card1title'),
      description: tCore('card1des'),
    },
    {
      title: tCore('card2title'),
      description: tCore('card2des'),  
    },
    {
      title: tCore('card3title'),
      description: tCore('card3des'), 
    },
    {
      title: tCore('card4title'),
      description: tCore('card4des'), 
    },
    {
      title: tCore('card5title'),
      description: tCore('card5des'), 
    },
    {
      title: tCore('card6title'),
      description: tCore('card6des'), 
    },
  ];

  if (loading) {
    return <PageSkeleton />;
  }

  if (!data) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  // Filter faculty by leadership and staff
  const leadershipTeam = data.faculty.filter(f => f.is_leadership);
  const staffTeam = data.faculty.filter(f => f.is_staff);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/department/department.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="relative text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
              {t('header')}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              {t('sub-header')}
            </p>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-12 sm:space-y-12">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-4 bg-gray-200 p-1 rounded-lg">
            <TabsTrigger value="overview" className="rounded-md px-1 py-1.5 text-[10px] sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md">
              Overview
            </TabsTrigger>
            <TabsTrigger value="mission" className="rounded-md px-1 py-1.5 text-[10px] sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md">
              <span className="sm:hidden">Mission</span>
              <span className="hidden sm:inline">Mission & Vision</span>
            </TabsTrigger>
            <TabsTrigger value="leadership" className="rounded-md px-1 py-1.5 text-[10px] sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md">
              <span className="sm:hidden">Faculty</span>
              <span className="hidden sm:inline">Faculty Member</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="rounded-md px-1 py-1.5 text-[10px] sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-md">
              Facilities
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-12 sm:space-y-16">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                  {locale === 'th' ? data.about[0]?.overview_title_th : data.about[0]?.overview_title_en}
                </h2>
                <p className="text-base sm:text-lg text-slate-700 mb-4 sm:mb-6 leading-relaxed">
                  {locale === 'th' ? data.about[0]?.overview_description_th : data.about[0]?.overview_description_en}
                </p>
              </div>
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl order-1 lg:order-2">
                <Image
                  src="/AIGen/AI07.png"
                  alt="AI Department Facility"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
               {t('sub-title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="text-center p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Users className="h-12 w-12 text-sky-600 mx-auto mb-4" />
                  <h3 className="text-4xl font-bold mb-2">{data.faculty.length}+</h3>
                  <p className="text-muted-foreground">{t('member-details')}</p>
                </Card>

                <Card className="text-center p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                  <BookOpen className="h-12 w-12 text-sky-600 mx-auto mb-4" />
                  <h3 className="text-4xl font-bold mb-2">{projectCount}</h3>
                  <p className="text-muted-foreground">
                    {t('student-project')}
                  </p>
                </Card>

                <Card className="text-center p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Award className="h-12 w-12 text-sky-600 mx-auto mb-4" />
                  <h3 className="text-4xl font-bold mb-2">{publicationCount}</h3>
                  <p className="text-muted-foreground">{t('research-project')}</p>
                </Card>

                <Card className="text-center p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Briefcase className="h-12 w-12 text-sky-600 mx-auto mb-4" />
                  <h3 className="text-4xl font-bold mb-2">98%</h3>
                  <p className="text-muted-foreground">
                    {t('graduate-rate')}
                  </p>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Mission & Vision Tab */}
          <TabsContent value="mission" className="space-y-12 sm:space-y-16">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card className="bg-white p-5 sm:p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Target className="h-8 w-8 sm:h-10 sm:w-10 text-slate-700 shrink-0" />
                  <h2 className="text-xl sm:text-3xl font-bold">
                    {locale === 'th' ? data.about[0]?.mission_title_th : data.about[0]?.mission_title_en}
                  </h2>
                </div>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  {locale === 'th' ? data.about[0]?.mission_description_th : data.about[0]?.mission_description_en}
                </p>
              </Card>

              <Card className="bg-white p-5 sm:p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Eye className="h-8 w-8 sm:h-10 sm:w-10 text-slate-700 shrink-0" />
                  <h2 className="text-xl sm:text-3xl font-bold">
                    {locale === 'th' ? data.about[0]?.vision_title_th : data.about[0]?.vision_title_en}
                  </h2>
                </div>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  {locale === 'th' ? data.about[0]?.vision_description_th : data.about[0]?.vision_description_en}
                </p>
              </Card>
            </section>

            <section>
              <div className="text-center mb-8 sm:mb-10">
                <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-slate-700 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold">{tCore('title')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {values.map((value) => (
                  <Card key={value.title} className="p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Leadership Tab */}
          <TabsContent value="leadership" className="space-y-12 sm:space-y-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
                {tmember('teacher-title')}
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {leadershipTeam.map((member, idx) => (
                  <Card
                    key={member.id + idx}
                    onClick={() => handleMemberClick(member)}
                    className="w-full cursor-pointer max-w-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <CardContent className="p-0 text-center">
                      <div className="relative h-80">
                        <Image
                          src={member.image || "/placeholder-image.jpg"}
                          alt={locale === 'th' ? member.name_th : member.name_en}
                          fill
                          className="object-cover w-full h-full"
                          style={{
                            objectPosition: `${member.x ?? 50}% ${member.y ?? 50}%`,
                            transform: `scale(${member.zoom ?? 1})`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white text-left">
                          <h3 className="text-xl font-bold">
                            {locale === 'th' ? member.name_th : member.name_en}
                          </h3>
                          <p className="text-sm font-medium text-gray-200">
                            {locale === 'th' ? member.role_th : member.role_en}
                          </p>
                        </div>
                      </div>
                     
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
                {tmember('staff-title')}
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {staffTeam.map((staff, idx) => (
                  <Card
                    key={staff.id + idx}
                    onClick={() => handleMemberClick(staff)}
                    className="w-full cursor-pointer max-w-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <CardContent className="p-0 text-center">
                      <div className="relative h-80">
                        <Image
                          src={staff.image || "/placeholder-image.jpg"}
                          alt={locale === 'th' ? staff.name_th : staff.name_en}
                          fill
                          className="object-cover w-full h-full"
                          style={{
                            objectPosition: `${staff.x ?? 50}% ${staff.y ?? 50}%`,
                            transform: `scale(${staff.zoom ?? 1})`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                          <h3 className="text-xl font-bold">
                            {locale === 'th' ? staff.name_th : staff.name_en}
                          </h3>
                          <p className="text-sm font-medium text-gray-200">
                            {locale === 'th' ? staff.role_th : staff.role_en}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-12 sm:space-y-16">
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
              {tfacility('title')}
              </h2>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.facilities.map((facility, idx) => (
                  <Card key={facility.id || idx} className="overflow-hidden">
                    {facility.image && (
                      <div className="relative h-48">
                        <Image
                          src={facility.image}
                          alt={facility.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>
                        {locale === 'th' ? facility.name_th : facility.name_en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        {locale === 'th' ? facility.description_th : facility.description_en}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div> */}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Computing Machine</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>20 medium-end computer</li>
                    <li>Intel powered CPU</li>
                    <li>Equipped with NVIDIA RTX GPUs</li>
                    <li>Weekday Assessable</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>High Performance Computing Machine</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>AMD Ryzen 9</li>
                    <li>NVIDIA RTX 4080 GPUs</li>
                    <li>Permission Grant Needed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Facility</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Brain Computing Interface (BCI)</li>
                    <li>3D Printer</li>
                    <li>Microprocesser(Arduino, Esp32, Mircobit etc.)</li>
                    <li>etc. </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <FacultyMemberModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          member={selectedMember}
        />
      </div>
    </div>
  );
}
