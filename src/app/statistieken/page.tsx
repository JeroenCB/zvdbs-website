'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

interface Swimmer {
  [key: string]: any;
  points?: number;
}

export default function StatisticsPage() {
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('points'); // Standaard sorteren op C.K. 2

  useEffect(() => {
    fetchSwimmers();
  }, []);

  const fetchSwimmers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/swimmers');
      const data = await response.json();

      if (data.success) {
        setSwimmers(data.swimmers || data.allSwimmers || []);
        setError(null);
      } else {
        setError(data.error || 'Kon gegevens niet laden');
        setSwimmers([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Fout bij het laden van de gegevens');
      setSwimmers([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort swimmers based on selected column
  const sortedSwimmers = [...swimmers].sort((a, b) => {
    const aVal = a[sortBy] || 0;
    const bVal = b[sortBy] || 0;

    // Numerieke sortering
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return bVal - aVal; // Aflopend
    }

    // String sortering
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return aStr.localeCompare(bStr);
  });

  const topSwimmers = sortedSwimmers.slice(0, 10);

  const sortOptions = [
    { value: 'points', label: 'C.K. 2 Punten (standaard)' },
    { value: 'a', label: 'Naam (A-Z)' },
    { value: 'b', label: 'Categorie' },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-gray-200 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistieken</h1>
            <p className="text-gray-600">Live gegevens uit Adelskalender</p>
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {new Date().toLocaleTimeString('nl-NL')}
            </p>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <section className="py-4 px-6 bg-red-50 border-b border-red-200">
            <div className="max-w-6xl mx-auto">
              <p className="text-red-700 text-sm">⚠️ {error}</p>
              <button
                onClick={fetchSwimmers}
                className="text-red-900 hover:text-red-700 font-semibold text-xs mt-2"
              >
                Opnieuw proberen
              </button>
            </div>
          </section>
        )}

        {/* Sort Options */}
        <section className="py-6 px-6 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-2">
                  Sorteren op:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500">
                📊 Total zwemmers geladen: {swimmers.length}
              </p>
            </div>
          </div>
        </section>

        {/* Adelskalen - Top 10 */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 Adelskalender Top 10</h2>
            <p className="text-gray-600 mb-8 text-sm">Gesorteerd op: {sortOptions.find(o => o.value === sortBy)?.label}</p>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Laden...</p>
              </div>
            ) : topSwimmers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topSwimmers.map((swimmer, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 ${
                      idx === 0
                        ? 'border-2 border-yellow-400 bg-yellow-50'
                        : idx === 1
                        ? 'border-2 border-gray-400 bg-gray-50'
                        : idx === 2
                        ? 'border-2 border-amber-400 bg-amber-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">#{idx + 1}</div>
                      {idx === 0 && <div className="text-3xl mb-2">🥇</div>}
                      {idx === 1 && <div className="text-3xl mb-2">🥈</div>}
                      {idx === 2 && <div className="text-3xl mb-2">🥉</div>}

                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {swimmer.a || swimmer.name || 'N/A'}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">{swimmer.b || swimmer.category || ''}</p>

                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-600">C.K. 2</p>
                        <p className="text-lg font-bold text-blue-900">
                          {typeof swimmer.points === 'number'
                            ? swimmer.points.toFixed(2)
                            : swimmer.points || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded">
                <p className="text-gray-500">Geen gegevens beschikbaar</p>
              </div>
            )}
          </div>
        </section>

        {/* Full Rankings Table */}
        {swimmers.length > 0 && (
          <section className="py-12 px-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Volledige Ranking</h2>

              <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-medium text-gray-700 w-12">#</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Naam</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Categorie</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-700">C.K. 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSwimmers.slice(0, 50).map((swimmer, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-900">{swimmer.a || swimmer.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{swimmer.b || swimmer.category || ''}</td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-900">
                          {typeof swimmer.points === 'number'
                            ? swimmer.points.toFixed(2)
                            : swimmer.points || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedSwimmers.length > 50 && (
                <p className="text-xs text-gray-500 mt-4">
                  Toon eerste 50 van {sortedSwimmers.length} zwemmers
                </p>
              )}
            </div>
          </section>
        )}

        {/* Member Search */}
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Zwemmer Opzoeken</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Zoek op naam..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm text-gray-900"
              />
              <button className="px-6 py-2 bg-blue-900 text-white rounded font-semibold text-sm hover:bg-blue-800">
                Zoeken
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Vul een naam in om persoonlijke records en statistieken te bekijken
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
