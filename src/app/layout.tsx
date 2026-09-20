import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZVDBS - Zwemvereniging de Blauwe Schuur',
  description: 'Zwemvereniging de Blauwe Schuur in Rhenen. Trainingen, competities en lidmaatschap.',
  metadataBase: new URL('https://www.zvdbs.nl'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="bg-white text-ink font-sans">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
