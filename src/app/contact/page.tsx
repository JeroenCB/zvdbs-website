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
        <section className="bg-aqua-light border-b border-line py-12 px-6 dark:bg-night-bg dark:border-night-line">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-ink mb-2 tracking-tight dark:text-night-ink">Contact</h1>
            <p className="text-sub dark:text-night-sub">Neem contact met ons op</p>
          </div>
        </section>

        {/* Content */}
        {page && (
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div
                className="text-ink/80 leading-relaxed space-y-6 dark:text-night-ink/80"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </section>
        )}

        {/* Contact Info & Form */}
        <section className="py-12 px-6 bg-white border-t border-line dark:bg-night-bg dark:border-night-line">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold text-ink mb-8 dark:text-night-ink">Contactgegevens</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-sub font-medium mb-1 dark:text-night-sub">ADRES</p>
                    <p className="text-ink dark:text-night-ink">
                      Groeneweg 58<br />
                      3911 PG Rhenen<br />
                      Nederland
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-sub font-medium mb-1 dark:text-night-sub">EMAIL</p>
                    <a href="mailto:secretaris@zvdbs.nl" className="text-aqua hover:text-aqua-dark dark:text-night-cyan dark:hover:text-night-violet">
                      secretaris@zvdbs.nl
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-sub font-medium mb-1 dark:text-night-sub">TELEFOON</p>
                    <p className="text-ink dark:text-night-ink">Contact via email of social media</p>
                  </div>
                  <div>
                    <p className="text-sm text-sub font-medium mb-2 dark:text-night-sub">VOLG ONS</p>
                    <div className="flex gap-4">
                      <a
                        href="https://facebook.com/zvdbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sub hover:text-aqua dark:text-night-sub dark:hover:text-night-cyan"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://instagram.com/zvdbs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sub hover:text-aqua dark:text-night-sub dark:hover:text-night-cyan"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-ink mb-8 dark:text-night-ink">Stuur ons een bericht</h2>
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
