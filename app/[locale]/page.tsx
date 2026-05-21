import BannerSlider from '@/components/home/bannerSlider';
import LatestNews from '@/components/home/news';
import UpcomingEvents from '@/components/home/events';
import Partnership from '@/components/home/partnership';
import Quote from '@/components/home/quote';
import About from '@/components/home/about';
import Course from '@/components/home/programHighlight';
import AdmissionInfo from '@/components/home/admission';

export default function HomePage() {
  return (
    <div>
      <BannerSlider />
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
          <LatestNews />
          <UpcomingEvents />
        </div> 
      </main>
      <Quote />
      <About />
      <Course />
      <Partnership />
    </div>
  );
}