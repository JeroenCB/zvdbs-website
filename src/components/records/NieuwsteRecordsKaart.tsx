'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { bepaalLaatsteWedstrijd } from '@/lib/laatsteWedstrijd';

interface ClubRecord {
  id: string;
  categorie: string;
  afstand: string;
  naam: string;
  tijd: string;
  datum: string;
  plaats: string;
}

/** Op de homepage tonen we een handvol; de rest staat achter de link. */
const MAX_ZICHTBAAR = 5;

/**
 * Compacte variant van "Nieuwste clubrecords" voor de homepage. Haalt dezelfde
 * data op als het Clubrecords-tabblad en gebruikt dezelfde regel om de laatste
 * wedstrijd te bepalen. Bij een fout verdwijnt het blok stilletjes: een kapotte
 * sheet mag de homepage niet verpesten.
 */
export default function NieuwsteRecordsKaart() {
  const [records, setRecords] = useState<ClubRecord[] | null>(null);
  const [fout, setFout] = useState(false);

  useEffect(() => {
    let actief = true;
    fetch('/api/records')
      .then((res) => res.json())
      .then((data) => {
        if (!actief) return;
        if (data.success) setRecords(data.records || []);
        else setFout(true);
      })
      .catch(() => actief && setFout(true));
    return () => {
      actief = false;
    };
  }, []);

  const laatste = useMemo(() => (records ? bepaalLaatsteWedstrijd(records) : null), [records]);

  if (fout) return null;
  if (records && !laatste) return null;

  // Tijdens het laden een lege kaart van vaste hoogte, zodat de pagina niet verspringt.
  if (!laatste) {
    return (
      <section className="max-w-6xl mx-auto px-6 pb-20" aria-hidden="true">
        <div className="h-56 rounded-2xl border border-line bg-white/60 animate-pulse dark:border-night-line dark:bg-white/[0.03]" />
      </section>
    );
  }

  const zichtbaar = laatste.records.slice(0, MAX_ZICHTBAAR);
  const rest = laatste.records.length - zichtbaar.length;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="bg-white border border-line rounded-2xl p-5 sm:p-7 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.15)] dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-white/[0.02] dark:border-night-line dark:shadow-none dark:backdrop-blur-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-aqua-light flex items-center justify-center text-lg dark:bg-night-cyan/10 dark:border dark:border-night-cyan/25">
            🏅
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-ink dark:text-night-ink">Nieuwste clubrecords</h2>
            <p className="text-xs text-sub mt-0.5 dark:text-night-sub">
              {laatste.titel}
              {laatste.plaatsen.length > 0 && ` · ${laatste.plaatsen.join(', ')}`}
            </p>
          </div>
        </div>

        <ul className="divide-y divide-line dark:divide-night-line">
          {zichtbaar.map((r) => (
            <li key={r.id} className="flex items-baseline justify-between gap-3 py-2">
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink truncate dark:text-night-ink">{r.naam}</div>
                <div className="text-xs text-sub truncate dark:text-night-sub">
                  {r.categorie} &middot; {r.afstand}
                </div>
              </div>
              <div className="font-mono text-sm text-ink whitespace-nowrap dark:text-night-ink">
                {r.tijd}
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/statistieken?tab=clubrecords"
          className="inline-block mt-4 text-sm font-semibold text-aqua-dark hover:underline dark:text-night-cyan"
        >
          {rest > 0 ? `+ ${rest} meer · alle clubrecords` : 'Alle clubrecords'} &rarr;
        </Link>
      </div>
    </section>
  );
}
