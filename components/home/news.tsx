"use client";
import { NewsItem } from '@/lib';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/bannerButton';
import { Card, CardContent } from '../ui/card';
import { useTranslations } from 'next-intl';
import { NewsSectionSkeleton } from '@/components/ui/skeleton-loaders';


function formatDateDMY(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function LatestNews() {
  const t = useTranslations('newsEvents');
  const router = useRouter();
  const { data: newsItems = [], isLoading: loading, error } = useQuery<NewsItem[]>({
    queryKey: ['news-home'],
    queryFn: async () => {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      return data.slice(0, 3);
    },
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('latestNews')}</h2>
        <Button variant="link" asChild>
          <Link href="/news-events/news" className="flex items-center gap-1">
            {t('viewAll')} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <NewsSectionSkeleton />
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500">Failed to load news</div>
        </div>
      ) : (
        <div className="space-y-6">
          {newsItems.map((news: NewsItem) => (
            <Card
              key={news.id}
              className="overflow-hidden group cursor-pointer"
              onClick={() => router.push(`/news-events/news/${news.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-48 sm:h-auto sm:w-1/3 overflow-hidden">
                    <Image
                      src={news.image_path || '/news/default-news.jpg'}
                      alt={news.title_th}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 sm:w-2/3">
                    <Badge variant="outline" className="mb-2">{news.category}</Badge>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-cyan-700 transition-colors">{news.title_th}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{formatDateDMY(news.publish_date)}</p>
                    <p className="text-sm line-clamp-2">{news.content_th.substring(0, 150)}...</p>
                    <span className="text-sm text-primary font-bold mt-3 inline-block hover:underline cursor-pointer">
                      {t('readMore')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
    </div>
  );
}