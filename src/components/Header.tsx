'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/membership', label: 'Lidmaatschap' },
  { href: '/informatie', label: 'Informatie' },
  { href: '/news', label: 'Nieuws' },
  { href: '/statistieken', label: 'Records & statistieken' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-cream/90 backdrop-blur border-b border-line sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setMenuOpen(false)}>
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
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden p-2 text-sub hover:text-ink"
            aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {menuOpen && (
          <nav id="mobile-menu" className="md:hidden mt-4 pb-2 flex flex-col gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-2.5 rounded-lg text-ink hover:bg-coral-light hover:text-coral"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
