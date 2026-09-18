import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LidmaatschapForm from '@/components/forms/LidmaatschapForm';
import { getPage } from '@/lib/pages';

export default async function MembershipPage() {
  const infoPage = await getPage('lidmaatschap');
  const formIntroPage = await getPage('lid-worden');

  if (!infoPage && !formIntroPage) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-ink mb-4">Lidmaatschap</h1>
            <p className="text-sub">Page not found</p>
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
        <section className="bg-aqua-light border-b border-line py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-ink mb-2 tracking-tight">{infoPage?.title ?? 'Lidmaatschap'}</h1>
            <p className="text-sub">Sluit je aan bij onze zwemclub</p>
          </div>
        </section>

        {/* Content: contributie, opzeggen, etc. */}
        {infoPage && (
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
              <div
                className="text-ink/80 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: infoPage.content }}
              />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-aqua-light border-t border-line py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-ink mb-4">Nog niet zeker?</h2>
            <p className="text-sub mb-8">
              Kom gratis en vrijblijvend proefzwemmen en ervaar de gezelligheid van de Blauwe Schuur.
            </p>
            <Link
              href="/proefzwemmen"
              className="inline-block bg-gradient-to-r from-aqua to-aqua-dark text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-aqua/30"
            >
              Aanmelden proefzwemmen
            </Link>
          </div>
        </section>

        {/* Aanmeldformulier */}
        <section id="aanmelden" className="py-12 px-6 scroll-mt-20">
          <div className="max-w-2xl mx-auto">
            {formIntroPage ? (
              <div
                className="text-ink/80 leading-relaxed space-y-4 mb-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink"
                dangerouslySetInnerHTML={{ __html: formIntroPage.content }}
              />
            ) : (
              <h2 className="text-2xl font-semibold text-ink mb-8">Word lid</h2>
            )}
            <LidmaatschapForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
