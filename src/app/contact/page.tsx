import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/forms/ContactForm';
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
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
