import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="nl">
      <body className="bg-white text-gray-900">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
