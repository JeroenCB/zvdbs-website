'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tabs, { TabDef } from '@/components/Tabs';

export interface InformatieTabPage {
  slug: string;
  title: string;
  content: string | null;
}

const GELDIGE_TAB = (pages: InformatieTabPage[]) => pages.map((p) => p.slug);
const STANDAARD_TAB = 'informatie';

export default function InformatiePageClient({ pages }: { pages: InformatieTabPage[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const geldigeTabs = GELDIGE_TAB(pages);

  const uitParams = searchParams.get('tab');
  const initieel = geldigeTabs.includes(uitParams || '') ? uitParams! : STANDAARD_TAB;
  const [active, setActive] = useState(initieel);

  // Houdt de tab in sync met de URL, ook bij terug/vooruit-navigatie in de browser.
  useEffect(() => {
    const gewenst = geldigeTabs.includes(uitParams || '') ? uitParams! : STANDAARD_TAB;
    setActive((huidig) => (huidig === gewenst ? huidig : gewenst));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uitParams]);

  const wisselTab = useCallback(
    (key: string) => {
      setActive(key);
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', key);
      router.replace(`/informatie?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const tabs: TabDef[] = pages.map((p) => ({ key: p.slug, label: p.title }));
  const huidigePagina = pages.find((p) => p.slug === active) ?? pages[0];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{huidigePagina.title}</h1>
          </div>
        </section>

        <Tabs
          tabs={tabs}
          active={active}
          onChange={wisselTab}
          maxWidthClassName="max-w-4xl"
        />

        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {huidigePagina.content ? (
              <div
                className="text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: huidigePagina.content }}
              />
            ) : (
              <p className="text-gray-500 text-sm py-8 text-center">
                Deze pagina kon niet worden geladen.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
