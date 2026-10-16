'use client';

import { useEffect, useState } from 'react';

interface Activiteit {
  id: string;
  titel: string;
  locatie: string;
  start: string;
  eind: string;
  heleDag: boolean;
}

const TZ = 'Europe/Amsterdam';
const AGENDA_URL =
  'https://calendar.google.com/calendar/embed?src=f6q3i2lvul3nt829kq52armngs%40group.calendar.google.com&ctz=Europe%2FAmsterdam';

/** "2026-11-01" als middag UTC lezen, zodat de dag in elke tijdzone gelijk blijft. */
function datum(s: string, heleDag: boolean): Date {
  return heleDag ? new Date(`${s}T12:00:00Z`) : new Date(s);
}

function fmt(d: Date, opties: Intl.DateTimeFormatOptions, heleDag: boolean): string {
  return d.toLocaleString('nl-NL', { ...opties, timeZone: heleDag ? 'UTC' : TZ });
}

/** Tekst onder de titel: tijd, "Hele dag" of een periode van meerdere dagen. */
function wanneer(a: Activiteit): string {
  const start = datum(a.start, a.heleDag);
  if (a.heleDag) {
    // Google geeft bij hele dagen de dag NA de laatste dag als eind.
    const laatste = new Date(datum(a.eind, true).getTime() - 24 * 60 * 60 * 1000);
    if (laatste.getTime() <= start.getTime()) return 'Hele dag';
    return `t/m ${fmt(laatste, { weekday: 'short', day: 'numeric', month: 'short' }, true)}`;
  }
  const eind = datum(a.eind, false);
  const tijd = { hour: '2-digit', minute: '2-digit' } as const;
  const zelfdeDag =
    fmt(start, { dateStyle: 'short' }, false) === fmt(eind, { dateStyle: 'short' }, false);
  return zelfdeDag
    ? `${fmt(start, tijd, false)} – ${fmt(eind, tijd, false)}`
    : `${fmt(start, tijd, false)} t/m ${fmt(eind, { weekday: 'short', day: 'numeric', month: 'short', ...tijd }, false)}`;
}

/**
 * Activiteiten uit de openbare Google-agenda "DBS activiteiten", 30 dagen vooruit.
 * Bij een fout of als er niets gepland staat verdwijnt het blok stilletjes,
 * net als de nieuwste clubrecords.
 */
export default function KomendeActiviteiten() {
  const [activiteiten, setActiviteiten] = useState<Activiteit[] | null>(null);
  const [fout, setFout] = useState(false);

  useEffect(() => {
    let actief = true;
    fetch('/api/activiteiten')
      .then((res) => res.json())
      .then((data) => {
        if (!actief) return;
        if (data.success) setActiviteiten(data.activiteiten || []);
        else setFout(true);
      })
      .catch(() => actief && setFout(true));
    return () => {
      actief = false;
    };
  }, []);

  if (fout) return null;
  if (activiteiten && activiteiten.length === 0) return null;

  // Tijdens het laden een lege kaart van vaste hoogte, zodat de pagina niet verspringt.
  if (!activiteiten) {
    return (
      <section className="max-w-5xl mx-auto px-6 pb-20" aria-hidden="true">
        <div className="h-56 rounded-2xl border border-line bg-white/60 animate-pulse dark:border-night-line dark:bg-white/[0.03]" />
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <div className="bg-white border border-line rounded-2xl p-5 sm:p-7 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.15)] dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-white/[0.02] dark:border-night-line dark:shadow-none dark:backdrop-blur-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-aqua-light flex items-center justify-center text-lg dark:bg-night-cyan/10 dark:border dark:border-night-cyan/25">
            📅
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-ink dark:text-night-ink">Komende activiteiten</h2>
            <p className="text-xs text-sub mt-0.5 dark:text-night-sub">De komende 30 dagen</p>
          </div>
        </div>

        <ul className="divide-y divide-line dark:divide-night-line">
          {activiteiten.map((a) => {
            const start = datum(a.start, a.heleDag);
            return (
              <li key={a.id} className="flex items-center gap-4 py-3">
                <div className="w-12 shrink-0 text-center">
                  <div className="text-[11px] uppercase tracking-wide text-sub dark:text-night-sub">
                    {fmt(start, { weekday: 'short' }, a.heleDag)}
                  </div>
                  <div className="text-xl font-extrabold leading-none text-ink dark:text-night-ink">
                    {fmt(start, { day: 'numeric' }, a.heleDag)}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-aqua-dark dark:text-night-cyan">
                    {fmt(start, { month: 'short' }, a.heleDag).replace('.', '')}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink dark:text-night-ink">{a.titel}</div>
                  <div className="text-xs text-sub truncate dark:text-night-sub">
                    {wanneer(a)}
                    {a.locatie && ` · ${a.locatie}`}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <a
          href={AGENDA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm font-semibold text-aqua-dark hover:underline dark:text-night-cyan"
        >
          Volledige agenda &rarr;
        </a>
      </div>
    </section>
  );
}
