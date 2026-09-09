'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect, useMemo } from 'react';

interface Tijd {
  display: string;
  seconden: number | null;
}

interface Swimmer {
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

interface Afstand {
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

export default function StatistiekenPage() {
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

  useEffect(() => {
    laadData();
  }, []);

  async function laadData() {
    try {
      setLoading(true);
      const res = await fetch('/api/swimmers');
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

  const podium = useMemo(
    () => swimmers.filter((s) => s.rang !== null).slice(0, 3),
    [swimmers]
  );

  const resetFilters = () => {
    setZoek('');
    setAlleenKlassement(true);
    setAlleenLeden(false);
    setSortBy('ck2');
    setAfstandKey('');
  };

  const filtersActief =
    zoek !== '' || !alleenKlassement || alleenLeden || sortBy !== 'ck2';

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-gray-200 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistieken</h1>
            <p className="text-gray-600">
              Klassement en persoonlijke records van alle zwemmers van ZVDBS.
            </p>
            {lastFetched && (
              <p className="text-xs text-gray-400 mt-2">
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
                onClick={laadData}
                className="mt-2 text-sm font-semibold text-red-900 underline"
              >
                Opnieuw proberen
              </button>
            </div>
          </section>
        )}

        {loading && (
          <section className="py-16 px-6 text-center">
            <p className="text-gray-500">Gegevens laden...</p>
          </section>
        )}

        {!loading && !error && (
          <>
            {/* Podium */}
            {podium.length > 0 && (
              <section className="py-8 px-6 bg-gray-50 border-b border-gray-200">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Top 3 klassement
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {podium.map((s, i) => (
                      <div
                        key={s.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="text-2xl mb-1">
                          {['\u{1F947}', '\u{1F948}', '\u{1F949}'][i]}
                        </div>
                        <div className="font-semibold text-gray-900">{s.naam}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          C.K. 2: {formatScore(s.ck2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Filters */}
            <section className="py-6 px-6 border-b border-gray-200">
              <div className="max-w-6xl mx-auto space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="zoek"
                      className="block text-xs font-medium text-gray-500 mb-1"
                    >
                      Zoek een zwemmer
                    </label>
                    <input
                      id="zoek"
                      type="search"
                      value={zoek}
                      onChange={(e) => setZoek(e.target.value)}
                      placeholder="Typ een naam..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sorteer"
                      className="block text-xs font-medium text-gray-500 mb-1"
                    >
                      Sorteren op
                    </label>
                    <select
                      id="sorteer"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortKey)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900"
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
                      className="block text-xs font-medium text-gray-500 mb-1"
                    >
                      Welke afstand?
                    </label>
                    <select
                      id="afstand"
                      value={afstandKey}
                      onChange={(e) => setAfstandKey(e.target.value)}
                      className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900"
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
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={alleenKlassement}
                      onChange={(e) => setAlleenKlassement(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Alleen zwemmers in het klassement ({inKlassement})
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={alleenLeden}
                      onChange={(e) => setAlleenLeden(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Alleen huidige leden
                  </label>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
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
                  <p className="text-gray-500 text-sm py-8 text-center">
                    Geen zwemmers gevonden met deze filters.
                  </p>
                ) : (
                  <>
                    {/* Mobiel: kaarten */}
                    <ul className="sm:hidden space-y-2">
                      {zichtbaar.map((s) => (
                        <li
                          key={s.naam}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <span className="text-xs text-gray-400">
                                {s.rang ? `#${s.rang}` : 'buiten klassement'}
                              </span>
                              <div className="font-medium text-gray-900">{s.naam}</div>
                            </div>
                            <div className="text-right">
                              {sortBy === 'afstand' && afstandKey ? (
                                <div className="font-mono text-sm text-gray-900">
                                  {s.tijden[afstandKey]?.display || '\u2013'}
                                </div>
                              ) : (
                                <div className="font-mono text-sm text-gray-900">
                                  {formatScore(s.ck2)}
                                </div>
                              )}
                              <Voortgang s={s} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Desktop: tabel */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300 text-left text-gray-500 text-xs uppercase">
                            <th className="py-2 pr-3 w-16">#</th>
                            <th className="py-2 pr-3">Naam</th>
                            <th className="py-2 pr-3 text-right">C.K. 2</th>
                            {sortBy === 'afstand' && afstandKey && (
                              <th className="py-2 pr-3 text-right">
                                {afstanden.find((a) => a.key === afstandKey)?.label}
                              </th>
                            )}
                            <th className="py-2 pr-3 text-right">Wedstrijden</th>
                            <th className="py-2 text-right">Afstanden</th>
                          </tr>
                        </thead>
                        <tbody>
                          {zichtbaar.map((s) => (
                            <tr
                              key={s.naam}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-2 pr-3 text-gray-400">
                                {s.rang ?? '\u2013'}
                              </td>
                              <td className="py-2 pr-3 font-medium text-gray-900">
                                {s.naam}
                              </td>
                              <td className="py-2 pr-3 text-right font-mono text-gray-900">
                                {formatScore(s.ck2)}
                              </td>
                              {sortBy === 'afstand' && afstandKey && (
                                <td className="py-2 pr-3 text-right font-mono text-gray-900">
                                  {s.tijden[afstandKey]?.display || '\u2013'}
                                </td>
                              )}
                              <td className="py-2 pr-3 text-right text-gray-600">
                                {s.wedstrijden}
                              </td>
                              <td className="py-2 text-right">
                                <Voortgang s={s} />
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
      </main>
      <Footer />
    </>
  );
}

function Voortgang({ s }: { s: Swimmer }) {
  const compleet = s.gezwommen >= s.totaalAfstanden;
  return (
    <span
      className={`text-xs ${compleet ? 'text-green-700' : 'text-gray-400'}`}
      title={
        compleet
          ? 'Alle klassementsafstanden gezwommen'
          : `Nog ${s.totaalAfstanden - s.gezwommen} afstand(en) te gaan`
      }
    >
      {s.gezwommen}/{s.totaalAfstanden}
    </span>
  );
}

function formatScore(n: number | null): string {
  if (n === null) return '\u2013';
  return n.toFixed(2).replace('.', ',');
}
