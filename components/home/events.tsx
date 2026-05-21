"use client";
import { EventItem } from '@/lib';

import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "../ui/bannerButton";
import { Card, CardContent } from "../ui/card";
import { useTranslations } from "next-intl";
import { EventsSectionSkeleton } from '@/components/ui/skeleton-loaders';


export default function UpcomingEvents() {
  const t = useTranslations("newsEvents");
  const { data: eventItems = [], isLoading: loading, error } = useQuery<EventItem[]>({
    queryKey: ['events-home'],
    queryFn: async () => {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return data.slice(0, 3);
    },
  });

  if (loading) {
    return <EventsSectionSkeleton />;
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">Failed to load events</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("upcomingEvents")}</h2>
        <Button variant="link" asChild>
          <Link
            href="/news-events/events"
            className="flex items-center gap-1"
          >
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-6.5">
        {eventItems.map((event: EventItem) => {
          const eventDate = new Date(event.event_date);
          const day = eventDate.getDate();
          const month = eventDate.toLocaleDateString("en-US", {
            month: "short",
          });
          const year = eventDate.getFullYear();

          return (
            <Card key={event.id} className="transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex gap-4">
                  <div className="w-[30%] flex flex-col items-center justify-center rounded-tl-lg rounded-bl-lg bg-slate-800 text-white py-4 rounded-4">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                      {day} {month} {year}
                    </span>
                    <div className="mt-2 px-1 sm:px-4 text-sm text-center">
                      {event.category}
                    </div>
                  </div>
                  <div className="flex-1 p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      {event.title_th}
                    </h3>
                    <div className="space-y-1 text-sm text-slate-900 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{eventDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.event_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2">{event.content_th}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag)
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-cyan-100 text-slate-900 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
