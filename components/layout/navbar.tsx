"use client";
import { NavbarItem, Language } from '@/lib';

import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Globe, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { usePrefetchRoute } from '@/lib/prefetch';
import { NavbarSkeleton } from '@/components/ui/skeleton-loaders';

// Define types for navigation structure


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSubMenuItem, setHoveredSubMenuItem] = useState<string | null>(null);
  const [hoveredLanguage, setHoveredLanguage] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [languageHoverTimeout, setLanguageHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const prefetchRoute = usePrefetchRoute();

  // Translation hooks
  const t = useTranslations('Navigation');
  const tUniversity = useTranslations('UniversityName');

  // Language options
  const languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'th', name: 'ไทย' },
    // { code: 'ja', name: '日本語'},
    // { code: 'cn', name: '中文'},
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  // React Query for navigation
  const { data: navigation = [], isLoading: loading } = useQuery({
    queryKey: ['navbar-navigation'],
    queryFn: async () => {
      const res = await fetch('/api/navbar');
      if (!res.ok) throw new Error('Failed to fetch navigation');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleLanguageChange = (langCode: string) => {
    // Remove the current locale from the pathname
    const segments = pathname.split('/');
    const currentLocale = segments[1];

    // Check if the first segment is a locale
    const isLocaleInPath = languages.some(lang => lang.code === currentLocale);

    let newPath;
    if (isLocaleInPath) {
      // Replace the locale in the path
      segments[1] = langCode;
      newPath = segments.join('/');
    } else {
      // Add the locale to the path
      newPath = `/${langCode}${pathname}`;
    }

    router.push(newPath);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleMouseEnter = (itemName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleLanguageMouseEnter = () => {
    if (languageHoverTimeout) {
      clearTimeout(languageHoverTimeout);
      setLanguageHoverTimeout(null);
    }
    setHoveredLanguage(true);
  };

  const handleLanguageMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredLanguage(false);
    }, 150);
    setLanguageHoverTimeout(timeout);
  };

  const handleLanguageDropdownMouseEnter = () => {
    if (languageHoverTimeout) {
      clearTimeout(languageHoverTimeout);
      setLanguageHoverTimeout(null);
    }
  };

  const handleLanguageDropdownMouseLeave = () => {
    setHoveredLanguage(false);
  };

  const getTitle = (item: NavbarItem) => locale === 'th' ? item.title_th : item.title_en;
  const isExternal = (url: string) => url.startsWith('http');

  if (loading) {
    return <NavbarSkeleton />;
  }

  return (
    <header className="sticky top-0 z-50 w-full p-2 bg-slate-900 shadow-lg">
      <nav className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Section - Left */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                <Image
                  src="/logo/hcu-logo.svg"
                  alt="HCU Logo"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <div className="text-white min-w-0 flex-1">
                <div className="text-xs sm:text-xs md:text-xs lg:text-xs font-semibold leading-tight truncate">
                  {tUniversity('fullName')}
                </div>
                <div className="text-xs sm:text-xs md:text-xs lg:text-xs text-white leading-tight truncate">
                  {tUniversity('aiProgram')}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden xl:flex xl:items-center xl:space-x-2 flex-1 justify-center">
            {navigation.map((item: NavbarItem) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.is_dropdown && handleMouseEnter(item.id.toString())}
                onMouseLeave={handleMouseLeave}
              >
                {item.is_dropdown ? (
                  <>
                    {isExternal(item.url) ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors text-white hover:bg-slate-800 hover:text-white"
                      >
                        <span>{getTitle(item)}</span>
                        <ChevronDown className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive(item.url)
                            ? "bg-slate-800 text-white"
                            : "text-white hover:bg-slate-800 hover:text-white"
                        )}
                        onMouseEnter={() => prefetchRoute(item.url)}
                      >
                        <span>{getTitle(item)}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Link>
                    )}

                    {/* Custom Dropdown Menu */}
                    {hoveredItem === item.id.toString() && item.children && item.children.length > 0 && (
                      <div
                        className="absolute top-full left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        {item.children.map((subitem: NavbarItem) => (
                          isExternal(subitem.url) ? (
                            <a
                              key={subitem.id}
                              href={subitem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex w-full items-center justify-between px-4 py-2 text-sm transition-colors first:rounded-t-md last:rounded-b-md text-white hover:bg-slate-700 hover:text-white"
                            >
                              <span>{getTitle(subitem)}</span>
                            </a>
                          ) : (
                            <Link
                              key={subitem.id}
                              href={subitem.url}
                              className={cn(
                                "flex w-full items-center justify-between px-4 py-2 text-sm transition-colors first:rounded-t-md last:rounded-b-md",
                                isActive(subitem.url)
                                  ? "bg-slate-700 text-white"
                                  : "text-white hover:bg-slate-700 hover:text-white"
                              )}
                              onMouseEnter={() => prefetchRoute(subitem.url)}
                            >
                              <span>{getTitle(subitem)}</span>
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  isExternal(item.url) ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors text-white hover:bg-slate-800 hover:text-white"
                    >
                      <span>{getTitle(item)}</span>
                    </a>
                  ) : (
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive(item.url)
                          ? "bg-slate-800 text-white"
                          : "text-white hover:bg-slate-800 hover:text-white"
                      )}
                      onMouseEnter={() => prefetchRoute(item.url)}
                    >
                      <span>{getTitle(item)}</span>
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Section - Student Resources Icon & Language Switcher */}
          <div className="hidden xl:flex items-center space-x-3 flex-shrink-0">
            {/* Login Icon */}
            <Link
              href="/admin/login"
              className="flex items-center justify-center p-2.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Login"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Language Switcher */}
            <div
              className="relative"
              onMouseEnter={handleLanguageMouseEnter}
              onMouseLeave={handleLanguageMouseLeave}
            >
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Globe className="h-4 w-4" />
                <span>{currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* Custom Language Dropdown */}
              {hoveredLanguage && (
                <div
                  className="absolute top-full right-0 mt-1 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50"
                  onMouseEnter={handleLanguageDropdownMouseEnter}
                  onMouseLeave={handleLanguageDropdownMouseLeave}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={cn(
                        "w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors first:rounded-t-md last:rounded-b-md text-left",
                        locale === language.code
                          ? "bg-slate-700 text-white"
                          : "text-white hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="xl:hidden text-white hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item: NavbarItem) => (
                <div key={item.id}>
                  {item.is_dropdown ? (
                    <div className="space-y-1">
                      {isExternal(item.url) ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-white px-3 py-2 text-sm font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {getTitle(item)}
                        </a>
                      ) : (
                        <div className="text-white px-3 py-2 text-sm font-medium">
                          {getTitle(item)}
                        </div>
                      )}
                      {item.children && item.children.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {item.children.map((subitem: NavbarItem) => (
                            isExternal(subitem.url) ? (
                              <a
                                key={subitem.id}
                                href={subitem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-3 py-2 text-sm transition-colors rounded-md text-gray-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {getTitle(subitem)}
                              </a>
                            ) : (
                              <Link
                                key={subitem.id}
                                href={subitem.url}
                                className={cn(
                                  "block px-3 py-2 text-sm transition-colors rounded-md",
                                  isActive(subitem.url)
                                    ? "bg-slate-700 text-white"
                                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {getTitle(subitem)}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    isExternal(item.url) ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-sm font-medium transition-colors rounded-md text-white hover:bg-slate-800 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getTitle(item)}
                      </a>
                    ) : (
                      <Link
                        href={item.url}
                        className={cn(
                          "block px-3 py-2 text-sm font-medium transition-colors rounded-md",
                          isActive(item.url)
                            ? "bg-slate-800 text-white"
                            : "text-white hover:bg-slate-800 hover:text-white"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getTitle(item)}
                      </Link>
                    )
                  )}
                </div>
              ))}

              {/* Login in Mobile Menu */}
              <Link
                href="/admin/login"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors",
                  isActive('/admin/login')
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm font-semibold text-white">
                    {t('language')}
                  </div>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center space-x-2 px-6 py-2 text-sm rounded-md transition-colors",
                        locale === language.code
                          ? "bg-slate-700 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}