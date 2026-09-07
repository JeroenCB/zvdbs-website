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
                <Link href="/informatie/wie" className="hover:text-white">
                  Wie zijn wij?
                </Link>
              </li>
              <li>
                <Link href="/informatie/geschiedenis" className="hover:text-white">
                  Historia
                </Link>
              </li>
              <li>
                <Link href="/informatie/privacy" className="hover:text-white">
                  Privacyverklaring
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
                <Link href="/agenda" className="hover:text-white">
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/competitie" className="hover:text-white">
                  Competitie Info
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

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 Zwemvereniging de Blauwe Schuur</p>
        </div>
      </div>
    </footer>
  );
}
