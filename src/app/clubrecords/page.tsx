'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect, useMemo } from 'react';

interface Record {
  id: string;
  slag: string;
  categorie: string;
  afstand: string;
  naam: string;
  tijd: string;
  datum: string;
  plaats: string;
}

export default function ClubrecordsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [slagen, setSlagen] = useState<string[]>([]);
  const [categorieen, setCategorieen] = useState<string[]>([]);
  const [afstanden, setAfstanden] = useState<string[]>([]);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [zoek, setZoek] = useState('');
  const [slag, setSlag] = useState('');
  const [categorie, setCategorie] = useState('');
  const [afstand, setAfstand] = useState('');

  useEffect(() => {
    laadData();
  }, []);

  async function laadData() {
    try {
      setLoading(true);
      const res = await fetch('/api/records');
      const data = await res.json();

      if (!data.success) {
        setError(data.hint || data.error || 'Kon records niet laden');
        setRecords([]);
        return;
      }

      setRecords(data.records || []);
      setSlagen(data.slagen || []);
      setCategorieen(data.categorieen || []);
      setAfstanden(data.afstanden || []);
      setLastFetched(data.lastFetched || null);
      setError(null);
    } catch {
      setError('Fout bij het laden van de records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  const zichtbaar = useMemo(() => {
    let lijst = records;
    const q = zoek.trim().toLowerCase();
    if (q) lijst = lijst.filter((r) => r.naam.toLowerCase().includes(q));
    if (slag) lijst = lijst.filter((r) => r.slag === slag);
    if (categorie) lijst = lijst.filter((r) => r.categorie === categorie);
    if (afstand) lijst = lijst.filter((r) => r.afstand === afstand);
    return lijst;
  }, [records, zoek, slag, categorie, afstand]);

  const filtersActief = zoek !== '' || slag !== '' || categorie !== '' || afstand !== '';

  const resetFilters = () => {
    setZoek('');
    setSlag('');
    setCategorie('');
    setAfstand('');
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-gray-200 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clubrecords</h1>
            <p className="text-gray-600">
              Alle clubrecords van ZVDBS, per slag en leeftijdscategorie.
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
                Records konden niet worden geladen
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
            <p className="text-gray-500">Records laden...</p>
          </section>
        )}

        {!loading && !error && (
          <>
            <section className="py-6 px-6 border-b border-gray-200">
              <div className="max-w-6xl mx-auto space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label
                      htmlFor="zoek"
                      className="block text-xs font-medium text-gray-500 mb-1"
                    >
                      Zoek een naam
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

                  <Dropdown
                    id="slag"
                    label="Slag"
                    value={slag}
                    onChange={setSlag}
                    alles="Alle slagen"
                    opties={slagen}
                  />
                  <Dropdown
                    id="categorie"
                    label="Categorie"
                    value={categorie}
                    onChange={setCategorie}
                    alles="Alle categorieen"
                    opties={categorieen}
                  />
                  <Dropdown
                    id="afstand"
                    label="Afstand"
                    value={afstand}
                    onChange={setAfstand}
                    alles="Alle afstanden"
                    opties={afstanden}
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {zichtbaar.length} van {records.length} records
                  </span>
                  {filtersActief && (
                    <button onClick={resetFilters} className="underline">
                      Filters wissen
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="py-8 px-6">
              <div className="max-w-6xl mx-auto">
                {zichtbaar.length === 0 ? (
                  <p className="text-gray-500 text-sm py-8 text-center">
                    Geen records gevonden met deze filters.
                  </p>
                ) : (
                  <>
                    {/* Mobiel: kaarten */}
                    <ul className="sm:hidden space-y-2">
                      {zichtbaar.map((r) => (
                        <li
                          key={r.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {r.naam}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {r.categorie} &middot; {r.afstand}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {r.datum} {r.plaats && `\u2013 ${r.plaats}`}
                              </div>
                            </div>
                            <div className="font-mono text-sm text-gray-900 whitespace-nowrap">
                              {r.tijd}
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
                            <th className="py-2 pr-3">Categorie</th>
                            <th className="py-2 pr-3">Afstand</th>
                            <th className="py-2 pr-3">Naam</th>
                            <th className="py-2 pr-3 text-right">Tijd</th>
                            <th className="py-2 pr-3">Datum</th>
                            <th className="py-2">Plaats</th>
                          </tr>
                        </thead>
                        <tbody>
                          {zichtbaar.map((r) => (
                            <tr
                              key={r.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-2 pr-3 text-gray-600">{r.categorie}</td>
                              <td className="py-2 pr-3 text-gray-600">{r.afstand}</td>
                              <td className="py-2 pr-3 font-medium text-gray-900">
                                {r.naam}
                              </td>
                              <td className="py-2 pr-3 text-right font-mono text-gray-900">
                                {r.tijd}
                              </td>
                              <td className="py-2 pr-3 text-gray-500">{r.datum}</td>
                              <td className="py-2 text-gray-500">{r.plaats}</td>
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

function Dropdown({
  id,
  label,
  value,
  onChange,
  alles,
  opties,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  alles: string;
  opties: string[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900"
      >
        <option value="">{alles}</option>
        {opties.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
