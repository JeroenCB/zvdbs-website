'use client';

/*
 * Onderdeel van de Halloween-overlay: een klik op een "lege" plek laat een vleermuisje wegvliegen.
 * Geen vleermuis bij klikken op links, knoppen, formuliervelden, video's (iframes) of bij tekst selecteren.
 * Max. 8 tegelijk; ze ruimen zichzelf op. Uit voor wie "minder beweging" heeft ingesteld.
 */

import { useEffect, useRef } from 'react';

const INTERACTIEF =
  'a,button,input,select,textarea,label,summary,option,iframe,[role="button"],[role="link"],[contenteditable="true"]';
const MAX_TEGELIJK = 8;

export default function HalloweenKlikVleermuizen({ batPath }: { batPath: string }) {
  const laagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const laag = laagRef.current;
    if (!laag) return;
    const minderBeweging = window.matchMedia('(prefers-reduced-motion: reduce)');

    function bijKlik(e: MouseEvent) {
      if (!laag || minderBeweging.matches) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const doel = e.target;
      if (!(doel instanceof Element) || doel.closest(INTERACTIEF)) return;

      const selectie = window.getSelection();
      if (selectie && !selectie.isCollapsed) return;

      if (laag.childElementCount >= MAX_TEGELIJK) laag.firstElementChild?.remove();

      // Willekeurige richting schuin omhoog (tussen -150 en -30 graden).
      const hoek = ((-150 + Math.random() * 120) * Math.PI) / 180;
      const afstand = 120 + Math.random() * 120;

      const bat = document.createElement('div');
      bat.className = 'hw-klik';
      bat.style.left = `${e.clientX}px`;
      bat.style.top = `${e.clientY}px`;
      bat.style.setProperty('--dx', `${Math.cos(hoek) * afstand}px`);
      bat.style.setProperty('--dy', `${Math.sin(hoek) * afstand}px`);
      bat.innerHTML = `<svg viewBox="0 0 28 14"><path d="${batPath}"/></svg>`;
      bat.addEventListener('animationend', (ev) => {
        if (ev.target === bat) bat.remove();
      });
      laag.appendChild(bat);
    }

    document.addEventListener('click', bijKlik);
    return () => document.removeEventListener('click', bijKlik);
  }, [batPath]);

  return <div ref={laagRef} />;
}
