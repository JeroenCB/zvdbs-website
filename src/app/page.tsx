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
        <section className="relative overflow-hidden px-6 pt-20 pb-28 text-center">
          <div className="pointer-events-none absolute -top-56 -right-40 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.16),rgba(6,182,212,0)_70%)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.16),rgba(34,211,238,0)_70%)]" />
          <div className="pointer-events-none absolute -bottom-64 -left-44 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.14),rgba(6,182,212,0)_70%)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(129,140,248,0.14),rgba(129,140,248,0)_70%)]" />

          <div className="relative max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink mb-5 leading-tight tracking-tight dark:text-night-ink">
              Welkom bij{' '}
              <span className="bg-gradient-to-r from-aqua to-aqua-dark dark:from-night-cyan dark:to-night-violet bg-clip-text text-transparent">
                ZVDBS
              </span>
            </h1>
            <p className="text-lg text-sub mb-10 leading-relaxed max-w-xl mx-auto dark:text-night-sub">
              Zwemvereniging de Blauwe Schuur — competities, trainingen en gezelligheid, het hele
              jaar door.
            </p>
            <div className="flex gap-3.5 flex-wrap justify-center">
              <Link
                href="/proefzwemmen"
                className="bg-gradient-to-r from-aqua to-aqua-dark dark:from-night-cyan dark:to-night-violet text-white dark:text-night-bg px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-aqua/30 hover:shadow-xl hover:shadow-aqua/40 dark:shadow-night-cyan/30 dark:hover:shadow-night-cyan/40 transition-shadow"
              >
                Proefzwemmen
              </Link>
              <Link
                href="/news"
                className="bg-white border border-line text-ink px-7 py-3.5 rounded-xl font-bold text-sm hover:border-aqua hover:text-aqua-dark dark:bg-white/[0.04] dark:border-night-line dark:text-night-ink dark:hover:border-night-cyan dark:hover:text-night-cyan dark:backdrop-blur-sm"
              >
                Laatste nieuws
              </Link>
            </div>
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
            <h2 className="text-3xl font-extrabold text-ink dark:text-night-ink">Laatste nieuws</h2>
            <Link href="/news" className="text-aqua hover:text-aqua-dark font-semibold dark:text-night-cyan dark:hover:text-night-violet">
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
                  image={article.image}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-line rounded-2xl dark:bg-white/[0.03] dark:border-night-line">
              <p className="text-sub dark:text-night-sub">Nog geen nieuws beschikbaar</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-aqua-light rounded-3xl py-16 px-6 text-center dark:bg-gradient-to-br dark:from-night-cyan/10 dark:to-night-violet/[0.06] dark:border dark:border-night-line">
            <h2 className="text-3xl font-extrabold text-ink mb-3.5 tracking-tight dark:text-night-ink">
              Klaar om lid te worden?
            </h2>
            <p className="text-sub mb-8 text-base dark:text-night-sub">
              Kom gratis proefzwemmen en ervaar de gezelligheid van de Blauwe Schuur.
            </p>
            <Link
              href="/membership"
              className="inline-block bg-gradient-to-r from-aqua to-aqua-dark dark:from-night-cyan dark:to-night-violet text-white dark:text-night-bg px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-aqua/30 dark:shadow-night-cyan/30"
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
