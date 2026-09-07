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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagina niet gevonden</h1>
            <p className="text-gray-600 mb-8">
              De pagina die je zoekt bestaat niet.
            </p>
            <Link href="/" className="text-blue-900 hover:text-blue-700">
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
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="text-blue-100 hover:text-white text-sm mb-4 inline-block">
              ← Home
            </Link>
            <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="text-gray-700 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="bg-gray-50 border-t border-gray-200 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Meer informatie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPages.slice(0, 6).map((p: any) => (
                <Link
                  key={p.id}
                  href={`/pages/${p.slug}`}
                  className="p-4 border border-gray-200 rounded hover:shadow-md transition text-gray-900 hover:text-blue-900"
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
