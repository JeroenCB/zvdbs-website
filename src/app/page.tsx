import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import InfoCard from '@/components/InfoCard';
import fs from 'fs';
import path from 'path';

async function getNews() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/news.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const news = JSON.parse(data);
    return news.slice(0, 3); // Get first 3 news items
  } catch (error) {
    console.error('Error reading news:', error);
    return [];
  }
}

export default async function Home() {
  const news = await getNews();

  return (
    <>
      <Header />
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Zwemvereniging de Blauwe Schuur</h1>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Competities, trainingen en gezelligheid. Sluit je aan bij Rheens meest actieve zwemclub.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-white text-blue-900 px-6 py-3 rounded font-semibold hover:bg-gray-100">
                Proefzwemmen
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-blue-900">
                Informatie
              </button>
            </div>
          </div>
        </section>

        {/* Quick Info Cards */}
        <section className="bg-gray-50 border-b border-gray-200 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                label="Trainingsschema"
                title="Woensdag & Vrijdag"
                detail="Junioren: 18:15–19:00 | Senioren: 19:00–20:00"
              />
              <InfoCard
                label="Volgende Wedstrijd"
                title="Za, 15 Maart"
                detail="Landelijke Competitie, Tiel"
              />
              <InfoCard
                label="Leden"
                title="~45 Actief"
                detail="Junioren & Senioren"
              />
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8">Laatste Nieuws</h2>
            
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {news.map((article: any) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category}
                    date={article.date}
                    slug={article.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Nog geen nieuws beschikbaar</p>
              </div>
            )}

            <div className="text-center">
              <a
                href="/nieuws"
                className="inline-block px-6 py-3 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50"
              >
                Bekijk alle nieuws
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 border-y border-gray-200 py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">Wil je graag lid worden?</h2>
            <p className="text-gray-600 mb-8">
              Kom gratis proefzwemmen en ervaar de gezelligheid van de Blauwe Schuur.
            </p>
            <button className="bg-blue-900 text-white px-8 py-3 rounded font-semibold hover:bg-blue-800">
              Aanmelden proefzwemmen
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
