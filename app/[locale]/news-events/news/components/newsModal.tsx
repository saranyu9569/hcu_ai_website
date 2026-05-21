'use client';
import { NewsDisplayItem, NewsModalProps } from '@/lib';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';



// Extended news content for modal display
const extendedNewsContent: Record<number, string> = {

};

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, news }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !news) return null;

  const fullContent = news.fullContent || extendedNewsContent[news.id] || news.excerpt;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[95vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 font-medium">
              {news.category}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="font-medium">{news.date}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Close modal"
          >
            <X size={18} className="text-gray-500" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
          {/* Hero Image */}
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Article Content */}
          <div className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                {news.title}
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <div className="text-slate-700 leading-relaxed space-y-6">
                  {fullContent.split('\n\n').map((paragraph, index) => {
                    // Handle bold text (section headers)
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <div key={index} className="mt-10 mb-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                            <div className="w-1 h-6 bg-cyan-500 rounded-full mr-3"></div>
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        </div>
                      );
                    }
                    
                    // Handle bullet points
                    if (paragraph.includes('•') || paragraph.includes('-')) {
                      const items = paragraph.split('\n');
                      const title = items[0];
                      const bulletItems = items.slice(1).filter(item => 
                        item.trim().startsWith('•') || item.trim().startsWith('-')
                      );
                      
                      return (
                        <div key={index} className="space-y-4">
                          {title && !title.includes('•') && !title.includes('-') && (
                            <p className="text-slate-700 leading-relaxed font-medium">
                              {title}
                            </p>
                          )}
                          <ul className="space-y-3 pl-6">
                            {bulletItems.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-slate-700 leading-relaxed relative">
                                <div className="absolute left-[-1.5rem] top-3 w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <span className="pl-2">{item.replace(/^[•-]\s*/, '')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    
                    // Regular paragraphs
                    if (paragraph.trim()) {
                      return (
                        <p key={index} className="text-slate-700 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Published on {news.date}</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {news.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Latest News</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
export type { NewsDisplayItem, NewsModalProps }; 