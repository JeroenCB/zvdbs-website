import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DBS</span>
            </div>
            <span className="font-semibold text-gray-900">ZVDBS</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 text-sm">
            <Link href="/" className="text-gray-900 hover:text-blue-900">
              Home
            </Link>
            <Link href="/nieuws" className="text-gray-600 hover:text-gray-900">
              Nieuws
            </Link>
            <Link href="/statistieken" className="text-gray-600 hover:text-gray-900">
              Statistieken
            </Link>
            <Link href="/lidmaatschap" className="text-gray-600 hover:text-gray-900">
              Lidmaatschap
            </Link>
            <Link href="/informatie" className="text-gray-600 hover:text-gray-900">
              Informatie
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
