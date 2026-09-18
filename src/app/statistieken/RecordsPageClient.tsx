'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tabs, { TabDef } from '@/components/Tabs';
import ClubrecordsTab from '@/components/records/ClubrecordsTab';
import StatistiekenTab from '@/components/records/StatistiekenTab';
import PersoonlijkeRecordsTab from '@/components/records/PersoonlijkeRecordsTab';

const TABS: TabDef[] = [
  { key: 'clubrecords', label: 'Clubrecords' },
  { key: 'statistieken', label: 'Statistieken' },
  { key: 'persoonlijk', label: 'Persoonlijke records' },
];

const GELDIGE_TABS = TABS.map((t) => t.key);

export default function RecordsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const uitParams = searchParams.get('tab');
  const initieel = GELDIGE_TABS.includes(uitParams || '') ? uitParams! : 'clubrecords';
  const [active, setActive] = useState(initieel);

  // Houdt de tab in sync met de URL, ook bij terug/vooruit-navigatie in de browser.
  useEffect(() => {
    const gewenst = GELDIGE_TABS.includes(uitParams || '') ? uitParams! : 'clubrecords';
    setActive((huidig) => (huidig === gewenst ? huidig : gewenst));
  }, [uitParams]);

  const wisselTab = useCallback(
    (key: string) => {
      setActive(key);
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', key);
      router.replace(`/statistieken?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <>
      <Header />
      <main className="flex-1">
        <Tabs tabs={TABS} active={active} onChange={wisselTab} />

        {active === 'clubrecords' && <ClubrecordsTab />}
        {active === 'statistieken' && <StatistiekenTab />}
        {active === 'persoonlijk' && <PersoonlijkeRecordsTab />}
      </main>
      <Footer />
    </>
  );
}
