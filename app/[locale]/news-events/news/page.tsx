"use client";
import { NewsItem } from '@/lib';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, Search, Calendar } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';


// Categories for filtering
const categories = [
  "all",
  "Admission",
  "Academic", 
  "Research",
  "Training",
  "Event",
  "General"
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const router = useRouter();
  const locale = useLocale();
  
  // Optimized React Query with better caching and stale time
  const { data: newsItems = [], isLoading: loading, error } = useQuery<NewsItem[]>({
    queryKey: ['news', locale],
    queryFn: async () => {
      const response = await fetch('/api/news', {
        // Add cache headers
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch news');
      return response.json();
    },
    // Cache for 5 minutes, consider stale after 2 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    // Enable background refetch
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Retry failed requests
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  const tnews = useTranslations('news-page');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Memoize expensive computations
  const years = useMemo(() => {
    if (!newsItems.length) return ['all'];
    
    const uniqueYears = new Set(
      newsItems.map(news => new Date(news.publish_date).getFullYear().toString())
    );
    return ['all', ...Array.from(uniqueYears).sort((a, b) => parseInt(b) - parseInt(a))];
  }, [newsItems]);

  // Memoize filtered and sorted news
  const sortedNews = useMemo(() => {
    if (!newsItems.length) return [];
    
    const filtered = newsItems.filter(news => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || (
        news.title_th.toLowerCase().includes(searchLower) || 
        news.title_en.toLowerCase().includes(searchLower) ||
        news.content_th.toLowerCase().includes(searchLower) ||
        news.content_en.toLowerCase().includes(searchLower)
      );
      
      const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
      const matchesYear = selectedYear === 'all' || 
        new Date(news.publish_date).getFullYear().toString() === selectedYear;
      
      return matchesSearch && matchesCategory && matchesYear;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.publish_date).getTime();
      const dateB = new Date(b.publish_date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [newsItems, searchQuery, selectedCategory, selectedYear, sortOrder]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-48 sm:h-auto sm:w-1/3 bg-gray-200 animate-pulse" />
              <div className="p-6 sm:w-2/3 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load news</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{tnews('title')}</h1>
          <p className="text-lg text-gray-300 max-w-3xl">
           {tnews('sub-title')}
          </p>
        </div>
      </div>
      
      {/* News section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with search and filters */}
          <div className="lg:w-1/4">
            <div className="space-y-6 sticky top-24">
              <div>
                <h2 className="text-lg font-semibold mb-4">{tnews('search')}</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">{tnews('category')}</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                        selectedCategory === category 
                          ? 'bg-cyan-100 text-cyan-700 border border-cyan-200 shadow-sm' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-slate-700'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">{tnews('year')}</h2>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                        selectedYear === year 
                          ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-slate-700'
                      }`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year === 'all' ? 'All Years' : year}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">{tnews('sort')}</h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      sortOrder === 'newest' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setSortOrder('newest')}
                  >
                    {tnews('newest')}
                  </button>
                  <button
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      sortOrder === 'oldest' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setSortOrder('oldest')}
                  >
                    {tnews('oldest')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content with news listing */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{tnews('lastest-news')}</h2>
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `${sortedNews.length} articles found`}
              </p>
            </div>
            
            {loading ? (
              <LoadingSkeleton />
            ) : sortedNews.length > 0 ? (
              <div className="space-y-6">
                {sortedNews.map((news) => (
                  <Card
                    key={news.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => router.push(`/news-events/news/${news.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {news.image_path && (
                          <div className="relative h-48 sm:h-auto sm:w-1/3 overflow-hidden">
                            <img
                              src={news.image_path}
                              alt={news.title_th}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-6 sm:w-2/3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(news.publish_date).toLocaleDateString()}</span>
                            </div>
                            <div className="inline-block px-2 py-1 rounded-full bg-teal-100 text-slate-800 text-xs">
                              {news.category}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-700 transition-colors">
                            {locale === 'th' ? news.title_th : (news.title_en || news.title_th)}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {(locale === 'th' ? news.content_th : (news.content_en || news.content_th)).substring(0, 150)}...
                          </p>
                          <span className="text-sm text-primary font-bold hover:underline">
                            Read More
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No news found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}