import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DBS</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:inline">ZVDBS</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="text-gray-900 hover:text-blue-900 font-medium">
              Home
            </Link>
            <Link href="/membership" className="text-gray-600 hover:text-gray-900">
              Lidmaatschap
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              Over ons
            </Link>
            <Link href="/policies" className="text-gray-600 hover:text-gray-900">
              Beleid
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-gray-900">
              Nieuws
            </Link>
	    <Link href="/clubrecords" className="text-gray-600 hover:text-gray-900">
  	      Clubrecords
	    </Link>
            <Link href="/statistieken" className="text-gray-600 hover:text-gray-900">
              Statistieken
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
