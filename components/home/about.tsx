"use client";

import { AboutSection as AboutSectionData } from '@/lib';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { AboutSkeleton } from '@/components/ui/skeleton-loaders';
import Link from "next/link";


export default function AboutSection() {
  const locale = useLocale();
  const { data: about, isLoading: loading } =
    useQuery<AboutSectionData | null>({
      queryKey: ["about-section", locale],
      queryFn: async () => {
        const res = await fetch("/api/about-section");
        if (!res.ok) throw new Error("Failed to fetch about-section");
        return res.json();
      },
    });

  // Thai-specific text styling
  const thaiTextClass =
    locale === "th"
      ? "text-justify [text-justify:inter-character] [word-break:keep-all] [line-break:strict] [hyphens:none]"
      : "text-justify";

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutSkeleton />
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section className="py-16 bg-white text-center">
        <div className="text-lg">No message</div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-slate-900">
              {locale === "th" ? about.title_th : about.title_en}
            </h2>
            <div className={`prose prose-lg text-slate-900`}>
              <p>
                {locale === "th" ? about.description_th : about.description_en}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="rounded-md">
                <Link href="/about-department">
                  {locale === "th"
                    ? about.learn_more_button_th
                    : about.learn_more_button_en}
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="cursor-pointer hover:bg-slate-900 hover:text-white rounded-md"
              >
                <Link href="/programs/courses">
                  {locale === "th"
                    ? about.view_button_th
                    : about.view_button_en}
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <div className="relative group w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] cursor-pointer border border-transparent hover:border-cyan-300">
              <Image
                src="/department/department.jpg"
                alt="About Department"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 140vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-cyan-500/0 transition-colors duration-500 group-hover:bg-cyan-500/10 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
