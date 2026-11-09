'use client';

/*
 * Onderdeel van de kerst-overlay: een klik op een "lege" plek gooit een sneeuwbal.
 * De bal komt groot van onderen in beeld (alsof je hem zelf gooit), vliegt in een boog
 * naar de klikplek en wordt daarbij kleiner (diepte), en spat daar uiteen.
 *
 * Geen sneeuwbal bij klikken op links, knoppen, formuliervelden, video's (iframes) of bij
 * tekst selecteren. Max. 6 worpen tegelijk; alles ruimt zichzelf op.
 * Uit voor wie "minder beweging" heeft ingesteld.
 * Opmaak (.kb-bal, .kb-spat, .kb-kruimel) staat in KerstOverlay.tsx.
 */

import { useEffect, useRef } from 'react';

const INTERACTIEF =
  'a,button,input,select,textarea,label,summary,option,iframe,[role="button"],[role="link"],[contenteditable="true"]';
const MAX_WORPEN = 6;
const BAL = 24; // px, basisgrootte van .kb-bal

export default function KerstSneeuwballen() {
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

      if (typeof laag.animate !== 'function') return; // hele oude browsers: niets doen
      if (laag.childElementCount >= MAX_WORPEN) laag.firstElementChild?.remove();

      gooi(laag, e.clientX, e.clientY);
    }

    document.addEventListener('click', bijKlik);
    return () => document.removeEventListener('click', bijKlik);
  }, []);

  return <div ref={laagRef} />;
}

function gooi(laag: HTMLElement, doelX: number, doelY: number) {
  const breedte = window.innerWidth;
  const hoogte = window.innerHeight;

  const worp = document.createElement('div');
  laag.appendChild(worp);

  // Start: net onder het scherm, ongeveer in het midden (de "werper" staat voor het scherm).
  const startX = breedte / 2 + (Math.random() - 0.5) * breedte * 0.3;
  const startY = hoogte + 60;
  // Boog: het hoogste punt ligt boven de lijn tussen start en doel.
  const midX = (startX + doelX) / 2;
  const midY = Math.max(16, Math.min(startY, doelY) - (Math.abs(startY - doelY) * 0.3 + 60));

  const pos = (x: number, y: number, schaal: number, draai: number) =>
    `translate(${x - BAL / 2}px, ${y - BAL / 2}px) scale(${schaal}) rotate(${draai}deg)`;

  const bal = document.createElement('div');
  bal.className = 'kb-bal';
  worp.appendChild(bal);

  const vlucht = bal.animate(
    [
      { transform: pos(startX, startY, 3.4, 0) },
      { transform: pos(midX, midY, 1.7, 200), offset: 0.5 },
      { transform: pos(doelX, doelY, 0.9, 400) },
    ],
    { duration: 620, easing: 'cubic-bezier(.25,.1,.55,1)', fill: 'forwards' },
  );

  vlucht.onfinish = () => {
    bal.remove();
    spat(worp, doelX, doelY);
  };

  // Vangnet: worp altijd opruimen, ook als een animatie niet afloopt.
  window.setTimeout(() => worp.remove(), 2200);
}

function spat(worp: HTMLElement, x: number, y: number) {
  const vlek = document.createElement('div');
  vlek.className = 'kb-spat';
  worp.appendChild(vlek);
  vlek.animate(
    [
      { transform: `translate(${x}px, ${y}px) scale(.4)`, opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1, offset: 0.15 },
      { transform: `translate(${x}px, ${y}px) scale(1.05)`, opacity: 0.9, offset: 0.6 },
      { transform: `translate(${x}px, ${y + 6}px) scale(1.05)`, opacity: 0 },
    ],
    { duration: 1200, easing: 'ease-out', fill: 'forwards' },
  );

  for (let i = 0; i < 8; i++) {
    const hoek = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
    const afstand = 22 + Math.random() * 26;
    const dx = Math.cos(hoek) * afstand;
    const dy = Math.sin(hoek) * afstand;
    const kruimel = document.createElement('div');
    kruimel.className = 'kb-kruimel';
    worp.appendChild(kruimel);
    kruimel.animate(
      [
        { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 },
        { transform: `translate(${x + dx * 0.7}px, ${y + dy * 0.7 - 10}px) scale(.9)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${x + dx}px, ${y + dy + 28}px) scale(.5)`, opacity: 0 },
      ],
      { duration: 700 + Math.random() * 200, easing: 'ease-out', fill: 'forwards' },
    );
  }
}
