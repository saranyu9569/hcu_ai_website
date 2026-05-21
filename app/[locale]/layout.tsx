import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Preloader from "@/components/layout/preloader";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import './globals.css';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Get messages for the current locale
  const messages = await getMessages();

  return {
    title: messages.metadata?.title || 'HCU AI',
    description: messages.metadata?.description || 'Department of Artificial Intelligence',
    // You can add more metadata here
    openGraph: {
      title: messages.metadata?.title || 'Department of Artificial Intelligence',
      description: messages.metadata?.description || 'Department of Artificial Intelligence',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Preloader />
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <Navbar />
            {children}
            <Footer />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}