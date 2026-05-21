"use client";

import { useState } from 'react';
import { PageSkeleton } from '@/components/ui/skeleton-loaders';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, Users, GraduationCap } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทุกหมวดวิชา');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  const params = useParams();
  const locale = params?.locale || 'en';
  const getField = (en: string, th: string) => (locale === 'th' ? (th || en) : en);

  const { data: courses = [], isLoading: loading, error } = useQuery<any[]>({
    queryKey: ['courses', locale],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to load courses');
      return res.json();
    },
  });

  // 1. หา unique categories
  const categories = Array.from(new Set((courses as any[]).map(c => c.category))).filter((c): c is string => Boolean(c));

  // 2. Filter courses ตาม category
  const filteredCourses = (courses as any[]).filter(course => {
    const matchesSearch =
      (course.title_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title_th?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description_th?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.clos || []).some((clo: any) =>
        (clo.clo_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (clo.clo_th || '').toLowerCase().includes(searchQuery.toLowerCase())
      ));
    const matchesCategory = selectedCategory === 'ทุกหมวดวิชา' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <PageSkeleton />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-500">{(error as Error).message}</div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Course Catalog</h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Explore our comprehensive curriculum designed to provide students with
            both theoretical foundations and practical skills in artificial intelligence.
          </p>
        </div>
      </div>
      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              {/* Search Bar */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Search Courses</h2>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, code, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {/* Filter by Category */}
              <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
              <div className="flex md:flex-col gap-2">
                <Button
                  variant={selectedCategory === 'ทุกหมวดวิชา' ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start ${selectedCategory === 'ทุกหมวดวิชา' ? 'bg-black text-white' : ''}`}
                  onClick={() => setSelectedCategory('ทุกหมวดวิชา')}
                >
                  ทุกหมวดวิชา
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-start ${selectedCategory === cat ? 'bg-cyan-700 text-white' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {/* Main content */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Available Courses</h2>
                <p className="text-muted-foreground">
                  {loading ? 'Loading...' : error ? error : `${filteredCourses.length} ${filteredCourses.length === 1 ? 'course' : 'courses'} found`}
                </p>
              </div>
              <div className="space-y-6">
                {filteredCourses.map((course) => (
                  <Dialog key={course.id}>
                    <DialogTrigger asChild>
                      <Card
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold">{course.code}: {getField(course.title_en, course.title_th)}</h3>
                                {course.category && (
                                  <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 ml-2">
                                    {course.category}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{course.credits}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            {getField(course.description_en, course.description_th)}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Prerequisites:</h4>
                              <p className="text-sm text-muted-foreground">{getField(course.prerequisites_en, course.prerequisites_th)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">CLOs:</h4>
                              <div className="flex flex-wrap gap-1">
                                {course.clos && course.clos.map((clo: any, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    CLO{index + 1}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              Course Code: {course.code}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl w-full">
                      {selectedCourse && selectedCourse.id === course.id && (
                        <div>
                          <DialogHeader>
                            <DialogTitle>
                              {selectedCourse.code}: {getField(selectedCourse.title_en, selectedCourse.title_th)}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-2 mb-4 text-muted-foreground">
                            <span className="font-semibold">หมวดวิชา: </span>{selectedCourse.category}
                          </div>
                          <div className="mb-4">
                            <span className="font-semibold">Credits: </span>{selectedCourse.credits}
                          </div>
                          <div className="mb-4">
                            <span className="font-semibold">Prerequisite: </span>{getField(selectedCourse.prerequisites_en, selectedCourse.prerequisites_th) || 'none'}
                          </div>
                          <div className="mb-4">
                            <span className="font-semibold">Description:</span>
                            <p className="mt-1 whitespace-pre-line">{getField(selectedCourse.description_en, selectedCourse.description_th)}</p>
                          </div>
                          <div className="mb-4">
                            <span className="font-semibold">ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):</span>
                            <ol className="list-decimal ml-6 mt-2 space-y-1">
                              {selectedCourse.clos && selectedCourse.clos.map((clo: any, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground">
                                  {clo.clo_th}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              {(!loading && !error && filteredCourses.length === 0) && (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    There are no courses matching your search criteria.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ทุกหมวดวิชา');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}