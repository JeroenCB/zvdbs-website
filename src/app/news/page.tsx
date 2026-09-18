import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { getNews } from '@/lib/pages';

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-aqua-light border-b border-line py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-ink mb-2 tracking-tight">Nieuws & Berichten</h1>
            <p className="text-sub">Blijf op de hoogte van het laatste nieuws van ZVDBS</p>
          </div>
        </section>

        {/* News Articles */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-12">
                <p className="text-sub text-lg">Nog geen nieuwsartikelen beschikbaar</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
