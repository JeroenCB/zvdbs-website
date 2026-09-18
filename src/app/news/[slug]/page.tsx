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
            <h1 className="text-3xl font-bold text-ink mb-4">Artikel niet gevonden</h1>
            <p className="text-sub mb-8">
              Het artikel dat u zoekt, bestaat niet.
            </p>
            <Link href="/news" className="text-coral hover:text-coral-dark">
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
        <section className="bg-white border-b border-line py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/news" className="text-coral hover:text-coral-dark text-sm mb-4 inline-block">
              ← Terug naar nieuws
            </Link>
            <h1 className="text-4xl font-bold text-ink mb-4">{article.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-sub">
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
              className="prose prose-lg max-w-none text-ink/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </section>

        {/* Related Articles CTA */}
        <section className="bg-coral-light border-t border-line py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-ink mb-4">Meer nieuws</h2>
            <p className="text-sub mb-8">
              Bekijk al onze nieuwsartikelen en blijf op de hoogte.
            </p>
            <Link
              href="/news"
              className="inline-block bg-coral text-white px-8 py-3 rounded-full font-semibold hover:bg-coral-dark"
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
