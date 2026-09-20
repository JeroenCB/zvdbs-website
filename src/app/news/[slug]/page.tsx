import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getNewsArticle, getNews } from '@/lib/pages';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((article: any) => ({
    slug: article.slug,
  }));
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await getNewsArticle(params.slug);

  if (!article) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-ink mb-4 dark:text-night-ink">Artikel niet gevonden</h1>
            <p className="text-sub mb-8 dark:text-night-sub">
              Het artikel dat u zoekt, bestaat niet.
            </p>
            <Link href="/news" className="text-aqua hover:text-aqua-dark dark:text-night-cyan dark:hover:text-night-violet">
              ← Terug naar nieuws
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const publishDate = new Date(article.date).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Article Header */}
        <section className="bg-white border-b border-line py-12 px-6 dark:bg-night-bg dark:border-night-line">
          <div className="max-w-4xl mx-auto">
            <Link href="/news" className="text-aqua hover:text-aqua-dark text-sm mb-4 inline-block dark:text-night-cyan dark:hover:text-night-violet">
              ← Terug naar nieuws
            </Link>
            <h1 className="text-4xl font-bold text-ink mb-4 dark:text-night-ink">{article.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-sub dark:text-night-sub">
              <span>{publishDate}</span>
              <span>•</span>
              <span>Door {article.author}</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none text-ink/80 leading-relaxed dark:prose-invert dark:text-night-ink/80"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </section>

        {/* Related Articles CTA */}
        <section className="bg-aqua-light border-t border-line py-12 px-6 dark:bg-gradient-to-br dark:from-night-cyan/10 dark:to-night-violet/[0.06] dark:border-night-line">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-ink mb-4 dark:text-night-ink">Meer nieuws</h2>
            <p className="text-sub mb-8 dark:text-night-sub">
              Bekijk al onze nieuwsartikelen en blijf op de hoogte.
            </p>
            <Link
              href="/news"
              className="inline-block bg-gradient-to-r from-aqua to-aqua-dark dark:from-night-cyan dark:to-night-violet text-white dark:text-night-bg px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-aqua/30 dark:shadow-night-cyan/30"
            >
              Terug naar alle artikelen
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
