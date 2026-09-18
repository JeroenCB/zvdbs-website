'use client';

import { useState, useEffect, useMemo } from 'react';

interface Tijd {
  display: string;
  seconden: number | null;
}

export interface Swimmer {
  id: string;
  naam: string;
  lid: boolean | null;
  wedstrijdnummer: boolean | null;
  wedstrijden: number;
  ck1: number | null;
  ck2: number | null;
  ck3: number | null;
  adelskalender: number | null;
  gezwommen: number;
  totaalAfstanden: number;
  tijden: Record<string, Tijd>;
  rang: number | null;
}

export interface Afstand {
  key: string;
  label: string;
}

type SortKey = 'ck2' | 'ck1' | 'ck3' | 'adelskalender' | 'naam' | 'wedstrijden' | 'afstand';

const SORT_OPTIES: { value: SortKey; label: string }[] = [
  { value: 'ck2', label: 'C.K. 2 (klassement)' },
  { value: 'ck1', label: 'C.K. 1' },
  { value: 'ck3', label: 'C.K. 3' },
  { value: 'adelskalender', label: 'Adelskalender-score' },
  { value: 'naam', label: 'Naam (A-Z)' },
  { value: 'wedstrijden', label: 'Aantal wedstrijden' },
  { value: 'afstand', label: 'Tijd op afstand...' },
];

export default function StatistiekenTab() {
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [afstanden, setAfstanden] = useState<Afstand[]>([]);
  const [inKlassement, setInKlassement] = useState(0);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [zoek, setZoek] = useState('');
  const [alleenKlassement, setAlleenKlassement] = useState(true);
  const [alleenLeden, setAlleenLeden] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('ck2');
  const [afstandKey, setAfstandKey] = useState('');
  // Geslacht filtert server-side (de API leest kolom D, maar geeft die zelf
  // nooit door), dus deze filter triggert een nieuwe fetch i.p.v. lokaal filteren.
  const [geslacht, setGeslacht] = useState<'' | 'm' | 'v'>('');

  useEffect(() => {
    laadData(geslacht);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geslacht]);

  async function laadData(g: '' | 'm' | 'v') {
    try {
      setLoading(true);
      const qs = g ? `?geslacht=${g}` : '';
      const res = await fetch(`/api/swimmers${qs}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.hint || data.error || 'Kon gegevens niet laden');
        setSwimmers([]);
        return;
      }

      setSwimmers(data.swimmers || []);
      setAfstanden(data.afstanden || []);
      setInKlassement(data.inKlassement || 0);
      setLastFetched(data.lastFetched || null);
      setError(null);
    } catch {
      setError('Fout bij het laden van de gegevens');
      setSwimmers([]);
    } finally {
      setLoading(false);
    }
  }

  const zichtbaar = useMemo(() => {
    let lijst = swimmers;

    const q = zoek.trim().toLowerCase();
    if (q) lijst = lijst.filter((s) => s.naam.toLowerCase().includes(q));
    if (alleenKlassement) lijst = lijst.filter((s) => s.ck2 !== null);
    if (alleenLeden) lijst = lijst.filter((s) => s.lid === true);

    const gesorteerd = [...lijst];

    if (sortBy === 'naam') {
      gesorteerd.sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
    } else if (sortBy === 'wedstrijden') {
      gesorteerd.sort((a, b) => b.wedstrijden - a.wedstrijden);
    } else if (sortBy === 'afstand' && afstandKey) {
      // Snelste tijd eerst. Zwemmers zonder tijd op deze afstand onderaan.
      gesorteerd.sort((a, b) => {
        const av = a.tijden[afstandKey]?.seconden ?? null;
        const bv = b.tijden[afstandKey]?.seconden ?? null;
        if (av === null && bv === null) return a.naam.localeCompare(b.naam, 'nl');
        if (av === null) return 1;
        if (bv === null) return -1;
        return av - bv;
      });
    } else {
      // Alle scorekolommen: lager = beter.
      const key = sortBy as 'ck1' | 'ck2' | 'ck3' | 'adelskalender';
      gesorteerd.sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av === null && bv === null) return a.naam.localeCompare(b.naam, 'nl');
        if (av === null) return 1;
        if (bv === null) return -1;
        return av - bv;
      });
    }

    return gesorteerd;
  }, [swimmers, zoek, alleenKlassement, alleenLeden, sortBy, afstandKey]);

  const resetFilters = () => {
    setZoek('');
    setAlleenKlassement(true);
    setAlleenLeden(false);
    setSortBy('ck2');
    setAfstandKey('');
    setGeslacht('');
  };

  const filtersActief =
    zoek !== '' || !alleenKlassement || alleenLeden || sortBy !== 'ck2' || geslacht !== '';

  return (
    <>
      <section className="border-b border-line py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-ink mb-2">Statistieken</h1>
          <p className="text-sub">
            Klassement van alle zwemmers van ZVDBS.
          </p>
          {lastFetched && (
            <p className="text-xs text-sub mt-2">
              Bijgewerkt:{' '}
              {new Date(lastFetched).toLocaleString('nl-NL', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          )}
        </div>
      </section>

      {error && (
        <section className="py-4 px-6 bg-red-50 border-b border-red-200">
          <div className="max-w-6xl mx-auto">
            <p className="text-red-800 text-sm font-medium">
              Gegevens konden niet worden geladen
            </p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={() => laadData(geslacht)}
              className="mt-2 text-sm font-semibold text-red-900 underline"
            >
              Opnieuw proberen
            </button>
          </div>
        </section>
      )}

      {loading && (
        <section className="py-16 px-6 text-center">
          <p className="text-sub">Gegevens laden...</p>
        </section>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <section className="py-6 px-6 border-b border-line">
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="zoek"
                    className="block text-xs font-medium text-sub mb-1"
                  >
                    Zoek een zwemmer
                  </label>
                  <input
                    id="zoek"
                    type="search"
                    value={zoek}
                    onChange={(e) => setZoek(e.target.value)}
                    placeholder="Typ een naam..."
                    className="w-full px-3 py-2 border border-line rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua"
                  />
                </div>

                <div>
                  <label
                    htmlFor="geslacht"
                    className="block text-xs font-medium text-sub mb-1"
                  >
                    Geslacht
                  </label>
                  <select
                    id="geslacht"
                    value={geslacht}
                    onChange={(e) => setGeslacht(e.target.value as '' | 'm' | 'v')}
                    className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua"
                  >
                    <option value="">Iedereen</option>
                    <option value="v">Dames</option>
                    <option value="m">Heren</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sorteer"
                    className="block text-xs font-medium text-sub mb-1"
                  >
                    Sorteren op
                  </label>
                  <select
                    id="sorteer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua"
                  >
                    {SORT_OPTIES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {sortBy === 'afstand' && (
                <div>
                  <label
                    htmlFor="afstand"
                    className="block text-xs font-medium text-sub mb-1"
                  >
                    Welke afstand?
                  </label>
                  <select
                    id="afstand"
                    value={afstandKey}
                    onChange={(e) => setAfstandKey(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua"
                  >
                    <option value="">Kies een afstand...</option>
                    {afstanden.map((a) => (
                      <option key={a.key} value={a.key}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={alleenKlassement}
                    onChange={(e) => setAlleenKlassement(e.target.checked)}
                    className="rounded accent-aqua border-line"
                  />
                  Alleen zwemmers in het klassement ({inKlassement})
                </label>

                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={alleenLeden}
                    onChange={(e) => setAlleenLeden(e.target.checked)}
                    className="rounded accent-aqua border-line"
                  />
                  Alleen huidige leden
                </label>
              </div>

              <div className="flex items-center gap-4 text-xs text-sub">
                <span>
                  {zichtbaar.length} van {swimmers.length} zwemmers
                </span>
                {filtersActief && (
                  <button onClick={resetFilters} className="underline">
                    Filters wissen
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Tabel */}
          <section className="py-8 px-6">
            <div className="max-w-6xl mx-auto">
              {zichtbaar.length === 0 ? (
                <p className="text-sub text-sm py-8 text-center">
                  Geen zwemmers gevonden met deze filters.
                </p>
              ) : (
                <>
                  {/* Mobiel: kaarten */}
                  <ul className="sm:hidden space-y-2">
                    {zichtbaar.map((s) => (
                      <li
                        key={s.id}
                        className="border border-line rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-xs text-sub">
                              {s.rang ? `#${s.rang}` : 'buiten klassement'}
                            </span>
                            <div className="font-medium text-ink">{s.naam}</div>
                          </div>
                          <div className="text-right">
                            {sortBy === 'afstand' && afstandKey ? (
                              <div className="font-mono text-sm text-ink">
                                {s.tijden[afstandKey]?.display || '–'}
                              </div>
                            ) : (
                              <div className="font-mono text-sm text-ink">
                                {formatScore(s.ck2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Desktop: tabel */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-line text-left text-sub text-xs uppercase">
                          <th className="py-2 pr-3 w-16">#</th>
                          <th className="py-2 pr-3">Naam</th>
                          <th className="py-2 pr-3 text-right">C.K. 2</th>
                          {sortBy === 'afstand' && afstandKey && (
                            <th className="py-2 pr-3 text-right">
                              {afstanden.find((a) => a.key === afstandKey)?.label}
                            </th>
                          )}
                          <th className="py-2 text-right">Wedstrijden</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zichtbaar.map((s) => (
                          <tr
                            key={s.id}
                            className="border-b border-line hover:bg-aqua-light/40"
                          >
                            <td className="py-2 pr-3 text-sub">
                              {s.rang ?? '–'}
                            </td>
                            <td className="py-2 pr-3 font-medium text-ink">
                              {s.naam}
                            </td>
                            <td className="py-2 pr-3 text-right font-mono text-ink">
                              {formatScore(s.ck2)}
                            </td>
                            {sortBy === 'afstand' && afstandKey && (
                              <td className="py-2 pr-3 text-right font-mono text-ink">
                                {s.tijden[afstandKey]?.display || '–'}
                              </td>
                            )}
                            <td className="py-2 text-right text-sub">
                              {s.wedstrijden}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export function formatScore(n: number | null): string {
  if (n === null) return '–';
  return n.toFixed(2).replace('.', ',');
}
