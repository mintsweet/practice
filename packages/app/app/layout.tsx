import type { Metadata } from 'next';

import '@mints/ui/style.css';

import Footer from '@/components/footer';
import Header from '@/components/header';

import './globals.css';

const title = process.env.PRACTICE_TITLE || 'Practice';

export const metadata: Metadata = {
  title: process.env.PRACTICE_TITLE || 'Practice',
  description: process.env.PRACTICE_DESCRIPTION || '',
  keywords: process.env.PRACTICE_KEYWORDS?.split(',') ?? [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <Header title={title} user={null} />
        <main className="min-h-[1500px] py-8 px-4 w-[960px] mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
