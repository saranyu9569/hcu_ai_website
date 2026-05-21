'use client';
import { Partner, ContactModalProps } from '@/lib';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import ContactModal from "@/components/about/ContactModal";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { PartnershipSkeleton } from '@/components/ui/skeleton-loaders';



const Partnership = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      dragFree: true,
      containScroll: false,
      skipSnaps: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const t = useTranslations('partnership');
  const locale = useLocale();
  const { data: partners = [], isLoading: loading, error } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => {
      const res = await fetch('/api/partners');
      if (!res.ok) throw new Error('Failed to fetch partners');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  if (loading) {
    return <PartnershipSkeleton />;
  }
  if (error || partners.length === 0) {
    return <section className="py-12 bg-slate-900 sm:py-16 lg:py-20 text-center text-white text-lg">No partners</section>;
  }

  return (
    <section className="py-12 bg-slate-900 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {locale === 'en' ? (
              <>
                {t('title')} <span className="text-cyan-400">{t('partners')}</span>
              </>
            ) : (
              <>
                <span className="text-cyan-400">{t('title')}</span>{t('partners')}
              </>
            )}
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="overflow-hidden mt-12" ref={emblaRef}>
          <div className="flex -ml-4">
            {partners.map((partner, index) => (
              <div
                className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-4"
                key={partner.id}
              >
                <Link
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative group h-32 bg-white rounded-xl shadow-lg hover:shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain filter transition-all duration-300"
                      style={{
                        maxWidth: `${partner.width}px`,
                        maxHeight: `${partner.height}px`
                      }}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-white font-semibold text-sm p-3 text-center leading-tight">
                        {partner.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <ContactModal
            name="Department of Computational Science and Digital Technology"
            address={`18, 18 Debaratna Rd,\nBang Chalong, Bang Phli District,\nSamut Prakan 10540`}
            phone="+66 2 123 4567"
            email="cs@hcu.ac.th"
            facebook="https://facebook.com/yourpage"
            instagram="https://instagram.com/yourprofile"
            mapQuery="Huachiew Chalermprakiat University 18, 18 Debaratna Rd, Bang Chalong, Bang Phli District, Samut Prakan 10540"
          />
        </div>
      </div>
    </section>
  );
};

export default Partnership;