import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProefzwemmenForm from '@/components/forms/ProefzwemmenForm';
import { getPage } from '@/lib/pages';

export default async function ProefzwemmenPage() {
  const page = await getPage('proef-zwemmen');

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-aqua-light border-b border-line py-12 px-6 dark:bg-night-bg dark:border-night-line">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-ink mb-2 tracking-tight dark:text-night-ink">Proefzwemmen</h1>
            <p className="text-sub dark:text-night-sub">Kom gratis en vrijblijvend kennismaken met ZVDBS</p>
          </div>
        </section>

        {/* Content + Form */}
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            {page && (
              <div
                className="text-ink/80 leading-relaxed space-y-4 mb-8 dark:text-night-ink/80"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
            <ProefzwemmenForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
