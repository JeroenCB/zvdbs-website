import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPage } from '@/lib/pages';

export default async function ContactPage() {
  const page = await getPage('contact');

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Contact</h1>
            <p className="text-blue-100">Neem contact met ons op</p>
          </div>
        </section>

        {/* Content */}
        {page && (
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div
                className="text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </section>
        )}

        {/* Contact Info & Form */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Contactgegevens</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">ADRES</p>
                    <p className="text-gray-900">
                      Groeneweg 58<br />
                      3911 PG Rhenen<br />
                      Nederland
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">EMAIL</p>
                    <a href="mailto:secretaris@zvdbs.nl" className="text-blue-900 hover:text-blue-700">
                      secretaris@zvdbs.nl
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">TELEFOON</p>
                    <p className="text-gray-900">Contact via email of social media</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">VOLG ONS</p>
                    <div className="flex gap-4">
                      <a
                        href="https://facebook.com/zvdbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://instagram.com/zvdbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-600"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Stuur ons een bericht</h2>
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Naam
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                      placeholder="Jouw naam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                      placeholder="jouw@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Bericht
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                      placeholder="Je bericht hier..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800"
                  >
                    Verzenden
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                  We antwoorden meestal binnen 24 uur.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
