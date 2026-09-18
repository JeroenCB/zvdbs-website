import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZVDBS - Zwemvereniging de Blauwe Schuur',
  description: 'Zwemvereniging de Blauwe Schuur in Rhenen. Trainingen, competities en lidmaatschap.',
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={poppins.variable}>
      <body className="bg-cream text-ink font-sans">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
