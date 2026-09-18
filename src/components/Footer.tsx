import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-ink mb-4">Over ons</h3>
            <div className="text-sm space-y-2 text-sub">
              <p>Groeneweg 58</p>
              <p>3911 PG Rhenen</p>
              <p className="mt-4">
                <a href="mailto:info@zvdbs.nl" className="hover:text-coral">
                  info@zvdbs.nl
                </a>
              </p>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-ink mb-4">Informatie</h3>
            <ul className="text-sm space-y-2 text-sub">
              <li>
                <Link href="/informatie?tab=wie" className="hover:text-coral">
                  Wie zijn wij?
                </Link>
              </li>
              <li>
                <Link href="/informatie?tab=historie" className="hover:text-coral">
                  Historie
                </Link>
              </li>
              <li>
                <Link href="/informatie?tab=privacy" className="hover:text-coral">
                  Privacyverklaring
                </Link>
              </li>
              <li>
                <Link href="/informatie?tab=preventief" className="hover:text-coral">
                  Preventief beleid
                </Link>
              </li>
              <li>
                <Link href="/pages/adres_en_route" className="hover:text-coral">
                  Adres & Route
                </Link>
              </li>
            </ul>
          </div>

          {/* Wedstrijden */}
          <div>
            <h3 className="font-semibold text-ink mb-4">Wedstrijden</h3>
            <ul className="text-sm space-y-2 text-sub">
              <li>
                <Link href="/statistieken" className="hover:text-coral">
                  Records &amp; statistieken
                </Link>
              </li>
              <li>
                <Link href="/pages/activiteitenkalender" className="hover:text-coral">
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/pages/competitie" className="hover:text-coral">
                  Competitie Info
                </Link>
              </li>
              <li>
                <Link href="/pages/wedstrijdzwemmen" className="hover:text-coral">
                  Wedstrijdzwemmen
                </Link>
              </li>
            </ul>
          </div>

          {/* Volg ons */}
          <div>
            <h3 className="font-semibold text-ink mb-4">Volg ons</h3>
            <ul className="text-sm space-y-2 text-sub">
              <li>
                <a href="https://facebook.com/zvdbs" target="_blank" rel="noopener noreferrer" className="hover:text-coral">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com/zvdbs" target="_blank" rel="noopener noreferrer" className="hover:text-coral">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* More pages dropdown info */}
        <div className="border-t border-line pt-8 pb-4 text-sm text-sub">
          <p className="mb-2">
            <strong className="text-ink">Alle pagina&apos;s:</strong> Bekijk meer pagina&apos;s op{' '}
            <Link href="/pages/clubkleding" className="text-teal hover:text-coral">
              Clubkleding
            </Link>
            ,{' '}
            <Link href="/proefzwemmen" className="text-teal hover:text-coral">
              Proefzwemmen
            </Link>
            ,{' '}
            <Link href="/pages/hall-of-fame" className="text-teal hover:text-coral">
              Hall of Fame
            </Link>
            {' '}en meer...
          </p>
        </div>

        <div className="border-t border-line pt-8 text-center text-sm text-sub">
          <p>© 2026 Zwemvereniging de Blauwe Schuur</p>
        </div>
      </div>
    </footer>
  );
}
