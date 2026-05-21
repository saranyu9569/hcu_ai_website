"use client";
import { EventItem } from '@/lib';
import { PageSkeleton } from '@/components/ui/skeleton-loaders';

import { useState, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Search, MapPin, Tag, Clock } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';


// Categories for filtering
const categories = [
  "all",
  "Academic",
  "Training",
  "Competition",
  "Lecture",
  "Workshop",
  "Seminar",
  "Conference",
];

// Tags for filtering
const availableTags = [
  "all",
  "ปีที่ 1",
  "ปีที่ 2",
  "ปีที่ 3",
  "ปีที่ 4",
  "ทุกชั้นปี",
  "บุคลากร",
  "ภายนอก",
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const locale = useLocale();
  const { data: eventItems, isLoading: loading } = useQuery<EventItem[]>({
    queryKey: ['events', locale],
    queryFn: async () => {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
    initialData: [],
  });
  const tevents = useTranslations('event-page');

  const filteredEvents = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    return (eventItems || []).filter((event) => {
      const matchesSearch =
        !lowerSearch ||
        event.title_th.toLowerCase().includes(lowerSearch) ||
        event.title_en.toLowerCase().includes(lowerSearch) ||
        event.content_th.toLowerCase().includes(lowerSearch) ||
        event.content_en.toLowerCase().includes(lowerSearch);

      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      const eventTags = event.tags
        ? event.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => eventTags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [eventItems, searchQuery, selectedCategory, selectedTags]);

  const handleTagToggle = (tag: string) => {
    if (tag === "all") {
      setSelectedTags([]);
    } else {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{tevents('title')}</h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            {tevents('sub-title')}
          </p>
        </div>
      </div>

      {/* Events section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with search and filters */}
          <div className="lg:w-1/4">
            <div className="space-y-6 sticky top-24">
              <div>
                <h2 className="text-lg font-semibold mb-4">{tevents('search')}</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">{tevents('category')}</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                        selectedCategory === category
                          ? "bg-cyan-100 text-cyan-700 border border-cyan-200 shadow-sm"
                          : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-slate-700"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "all" ? "All" : category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 ${
                        tag === "all"
                          ? selectedTags.length === 0
                            ? "bg-green-100 text-green-700 border border-green-200 shadow-sm"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-slate-700"
                          : selectedTags.includes(tag)
                          ? "bg-green-100 text-green-700 border border-green-200 shadow-sm"
                          : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-slate-700"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag === "all" ? "All Tags" : tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {selectedTags.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main content with events listing */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{tevents('upcoming')}</h2>
              <p className="text-muted-foreground">
                {filteredEvents.length} events found
              </p>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="space-y-6">
                {filteredEvents.map((event) => {
                  const eventDate = new Date(event.event_date);
                  const day = eventDate.getDate();
                  const month = eventDate.toLocaleDateString("en-US", {
                    month: "short",
                  });
                  const year = eventDate.getFullYear();

                  return (
                    <Card
                      key={event.id}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-0">
                        <div className="flex gap-4">
                          <div className="w-[30%] flex flex-col items-center justify-center bg-cyan-950 text-white py-4">
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                              {day} {month} {year}
                            </span>
                            <div className="mt-2 px-2 sm:px-4 text-md text-center">
                              {event.category}
                            </div>
                          </div>
                          <div className="w-[70%] p-5">
                            <h3 className="text-lg font-semibold mb-2">
                              {event.title_th}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground mb-2">
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
                            <p className="text-sm line-clamp-2">
                              {event.content_th}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {event.tags
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter((tag) => tag)
                                .slice(0, 3)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded-full"
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
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No events found
                </h3>
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
