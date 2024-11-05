import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fast Youtube Summary',
  description: 'Summarize YouTube videos for free',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Nav />
        <main className="min-h-[80vh]">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
