'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Swimmer, Afstand } from './StatistiekenTab';
import { formatScore } from './StatistiekenTab';

export default function PersoonlijkeRecordsTab() {
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [afstanden, setAfstanden] = useState<Afstand[]>([]);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [zoek, setZoek] = useState('');
  const [open, setOpen] = useState(false);
  const [geselecteerdId, setGeselecteerdId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    laadData();
  }, []);

  useEffect(() => {
    function handleClickBuiten(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickBuiten);
    return () => document.removeEventListener('mousedown', handleClickBuiten);
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
      setLastFetched(data.lastFetched || null);
      setError(null);
    } catch {
      setError('Fout bij het laden van de gegevens');
      setSwimmers([]);
    } finally {
      setLoading(false);
    }
  }

  const suggesties = useMemo(() => {
    const q = zoek.trim().toLowerCase();
    if (!q) return [];
    return swimmers
      .filter((s) => s.naam.toLowerCase().includes(q))
      .slice(0, 8);
  }, [swimmers, zoek]);

  const geselecteerd = useMemo(
    () => swimmers.find((s) => s.id === geselecteerdId) || null,
    [swimmers, geselecteerdId]
  );

  function kiesZwemmer(s: Swimmer) {
    setGeselecteerdId(s.id);
    setZoek(s.naam);
    setOpen(false);
  }

  function wisSelectie() {
    setGeselecteerdId(null);
    setZoek('');
  }

  return (
    <>
      <section className="border-b border-line py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-ink mb-2">
            Persoonlijke records
          </h1>
          <p className="text-sub">
            Zoek een zwemmer op en bekijk zijn of haar tijden op de
            klassementsafstanden.
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
          <p className="text-sub">Gegevens laden...</p>
        </section>
      )}

      {!loading && !error && (
        <>
          <section className="py-6 px-6 border-b border-line">
            <div className="max-w-6xl mx-auto">
              <div ref={wrapperRef} className="relative max-w-sm">
                <label
                  htmlFor="zwemmer-zoek"
                  className="block text-xs font-medium text-sub mb-1"
                >
                  Zoek een zwemmer
                </label>
                <div className="flex gap-2">
                  <input
                    id="zwemmer-zoek"
                    type="search"
                    value={zoek}
                    onChange={(e) => {
                      setZoek(e.target.value);
                      setGeselecteerdId(null);
                      setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Typ een naam..."
                    autoComplete="off"
                    className="w-full px-3 py-2 border border-line rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua"
                  />
                  {(zoek || geselecteerd) && (
                    <button
                      onClick={wisSelectie}
                      className="text-xs text-sub underline whitespace-nowrap"
                    >
                      Wissen
                    </button>
                  )}
                </div>

                {open && zoek.trim() !== '' && !geselecteerd && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-line rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {suggesties.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-sub">
                        Geen zwemmer gevonden.
                      </li>
                    ) : (
                      suggesties.map((s) => (
                        <li key={s.id}>
                          <button
                            onClick={() => kiesZwemmer(s)}
                            className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-aqua-light/40"
                          >
                            {s.naam}
                            {s.rang && (
                              <span className="text-sub"> &middot; #{s.rang}</span>
                            )}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className="py-8 px-6">
            <div className="max-w-6xl mx-auto">
              {!geselecteerd ? (
                <p className="text-sub text-sm py-8 text-center">
                  Zoek hierboven een zwemmer om diens persoonlijke records te
                  zien.
                </p>
              ) : (
                <ZwemmerRecords swimmer={geselecteerd} afstanden={afstanden} />
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}

function ZwemmerRecords({
  swimmer,
  afstanden,
}: {
  swimmer: Swimmer;
  afstanden: Afstand[];
}) {
  const rijen = afstanden.map((a) => ({
    ...a,
    tijd: swimmer.tijden[a.key] || null,
  }));
  const gezwommenRijen = rijen.filter((r) => r.tijd);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink">{swimmer.naam}</h2>
          <p className="text-sm text-sub mt-0.5">
            {swimmer.rang ? `#${swimmer.rang} in het klassement` : 'Buiten het klassement'}
            {swimmer.lid === true && ' · lid'}
          </p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-8">
        <Statkaart label="C.K. 1" waarde={formatScore(swimmer.ck1)} />
        <Statkaart label="C.K. 2" waarde={formatScore(swimmer.ck2)} />
        <Statkaart label="C.K. 3" waarde={formatScore(swimmer.ck3)} />
        <Statkaart label="Adelskalender" waarde={formatScore(swimmer.adelskalender)} />
      </div>

      <div className="flex items-center gap-4 text-xs text-sub mb-4">
        <span>
          {swimmer.wedstrijden} wedstrijd{swimmer.wedstrijden === 1 ? '' : 'en'}
        </span>
        <span>
          {swimmer.gezwommen}/{swimmer.totaalAfstanden} klassementsafstanden gezwommen
        </span>
      </div>

      {gezwommenRijen.length === 0 ? (
        <p className="text-sub text-sm py-8 text-center">
          Nog geen tijden geregistreerd op de klassementsafstanden.
        </p>
      ) : (
        <>
          {/* Mobiel: kaarten */}
          <ul className="sm:hidden space-y-2">
            {rijen.map((r) => (
              <li
                key={r.key}
                className="border border-line rounded-lg p-3 flex justify-between items-center"
              >
                <span className="text-sm text-ink">{r.label}</span>
                <span
                  className={`font-mono text-sm ${
                    r.tijd ? 'text-ink' : 'text-sub/40'
                  }`}
                >
                  {r.tijd ? r.tijd.display : '–'}
                </span>
              </li>
            ))}
          </ul>

          {/* Desktop: tabel */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm max-w-md">
              <thead>
                <tr className="border-b border-line text-left text-sub text-xs uppercase">
                  <th className="py-2 pr-3">Afstand</th>
                  <th className="py-2 text-right">Persoonlijke tijd</th>
                </tr>
              </thead>
              <tbody>
                {rijen.map((r) => (
                  <tr key={r.key} className="border-b border-line">
                    <td className="py-2 pr-3 text-sub">{r.label}</td>
                    <td
                      className={`py-2 text-right font-mono ${
                        r.tijd ? 'text-ink' : 'text-sub/40'
                      }`}
                    >
                      {r.tijd ? r.tijd.display : 'nog niet gezwommen'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="text-xs text-sub mt-6">
        Dit zijn de tijden op de 9 klassementsafstanden uit de Adelskalender.
        Losse tijden op andere afstanden of slagen worden hier nog niet
        bijgehouden.
      </p>
    </div>
  );
}

function Statkaart({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div className="border border-line rounded-lg p-3">
      <div className="text-xs text-sub">{label}</div>
      <div className="font-mono text-lg text-ink mt-0.5">{waarde}</div>
    </div>
  );
}
