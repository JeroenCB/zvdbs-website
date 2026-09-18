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
        <section className="bg-aqua-light border-b border-line py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-ink mb-2 tracking-tight">Contact</h1>
            <p className="text-sub">Neem contact met ons op</p>
          </div>
        </section>

        {/* Content */}
        {page && (
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div
                className="text-ink/80 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </section>
        )}

        {/* Contact Info & Form */}
        <section className="py-12 px-6 bg-white border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold text-ink mb-8">Contactgegevens</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-sub font-medium mb-1">ADRES</p>
                    <p className="text-ink">
                      Groeneweg 58<br />
                      3911 PG Rhenen<br />
                      Nederland
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-sub font-medium mb-1">EMAIL</p>
                    <a href="mailto:secretaris@zvdbs.nl" className="text-aqua hover:text-aqua-dark">
                      secretaris@zvdbs.nl
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-sub font-medium mb-1">TELEFOON</p>
                    <p className="text-ink">Contact via email of social media</p>
                  </div>
                  <div>
                    <p className="text-sm text-sub font-medium mb-2">VOLG ONS</p>
                    <div className="flex gap-4">
                      <a
                        href="https://facebook.com/zvdbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sub hover:text-aqua"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://instagram.com/zvdbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sub hover:text-aqua"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-ink mb-8">Stuur ons een bericht</h2>
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
