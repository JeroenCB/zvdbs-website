'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

interface Record {
  id: number;
  category: string;
  distance: number;
  stroke: string;
  name: string;
  time: string;
  date: string;
}

interface Swimmer {
  rank: number;
  name: string;
  gender: string;
  year: number;
  points: number;
  races: number;
  personalBest: string;
}

export default function StatisticsPage() {
  const [sampleRecords, setSampleRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [stroke, setStroke] = useState('all');
  const [category, setCategory] = useState('all');
  const [distance, setDistance] = useState('all');

  useEffect(() => {
    fetch('/data/records.json')
      .then(res => res.json())
      .then(data => {
        setSampleRecords(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading records:', err);
        setLoading(false);
      });
  }, []);

  const topSwimmers: Swimmer[] = [
    {
      rank: 1,
      name: 'Jelle Roks',
      gender: 'M',
      year: 1990,
      points: 66.43,
      races: 246,
      personalBest: '0:57.11',
    },
    {
      rank: 2,
      name: 'Marcel Stalenhoef',
      gender: 'M',
      year: 1981,
      points: 67.17,
      races: 294,
      personalBest: '0:58.44',
    },
    {
      rank: 3,
      name: 'Rosanne Diepeveen',
      gender: 'V',
      year: 1999,
      points: 75.76,
      races: 116,
      personalBest: '1:04.80',
    },
  ];

  const filteredRecords = sampleRecords.filter((record) => {
    if (stroke !== 'all' && record.stroke !== stroke) return false;
    if (category !== 'all' && record.category !== category) return false;
    if (distance !== 'all' && record.distance !== parseInt(distance)) return false;
    return true;
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-gray-200 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistieken</h1>
            <p className="text-gray-600">Club- en persoonlijke records per slag en afstand</p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 px-6 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-2">Slag</label>
                <select
                  value={stroke}
                  onChange={(e) => setStroke(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900"
                >
                  <option value="all">Alle slagen</option>
                  <option value="Vrijeslag">Vrijeslag</option>
                  <option value="Rugslag">Rugslag</option>
                  <option value="Schoolslag">Schoolslag</option>
                  <option value="Vlinderslag">Vlinderslag</option>
                  <option value="Wisselslag">Wisselslag</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-2">Categorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900"
                >
                  <option value="all">Alle categorieën</option>
                  <option value="Heren">Heren</option>
                  <option value="Dames">Dames</option>
                  <option value="JO14">JO14</option>
                  <option value="JO16">JO16</option>
                  <option value="JO18">JO18</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-2">Afstand</label>
                <select
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900"
                >
                  <option value="all">Alle afstanden</option>
                  <option value="25">25m</option>
                  <option value="50">50m</option>
                  <option value="100">100m</option>
                  <option value="200">200m</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Club Records Table */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Club Records</h2>
            
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Categorie</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Slag</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Afstand</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Naam</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">Tijd</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Laden...
                      </td>
                    </tr>
                  ) : filteredRecords.length > 0 ? (
                    filteredRecords.map((record, idx) => (
                      <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-900">{record.category}</td>
                        <td className="px-4 py-3 text-gray-600">{record.stroke}</td>
                        <td className="px-4 py-3 text-gray-600">{record.distance}m</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{record.name}</td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-900">{record.time}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{record.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Geen records gevonden met deze filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Top Swimmers Leaderboard */}
        <section className="py-12 px-6 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Top Zwemmers (Adelskalen)</h2>
            <p className="text-gray-600 mb-8 text-sm">Gemiddelde prestatie over alle afstanden en slagen</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topSwimmers.map((swimmer) => (
                <div
                  key={swimmer.rank}
                  className={`bg-white border rounded-lg p-6 ${
                    swimmer.rank === 1
                      ? 'border-blue-900 border-t-4'
                      : swimmer.rank === 2
                      ? 'border-gray-400 border-t-4'
                      : 'border-amber-500 border-t-4'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {swimmer.rank === 1 && '🏆 #1'}
                        {swimmer.rank === 2 && '🥈 #2'}
                        {swimmer.rank === 3 && '🥉 #3'}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{swimmer.name}</h3>
                      <p className="text-xs text-gray-600">
                        {swimmer.gender === 'M' ? 'Heren' : 'Dames'} • {swimmer.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          swimmer.rank === 1
                            ? 'text-blue-900'
                            : swimmer.rank === 2
                            ? 'text-gray-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {swimmer.points}
                      </div>
                      <p className="text-xs text-gray-600">punten</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 text-xs text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Wedstrijden:</span>
                      <span className="font-medium text-gray-900">{swimmer.races}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PB Vrijeslag:</span>
                      <span className="font-medium text-gray-900">{swimmer.personalBest}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Search */}
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mijn Persoonlijke Records</h3>
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
              Vul je naam in om je persoonlijke records en statistieken te bekijken
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
