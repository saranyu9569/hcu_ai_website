"use client";
import { Slide, BannerSlide } from '@/lib';

import { useState, useEffect, useRef } from "react";
import { useQuery } from '@tanstack/react-query';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useLocale } from 'next-intl';
import { BannerSkeleton } from '@/components/ui/skeleton-loaders';



const HeroSlider = () => {
  const locale = useLocale();
  const { data: slides = [], isLoading, error } = useQuery<Slide[]>({
    queryKey: ['banner-slides', locale],
    queryFn: async () => {
      const response = await fetch('/api/banner');
      if (!response.ok) throw new Error('Failed to fetch banner slides');
        const data: BannerSlide[] = await response.json();
      return data.map(slide => ({
          id: slide.id,
          title: locale === 'th' ? slide.title_th : slide.title_en,
          description: locale === 'th' ? slide.description_th : slide.description_en,
          image: slide.image_path,
          cta: slide.cta_url ? {
            text: locale === 'th' ? slide.cta_text_th : slide.cta_text_en,
            url: slide.cta_url
          } : undefined
        }));
    },
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // เริ่ม interval เมื่อ component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // จัดการ auto-play
  useEffect(() => {
    // ล้าง interval เก่า
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // สร้าง interval ใหม่ถ้า isPlaying = true และมี slides มากกว่า 1 ตัว
    if (isPlaying && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const next = prev === slides.length - 1 ? 0 : prev + 1;
          console.log(`Auto-advancing from slide ${prev} to slide ${next}`); // Debug log
          return next;
        });
      }, 6000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, slides.length]); // Dependencies: isPlaying และ slides.length

  // Cleanup เมื่อ component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Debug: ดู state ปัจจุบัน
  useEffect(() => {
    console.log('Current slide:', currentSlide, 'Total slides:', slides.length, 'Is playing:', isPlaying);
  }, [currentSlide, slides.length, isPlaying]);

  if (isLoading) {
    return <BannerSkeleton />;
  }

  if (error || slides.length === 0) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-40">
          <div className="text-white text-xl">No banner slides available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-slate-900">
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          {/* Enhanced dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 z-10" />
          
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
            unoptimized={slide.image.startsWith('http')}
          />
          
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container px-4 md:px-6 text-center">
              <div className="max-w-screen-2xl mx-auto px-4 xl:px-12 2xl:px-24">
                <h1 className={`mb-6 text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight transition-all duration-1000 delay-300 drop-shadow-2xl ${
                  index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}>
                  {slide.title}
                </h1>
                <p className={`mb-8 max-w-2xl mx-auto text-lg md:text-xl text-white/95 leading-relaxed transition-all duration-1000 delay-500 drop-shadow-xl ${
                  index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}>
                  {slide.description}
                </p>
                {slide.cta && (
                  <div className={`transition-all duration-1000 delay-700 ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                    <Button 
                      asChild
                      size="lg"
                      className="bg-white text-[#14112f] hover:bg-white/90 text-lg px-8 py-3 rounded-full font-semibold shadow-2xl hover:shadow-xl transition-all duration-300"
                    >
                      <Link href={slide.cta.url}>
                        {slide.cta.text}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls - แสดงเฉพาะเมื่อมี slides มากกว่า 1 */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 md:left-8 top-1/2 z-25 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 border border-white/20"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 md:right-8 top-1/2 z-25 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 border border-white/20"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Play/Pause Control */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-20 right-4 md:right-8 z-25 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 border border-white/20"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 z-25 flex -translate-x-1/2 gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`relative h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/60 w-2 hover:bg-white/80"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-25">
            <div 
              className="h-full bg-white transition-all duration-300 ease-linear"
              style={{ 
                width: `${((currentSlide + 1) / slides.length) * 100}%` 
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;