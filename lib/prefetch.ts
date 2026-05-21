"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useLocale } from "next-intl";

/**
 * Map of page URL prefixes → queries to prefetch on hover.
 * queryKey is a function of locale so the key matches exactly what each page uses.
 */
const ROUTE_PREFETCH_MAP: Record<
  string,
  { queryKey: (locale: string) => unknown[]; url: string }[]
> = {
  "/about-department": [
    { queryKey: (l) => ["about-department", l], url: "/api/about-department" },
    // about-department page uses no-locale key for these two
    { queryKey: () => ["student-projects"],    url: "/api/student-projects" },
    { queryKey: () => ["publications"],        url: "/api/publications" },
  ],
  "/project-research": [
    // project-research page includes locale in these keys
    { queryKey: (l) => ["student-projects", l], url: "/api/student-projects" },
    { queryKey: (l) => ["publications", l],     url: "/api/publications" },
  ],
  "/news-events": [
    { queryKey: (l) => ["news", l],   url: "/api/news" },
    { queryKey: (l) => ["events", l], url: "/api/events" },
  ],
  "/admission": [
    { queryKey: (l) => ["admission-tracks", l],       url: "/api/admin/admission/tracks" },
    { queryKey: (l) => ["admission-tuition", l],      url: "/api/admin/admission/tuition" },
    { queryKey: (l) => ["admission-scholarships", l], url: "/api/admin/admission/scholarships" },
    { queryKey: (l) => ["admission-dates", l],        url: "/api/admin/admission/dates" },
  ],
  "/programs/undergraduate": [
    { queryKey: (l) => ["undergraduate-overview", l],   url: "/api/undergraduate/overview" },
    { queryKey: (l) => ["undergraduate-curriculum", l], url: "/api/undergraduate/curriculum" },
    { queryKey: (l) => ["undergraduate-careers", l],    url: "/api/undergraduate/careers" },
  ],
  "/programs/all-program": [
    { queryKey: () => ["programs"], url: "/api/programs" },
  ],
  "/programs/courses": [
    { queryKey: () => ["courses"], url: "/api/courses" },
  ],
  // parent /programs dropdown — prefetch the highlight that appears on the programs landing
  "/programs": [
    { queryKey: (l) => ["program-highlight", l], url: "/api/program-highlight" },
  ],
};

/**
 * Returns a function to call on mouseEnter of a nav link.
 * It prefetches the API data for that route so the page loads instantly on click.
 */
export function usePrefetchRoute() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useCallback(
    (routeUrl: string) => {
      // Use longest matching prefix first so /programs/undergraduate wins over /programs
      const sortedEntries = Object.entries(ROUTE_PREFETCH_MAP).sort(
        ([a], [b]) => b.length - a.length
      );

      for (const [prefix, queries] of sortedEntries) {
        if (routeUrl.includes(prefix)) {
          for (const q of queries) {
            const key = q.queryKey(locale);
            if (!queryClient.getQueryData(key)) {
              queryClient.prefetchQuery({
                queryKey: key,
                queryFn: async () => {
                  const res = await fetch(q.url);
                  if (!res.ok) throw new Error(`Failed to fetch ${q.url}`);
                  return res.json();
                },
                staleTime: 5 * 60 * 1000,
              });
            }
          }
          break;
        }
      }
    },
    [queryClient, locale]
  );
}
