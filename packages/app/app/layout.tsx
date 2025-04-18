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
        <div className="flex flex-col min-h-screen">
          <Header title={title} user={null} />
          <main className="flex-1 w-full">
            <div className="max-w-5xl mx-auto">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
