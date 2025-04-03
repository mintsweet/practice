import type { Metadata } from 'next';

import Footer from '@/components/footer';
import Header from '@/components/header';

import './globals.css';

export const metadata: Metadata = {
  title: 'Practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <Header user={true} />
        <main className="min-h-[500px] py-8 px-4 w-[960px] mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
