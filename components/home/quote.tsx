"use client";
import { Quote } from '@/lib';

import React from "react";
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import Link from "next/link";
import Image from "next/image";
import { QuoteSkeleton } from '@/components/ui/skeleton-loaders';


const QuoteSection: React.FC = () => {
  const locale = useLocale();
  const { data: quote, isLoading: loading, error } = useQuery<Quote | null>({
    queryKey: ['quote', locale],
    queryFn: async () => {
      const res = await fetch('/api/quote');
      if (!res.ok) throw new Error('Failed to fetch quote');
      return res.json();
    },
  });

  if (loading) {
    return <QuoteSkeleton />;
  }
  if (error || !quote) {
    return (
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-slate-900 overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 flex items-center justify-center">
        <div className="text-white text-lg">No message</div>
      </section>
    );
  }

  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20">
      {/* Background Image */}
      <div className="bg-slate-900 absolute inset-0 z-0">
        <Image
          src="/quote/quote_background.png"
          alt="Quote Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay to ensure text remains readable */}
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            {locale === 'th' ? quote.title_th : quote.title_en}
          </h1>

          {/* Description Text */}
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-cyan-100 leading-relaxed mb-4 sm:mb-6 max-w-4xl mx-auto px-2 sm:px-4">
            <p>
              {locale === 'th' ? quote.description_th : quote.description_en}
            </p>
          </div>

          {/* CTA Button */}
          <Link href="/programs/undergraduate">
            <button className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 cursor-pointer bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-full text-white font-semibold hover:bg-opacity-30 transition-all duration-300 group text-sm sm:text-base">

              <span className="mr-2 text-slate-900">{locale === 'th' ? quote.button_th : quote.button_en}</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>

            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
