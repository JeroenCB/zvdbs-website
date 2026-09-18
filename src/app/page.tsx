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
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-line px-4 py-2 rounded-full text-sm font-semibold text-teal mb-6">
              ☀️ Zwemmen voor iedereen
            </div>
            <h1 className="text-5xl font-extrabold text-ink mb-5 leading-tight">
              Welkom bij <span className="text-coral">ZVDBS</span>
            </h1>
            <p className="text-lg text-sub mb-8 leading-relaxed max-w-md">
              Zwemvereniging de Blauwe Schuur: een gezellige club in Rhenen voor competities,
              trainingen en vriendschap in het water.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/proefzwemmen"
                className="bg-coral text-white px-8 py-3 rounded-full font-semibold hover:bg-coral-dark shadow-lg shadow-coral/30"
              >
                Proefzwemmen
              </Link>
              <Link
                href="/news"
                className="bg-white border border-line text-ink px-8 py-3 rounded-full font-semibold hover:border-coral hover:text-coral"
              >
                Laatste nieuws
              </Link>
            </div>
          </div>
          <div className="relative h-72 md:h-80 rounded-3xl bg-gradient-to-br from-teal to-teal-dark overflow-hidden">
            <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-coral/40" />
            <div className="absolute bottom-2 right-6 text-8xl">🏊‍♀️</div>
          </div>
        </section>

        {/* Quick Info Cards */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon="🏊"
              title="Trainingen"
              description="Woensdag en vrijdag trainingen voor junioren en senioren"
            />
            <InfoCard
              icon="🏆"
              title="Wedstrijden"
              description="Maandelijks landelijke competities en lokale evenementen"
            />
            <InfoCard
              icon="👥"
              title="Community"
              description="Gezellige club met meer dan 100 leden"
            />
          </div>
        </section>

        {/* Latest News */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-extrabold text-ink">Laatste nieuws</h2>
            <Link href="/news" className="text-coral hover:text-coral-dark font-semibold">
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
            <div className="text-center py-12 bg-white border border-line rounded-2xl">
              <p className="text-sub">Nog geen nieuws beschikbaar</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-br from-teal to-teal-dark rounded-3xl py-16 px-6 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-4">Klaar om lid te worden?</h2>
            <p className="text-white/85 mb-8 text-lg">
              Kom gratis proefzwemmen en ervaar de gezelligheid van de Blauwe Schuur.
            </p>
            <Link
              href="/membership"
              className="inline-block bg-coral text-white px-8 py-3 rounded-full font-semibold hover:bg-coral-dark"
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
