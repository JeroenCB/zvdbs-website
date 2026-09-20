import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getPage, getAllPages } from '@/lib/pages';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((page: any) => ({
    slug: page.slug,
  }));
}

export default async function PageDetail({ params }: Props) {
  const page = await getPage(params.slug);
  const allPages = await getAllPages();

  if (!page) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-ink mb-4 dark:text-night-ink">Pagina niet gevonden</h1>
            <p className="text-sub mb-8 dark:text-night-sub">
              De pagina die je zoekt bestaat niet.
            </p>
            <Link href="/" className="text-aqua hover:text-aqua-dark dark:text-night-cyan dark:hover:text-night-violet">
              ← Terug naar home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-aqua-light border-b border-line py-12 px-6 dark:bg-night-bg dark:border-night-line">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="text-sub hover:text-aqua-dark text-sm mb-4 inline-block dark:text-night-sub dark:hover:text-night-cyan">
              ← Home
            </Link>
            <h1 className="text-4xl font-extrabold text-ink mb-2 tracking-tight dark:text-night-ink">{page.title}</h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="text-ink/80 leading-relaxed space-y-6 dark:text-night-ink/80"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="bg-white border-t border-line py-12 px-6 dark:bg-night-bg dark:border-night-line">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-ink mb-8 dark:text-night-ink">Meer informatie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPages.slice(0, 6).map((p: any) => (
                <Link
                  key={p.id}
                  href={`/pages/${p.slug}`}
                  className="p-4 border border-line rounded-xl hover:shadow-md hover:border-aqua transition text-ink hover:text-aqua dark:border-night-line dark:text-night-ink dark:hover:border-night-cyan dark:hover:text-night-cyan dark:hover:shadow-none"
                >
                  <p className="font-semibold">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
