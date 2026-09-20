'use client';

import { useEffect, useState } from 'react';

/**
 * Schakelaar tussen licht en donker thema. De daadwerkelijke 'dark' class op
 * <html> wordt al vóór hydration gezet door het inline script in layout.tsx
 * (voorkomt een flits van het verkeerde thema); deze knop leest die class bij
 * het laden uit en houdt 'm daarna in sync, inclusief opslag in localStorage.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // localStorage kan geblokkeerd zijn; thema werkt dan alleen voor deze sessie.
    }
  }

  // Voorkomt een mismatch tussen server- en client-render: vóór mount
  // renderen we een neutrale knop-placeholder zonder toestand.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Thema wisselen"
        className="p-2 rounded-lg text-sub hover:text-ink dark:text-night-sub dark:hover:text-night-ink"
      >
        <span className="block w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
      className="p-2 rounded-lg text-sub hover:text-ink hover:bg-aqua-light dark:text-night-sub dark:hover:text-night-ink dark:hover:bg-white/5 transition-colors"
    >
      {isDark ? (
        // Zon-icoon (klik om naar licht te schakelen)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.364-6.364l-1.06 1.06M6.697 17.303l-1.06 1.06m0-12.728l1.06 1.06M17.303 17.303l1.06 1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
          />
        </svg>
      ) : (
        // Maan-icoon (klik om naar donker te schakelen)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  );
}
