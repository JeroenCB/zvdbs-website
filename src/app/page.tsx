import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import InfoCard from '@/components/InfoCard';
import Link from 'next/link';
import { getNews } from '@/lib/pages';

export default async function Home() {
  const news = await getNews(3);

  return (
    <>
      <Header />
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Welkom bij ZVDBS</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Zwemvereniging de Blauwe Schuur - Competities, trainingen en gezelligheid
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/membership"
                className="bg-white text-blue-900 px-8 py-3 rounded font-semibold hover:bg-blue-50"
              >
                Lid worden
              </Link>
              <Link
                href="/news"
                className="border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white hover:text-blue-900"
              >
                Laatste nieuws
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Info Cards */}
        <section className="bg-gray-50 border-b border-gray-200 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                title="🏊 Trainingen"
                description="Woensdag en vrijdag trainingen voor junioren en senioren"
              />
              <InfoCard
                title="🏆 Wedstrijden"
                description="Maandelijks landelijke competities en lokale evenementen"
              />
              <InfoCard
                title="👥 Community"
                description="Gezellige club met meer dan 100 leden"
              />
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Laatste nieuws</h2>
              <Link href="/news" className="text-blue-900 hover:text-blue-700 font-semibold">
                Alle berichten →
              </Link>
            </div>
            
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {news.map((article: any) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category}
                    date={new Date(article.date).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    slug={article.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded">
                <p className="text-gray-500">Nog geen nieuws beschikbaar</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 border-y border-blue-200 py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Klaar om lid te worden?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Kom gratis proefzwemmen en ervaar de gezelligheid van de Blauwe Schuur.
            </p>
            <Link
              href="/membership"
              className="inline-block bg-blue-900 text-white px-8 py-3 rounded font-semibold hover:bg-blue-800"
            >
              Meer informatie
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
