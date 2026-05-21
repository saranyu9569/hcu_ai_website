"use client";
import { AdmissionList, AdmissionDate, AdmissionSection } from '@/lib';

import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AdmissionSkeleton } from '@/components/ui/skeleton-loaders';


export default function AdmissionFeesSection() {
  const locale = useLocale();
  const {
    data: admission,
    isLoading: loading,
    error,
  } = useQuery<AdmissionSection | null>({
    queryKey: ["admission", locale],
    queryFn: async () => {
      const res = await fetch("/api/admission");
      if (!res.ok) throw new Error("Failed to fetch admission");
      return res.json();
    },
  });

  if (loading) {
    return <AdmissionSkeleton />;
  }
  if (error || !admission) {
    return (
      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-20 text-center">
        <div className="text-lg">No message</div>
      </section>
    );
  }

  const academic = admission.lists.filter((l) => l.group_key === "academic");
  const materials = admission.lists.filter((l) => l.group_key === "materials");

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
          {locale === "th" ? admission.title_th : admission.title_en}
          {locale !== "th" && (
            <span className="text-cyan-400"> Requirements</span>
          )}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
                Academic Requirements
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {academic.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {locale === "th" ? item.label_th : item.label_en}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
                Application Materials
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {materials.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {locale === "th" ? item.label_th : item.label_en}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Card className="mt-0 sm:mt-4 lg:mt-0">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
                Important Dates
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {admission.dates.map((d, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-base sm:text-lg md:text-xl">
                      {locale === "th" ? d.semester_th : d.semester_en}
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground pt-1 sm:pt-2">
                      {locale === "th" ? d.deadline_th : d.deadline_en}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {locale === "th" ? d.notification_th : d.notification_en}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <h4 className="font-medium mb-2 text-base sm:text-lg md:text-xl">
                  Tuition & Fees
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {locale === "th"
                    ? admission.tuition_domestic
                    : admission.tuition_international}
                  <br />
                </p>
              </div>
              <Link
                href="https://admission.hcu.ac.th/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full mt-6 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-24 border-2 border-slate-900 cursor-pointer hover:bg-cyan-400 hover:text-white hover:border-cyan-400 text-sm sm:text-base py-2 sm:py-3">
                  <h1 className="font-bold">
                    {locale === "th"
                      ? admission.apply_button_th
                      : admission.apply_button_en}
                  </h1>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
