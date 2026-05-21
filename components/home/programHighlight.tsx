'use client'

import { Topic, ProgramHighlight } from '@/lib';
import Image from 'next/image';
import { ArrowRight, ChevronDown, ChevronUp, X, Calendar, Users, QrCode, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ProgramHighlightSkeleton } from '@/components/ui/skeleton-loaders';


export default function ResearchHighlights() {
  const t = useTranslations('programHighlight');
  const locale = useLocale();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<ProgramHighlight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showModalContent, setShowModalContent] = useState<boolean>(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const { data: highlights = [], isLoading: loading, error } = useQuery<ProgramHighlight[]>({
    queryKey: ['program-highlight', locale],
    queryFn: async () => {
      const res = await fetch('/api/program-highlight');
      if (!res.ok) throw new Error('Failed to fetch program highlight');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Show only first 3 cards in main grid
  const mainHighlights = highlights.slice(0, 3);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const openModal = (event: ProgramHighlight) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setTimeout(() => setShowModalContent(true), 10); // allow mount before animating in
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setShowModalContent(false);
    closeTimeout.current = setTimeout(() => {
      setIsModalOpen(false);
      setSelectedEvent(null);
      document.body.style.overflow = 'unset'; // Restore background scrolling
    }, 250); // match transition duration
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  if (loading) {
    return <ProgramHighlightSkeleton />;
  }
  if (error || highlights.length === 0) {
    return <section className="py-16 bg-slate-900 text-center text-white text-lg">No program highlight</section>;
  }

  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {t('program')}<span className="text-cyan-400">{t('highlight')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainHighlights.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border-white border-2 cursor-pointer"
              onClick={() => openModal(item)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={locale === 'th' ? item.title_th : item.title_en}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ zIndex: 1 }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-transform duration-300 group-hover:scale-105"
                  style={{ zIndex: 2 }}
                />
                <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white z-10">
                  {locale === 'th' ? item.title_th : item.title_en}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{locale === 'th' ? item.description_th : item.description_en}</p>
                <div className="text-slate-900 font-medium flex items-center gap-1 hover:text-slate-700 transition-colors duration-200">
                  {t('view-button')} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable section with smooth height transition */}
        {highlights.length >= 4 && (
          <>
            <div
              className={`transition-all duration-1000 ease-in-out overflow-hidden ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {highlights.slice(3).map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border-white border-2 cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={locale === 'th' ? item.title_th : item.title_en}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ zIndex: 1 }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-transform duration-300 group-hover:scale-105"
                        style={{ zIndex: 2 }}
                      />
                      <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white z-10">
                        {locale === 'th' ? item.title_th : item.title_en}
                      </h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{locale === 'th' ? item.description_th : item.description_en}</p>
                      <div className="text-slate-900 font-medium flex items-center gap-1 hover:text-slate-700 transition-colors duration-200">
                        {t('view-button')} <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-12">
              <Button
                onClick={toggleExpansion}
                className="bg-transparent border-2 border-cyan-400 text-white hover:bg-cyan-400 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <div className='font-semibold text-md flex items-center gap-2'>
                  {isExpanded ? 'Show Less' : t('view-button')}
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="h-5 w-5 transition-transform duration-300" />
                  )}
                </div>
              </Button>
            </div>
          </>
        )}

        {/* Event Details Modal */}
        {isModalOpen && selectedEvent && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${showModalContent ? 'bg-black bg-opacity-50 opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div
              className={`bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transform transition-all duration-300 ${showModalContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
              style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-slate-900">Event Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Event Details Section */}
                <div className="p-6 bg-gradient-to-r from-cyan-50 to-indigo-50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Event Info */}
                    <div className="lg:col-span-2">
                      <h3 className="text-3xl font-bold text-slate-900 mb-4">
                        {locale === 'th' ? selectedEvent.event_name_th : selectedEvent.event_name_en}
                      </h3>

                      {/* Date and Time */}
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-5 w-5 text-cyan-600" />
                        <span className="text-slate-700">
                          {selectedEvent.event_date} • {selectedEvent.event_time}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-cyan-600" />
                        <span className="text-slate-700">{locale === 'th' ? selectedEvent.event_location_th : selectedEvent.event_location_en}</span>
                      </div>

                      {/* Topics */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3">This Year's Event Topics:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedEvent.topics.map((topic, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-500">
                              <span className="text-slate-700">{locale === 'th' ? topic.topic_th : topic.topic_en}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Registration Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h4 className="font-semibold text-slate-900 mb-4 text-center">Registration</h4>

                      {/* QR Code */}
                      <div className="text-center mb-4">
                        <div className="bg-gray-100 w-40 h-40 mx-auto rounded-lg flex items-center justify-center">
                          <QrCode className="h-20 w-20 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Scan QR Code to Register</p>
                      </div>

                      {/* Registration URL */}
                      <div className="text-center">
                        <a
                          href={selectedEvent.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                          Register Now <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}