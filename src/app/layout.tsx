import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZVDBS - Zwemvereniging de Blauwe Schuur',
  description: 'Zwemvereniging de Blauwe Schuur in Rhenen. Trainingen, competities en lidmaatschap.',
  metadataBase: new URL('https://www.zvdbs.nl'),
};

// Zet de dark class op <html> vóórdat React hydrateert, zodat de pagina
// nooit kort in de verkeerde modus opflitst (anti-FOUC). Licht is de
// standaard voor iedereen die nog geen keuze heeft gemaakt; het
// systeemthema van het apparaat wordt hiervoor bewust genegeerd. Alleen
// wie zelf via de knop naar donker schakelt, krijgt dat via localStorage
// bij een volgend bezoek terug.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-white text-ink font-sans dark:bg-night-bg dark:text-night-ink dark:font-sora">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
