import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPage } from '@/lib/pages';

export default async function AboutPage() {
  const page = await getPage('wie');

  if (!page) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Over ons</h1>
            <p className="text-gray-600">Page not found</p>
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
            <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
            <p className="text-blue-100">Leer meer over Zwemvereniging de Blauwe Schuur</p>
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

        {/* Contact CTA */}
        <section className="bg-blue-50 border-t border-gray-200 py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vragen over onze club?</h2>
            <p className="text-gray-600 mb-8">
              Neem gerust contact met ons op. We beantwoorden graag je vragen.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-900 text-white px-8 py-3 rounded font-semibold hover:bg-blue-800"
            >
              Contact opnemen
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
