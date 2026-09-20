import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-line dark:bg-night-bg dark:border-night-line">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-ink mb-4 dark:text-night-ink">Over ons</h3>
            <div className="text-sm space-y-2 text-sub dark:text-night-sub">
              <p>Groeneweg 58</p>
              <p>3911 PG Rhenen</p>
              <p className="mt-4">
                <a href="mailto:info@zvdbs.nl" className="hover:text-aqua dark:hover:text-night-cyan">
                  info@zvdbs.nl
                </a>
              </p>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-ink mb-4 dark:text-night-ink">Informatie</h3>
            <ul className="text-sm space-y-2 text-sub dark:text-night-sub">
              <li>
                <Link href="/informatie?tab=wie" className="hover:text-aqua dark:hover:text-night-cyan">
                  Wie zijn wij?
                </Link>
              </li>
              <li>
                <Link href="/informatie?tab=historie" className="hover:text-aqua dark:hover:text-night-cyan">
                  Historie
                </Link>
              </li>
              <li>
                <Link href="/informatie?tab=privacy" className="hover:text-aqua dark:hover:text-night-cyan">
                  Privacyverklaring
                </Link>
              </li>
              <li>
                <Link href="/informatie?tab=preventief" className="hover:text-aqua dark:hover:text-night-cyan">
                  Preventief beleid
                </Link>
              </li>
              <li>
                <Link href="/pages/adres_en_route" className="hover:text-aqua dark:hover:text-night-cyan">
                  Adres & Route
                </Link>
              </li>
            </ul>
          </div>

          {/* Wedstrijden */}
          <div>
            <h3 className="font-semibold text-ink mb-4 dark:text-night-ink">Wedstrijden</h3>
            <ul className="text-sm space-y-2 text-sub dark:text-night-sub">
              <li>
                <Link href="/statistieken" className="hover:text-aqua dark:hover:text-night-cyan">
                  Records &amp; statistieken
                </Link>
              </li>
              <li>
                <Link href="/pages/activiteitenkalender" className="hover:text-aqua dark:hover:text-night-cyan">
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/pages/competitie" className="hover:text-aqua dark:hover:text-night-cyan">
                  Competitie Info
                </Link>
              </li>
              <li>
                <Link href="/pages/wedstrijdzwemmen" className="hover:text-aqua dark:hover:text-night-cyan">
                  Wedstrijdzwemmen
                </Link>
              </li>
            </ul>
          </div>

          {/* Volg ons */}
          <div>
            <h3 className="font-semibold text-ink mb-4 dark:text-night-ink">Volg ons</h3>
            <ul className="text-sm space-y-2 text-sub dark:text-night-sub">
              <li>
                <a href="https://facebook.com/zvdbs" target="_blank" rel="noopener noreferrer" className="hover:text-aqua dark:hover:text-night-cyan">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com/zvdbs" target="_blank" rel="noopener noreferrer" className="hover:text-aqua dark:hover:text-night-cyan">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* More pages dropdown info */}
        <div className="border-t border-line pt-8 pb-4 text-sm text-sub dark:border-night-line dark:text-night-sub">
          <p className="mb-2">
            <strong className="text-ink dark:text-night-ink">Alle pagina&apos;s:</strong> Bekijk meer pagina&apos;s op{' '}
            <Link href="/pages/clubkleding" className="text-aqua hover:text-aqua dark:text-night-cyan dark:hover:text-night-cyan">
              Clubkleding
            </Link>
            ,{' '}
            <Link href="/proefzwemmen" className="text-aqua hover:text-aqua dark:text-night-cyan dark:hover:text-night-cyan">
              Proefzwemmen
            </Link>
            ,{' '}
            <Link href="/pages/hall-of-fame" className="text-aqua hover:text-aqua dark:text-night-cyan dark:hover:text-night-cyan">
              Hall of Fame
            </Link>
            {' '}en meer...
          </p>
        </div>

        <div className="border-t border-line pt-8 text-center text-sm text-sub dark:border-night-line dark:text-night-sub">
          <p>© 2026 Zwemvereniging de Blauwe Schuur</p>
        </div>
      </div>
    </footer>
  );
}
