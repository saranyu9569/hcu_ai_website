"use client";

/**
 * YouTube-style skeleton shimmer components for loading states.
 * Each skeleton matches the shape of the actual content it replaces.
 */

/* ─── Shimmer base ─── */
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

/* ─── News card skeleton (horizontal card with image + text) ─── */
export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Shimmer className="h-48 sm:h-auto sm:w-1/3 rounded-none" />
        <div className="p-5 sm:w-2/3 space-y-3">
          <Shimmer className="h-5 w-20 rounded-full" />
          <Shimmer className="h-6 w-full" />
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function NewsSectionSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Shimmer className="h-7 w-32" />
        <Shimmer className="h-5 w-16" />
      </div>
      <div className="space-y-6">
        <NewsCardSkeleton />
        <NewsCardSkeleton />
        <NewsCardSkeleton />
      </div>
    </div>
  );
}

/* ─── Event card skeleton (date badge + content) ─── */
export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex gap-4">
        <div className="w-[30%] bg-slate-100 py-4 flex flex-col items-center justify-center rounded-l-lg">
          <Shimmer className="h-8 w-20" />
          <Shimmer className="h-4 w-16 mt-2" />
        </div>
        <div className="flex-1 p-5 space-y-3">
          <Shimmer className="h-6 w-3/4" />
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-4 w-28" />
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-4 w-full" />
          <div className="flex gap-2 mt-2">
            <Shimmer className="h-5 w-14 rounded-full" />
            <Shimmer className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventsSectionSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Shimmer className="h-7 w-40" />
        <Shimmer className="h-5 w-16" />
      </div>
      <div className="space-y-6">
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    </div>
  );
}

/* ─── Banner / Hero slider skeleton ─── */
export function BannerSkeleton() {
  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-slate-900">
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <Shimmer className="h-14 w-[60%] mx-auto bg-white/10" />
          <Shimmer className="h-6 w-[40%] mx-auto bg-white/10" />
          <Shimmer className="h-12 w-40 mx-auto rounded-full bg-white/10" />
        </div>
      </div>
      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 z-25 flex -translate-x-1/2 gap-3">
        <Shimmer className="h-2 w-8 rounded-full bg-white/30" />
        <Shimmer className="h-2 w-2 rounded-full bg-white/20" />
        <Shimmer className="h-2 w-2 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

/* ─── Quote section skeleton ─── */
export function QuoteSkeleton() {
  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-slate-900 overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
        <Shimmer className="h-10 w-[70%] mx-auto bg-white/10" />
        <Shimmer className="h-5 w-[50%] mx-auto bg-white/10" />
        <Shimmer className="h-5 w-[60%] mx-auto bg-white/10" />
        <Shimmer className="h-12 w-44 mx-auto rounded-full bg-white/10" />
      </div>
    </section>
  );
}

/* ─── About section skeleton ─── */
export function AboutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
      <div className="space-y-6">
        <Shimmer className="h-10 w-64" />
        <div className="space-y-3">
          <Shimmer className="h-5 w-full" />
          <Shimmer className="h-5 w-full" />
          <Shimmer className="h-5 w-5/6" />
          <Shimmer className="h-5 w-4/5" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Shimmer className="h-10 w-32 rounded-md" />
          <Shimmer className="h-10 w-32 rounded-md" />
        </div>
      </div>
      <div className="flex justify-center w-full">
        <Shimmer className="w-full max-w-lg aspect-[4/3] rounded-2xl" />
      </div>
    </div>
  );
}

/* ─── Program highlight skeleton (dark bg, image cards) ─── */
export function ProgramHighlightSkeleton() {
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shimmer className="h-10 w-64 mx-auto bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Shimmer className="h-48 w-full rounded-none" />
              <div className="p-6 space-y-3">
                <Shimmer className="h-5 w-full" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-3/4" />
                <Shimmer className="h-5 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Admission section skeleton ─── */
export function AdmissionSkeleton() {
  return (
    <section className="bg-slate-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <Shimmer className="h-10 w-72 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Shimmer className="h-6 w-48" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Shimmer className="h-5 w-5 rounded-full flex-shrink-0" />
                <Shimmer className="h-4 w-full" />
              </div>
            ))}
            <Shimmer className="h-6 w-48 mt-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Shimmer className="h-5 w-5 rounded-full flex-shrink-0" />
                <Shimmer className="h-4 w-full" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <Shimmer className="h-6 w-36" />
            <Shimmer className="h-5 w-full" />
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-4 w-1/2" />
            <Shimmer className="h-12 w-full rounded-lg mt-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Partnership skeleton (dark bg, logos) ─── */
export function PartnershipSkeleton() {
  return (
    <section className="py-12 bg-slate-900 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shimmer className="h-10 w-64 mx-auto bg-white/10" />
          <Shimmer className="h-5 w-80 mx-auto mt-4 bg-white/10" />
        </div>
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-[0_0_25%]">
              <Shimmer className="h-32 w-full rounded-xl bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Full page skeleton (subpages like About, Admission, etc.) ─── */
export function PageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Top loading bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-gray-200">
        <div className="h-full bg-slate-800 animate-loading-bar rounded-r-full" />
      </div>

      {/* Hero skeleton */}
      <div className="bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="relative text-center space-y-4">
            <Shimmer className="h-12 w-96 max-w-full mx-auto bg-white/10" />
            <Shimmer className="h-6 w-64 max-w-full mx-auto bg-white/10" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Tab bar skeleton */}
          <div className="flex justify-center gap-2">
            <Shimmer className="h-10 w-28 rounded-lg" />
            <Shimmer className="h-10 w-28 rounded-lg" />
            <Shimmer className="h-10 w-28 rounded-lg" />
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <Shimmer className="h-40 w-full rounded-lg" />
                <Shimmer className="h-5 w-3/4" />
                <Shimmer className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Navbar skeleton ─── */
export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-80 w-full p-2 bg-slate-900 shadow-lg">
      <nav className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center flex-shrink-0 gap-3">
            <Shimmer className="h-12 w-12 rounded-md bg-white/10" />
            <div className="space-y-1.5">
              <Shimmer className="h-3 w-40 bg-white/10" />
              <Shimmer className="h-3 w-32 bg-white/10" />
            </div>
          </div>
          <div className="hidden xl:flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Shimmer key={i} className="h-8 w-24 rounded-md bg-white/10" />
            ))}
          </div>
          <div className="hidden xl:flex gap-2">
            <Shimmer className="h-8 w-8 rounded-md bg-white/10" />
            <Shimmer className="h-8 w-16 rounded-md bg-white/10" />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Shimmer;
