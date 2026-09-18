import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-cream/90 backdrop-blur border-b border-line sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DBS</span>
            </div>
            <span className="font-semibold text-ink hidden sm:inline">ZVDBS</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="text-ink hover:text-coral font-medium">
              Home
            </Link>
            <Link href="/membership" className="text-sub hover:text-coral">
              Lidmaatschap
            </Link>
            <Link href="/informatie" className="text-sub hover:text-coral">
              Informatie
            </Link>
            <Link href="/news" className="text-sub hover:text-coral">
              Nieuws
            </Link>
            <Link href="/statistieken" className="text-sub hover:text-coral">
              Records &amp; statistieken
            </Link>
            <Link href="/contact" className="text-sub hover:text-coral">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-sub hover:text-ink">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
