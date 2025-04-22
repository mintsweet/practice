import type { Metadata } from 'next';
import React from 'react';

import '@mints/ui/style.css';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { getUser } from '@/lib/auth';

import './globals.css';

const title = process.env.PRACTICE_TITLE || 'Practice';

export const metadata: Metadata = {
  title: process.env.PRACTICE_TITLE || 'Practice',
  description: process.env.PRACTICE_DESCRIPTION || '',
  keywords: process.env.PRACTICE_KEYWORDS?.split(',') ?? [],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="zh">
      <body>
        <div className="flex flex-col min-h-screen">
          <Header title={title} user={user} />
          <main className="flex-1 w-full flex">
            <div className="max-w-5xl mx-auto flex-1">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
