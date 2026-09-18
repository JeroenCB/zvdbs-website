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
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Proefzwemmen</h1>
            <p className="text-blue-100">Kom gratis en vrijblijvend kennismaken met ZVDBS</p>
          </div>
        </section>

        {/* Content + Form */}
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            {page && (
              <div
                className="text-gray-700 leading-relaxed space-y-4 mb-8"
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
