import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-white mb-4">Over ons</h3>
            <div className="text-sm space-y-2">
              <p>Groeneweg 58</p>
              <p>3911 PG Rhenen</p>
              <p className="mt-4">
                <a href="mailto:info@zvdbs.nl" className="hover:text-white">
                  info@zvdbs.nl
                </a>
              </p>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Informatie</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/pages/wie" className="hover:text-white">
                  Wie zijn wij?
                </Link>
              </li>
              <li>
                <Link href="/pages/historie" className="hover:text-white">
                  Historia
                </Link>
              </li>
              <li>
                <Link href="/pages/privacy" className="hover:text-white">
                  Privacyverklaring
                </Link>
              </li>
              <li>
                <Link href="/pages/preventief" className="hover:text-white">
                  Preventief beleid
                </Link>
              </li>
              <li>
                <Link href="/pages/adres_en_route" className="hover:text-white">
                  Adres & Route
                </Link>
              </li>
            </ul>
          </div>

          {/* Wedstrijden */}
          <div>
            <h3 className="font-semibold text-white mb-4">Wedstrijden</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/statistieken" className="hover:text-white">
                  Statistieken
                </Link>
              </li>
              <li>
                <Link href="/pages/activiteitenkalender" className="hover:text-white">
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/pages/competitie" className="hover:text-white">
                  Competitie Info
                </Link>
              </li>
              <li>
                <Link href="/pages/wedstrijdzwemmen" className="hover:text-white">
                  Wedstrijdzwemmen
                </Link>
              </li>
            </ul>
          </div>

          {/* Volg ons */}
          <div>
            <h3 className="font-semibold text-white mb-4">Volg ons</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="https://facebook.com/zvdbs" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com/zvdbs" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* More pages dropdown info */}
        <div className="border-t border-gray-800 pt-8 pb-4 text-sm text-gray-400">
          <p className="mb-2">
            <strong>Alle pagina's:</strong> Bekijk meer pagina's op{' '}
            <Link href="/pages/clubkleding" className="text-blue-300 hover:text-white">
              Clubkleding
            </Link>
            ,{' '}
            <Link href="/pages/proef-zwemmen" className="text-blue-300 hover:text-white">
              Proefzwemmen
            </Link>
            ,{' '}
            <Link href="/pages/hall-of-fame" className="text-blue-300 hover:text-white">
              Hall of Fame
            </Link>
            {' '}en meer...
          </p>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 Zwemvereniging de Blauwe Schuur</p>
        </div>
      </div>
    </footer>
  );
}
