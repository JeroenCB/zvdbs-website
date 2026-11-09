'use client';

/*
 * Kerst-overlay: puur decoratieve laag over de hele site.
 *
 * - Gaat vanzelf aan en uit op datum (zie START en EINDE). De datum wordt in de browser
 *   gecontroleerd, niet tijdens de build: anders blijft de overlay staan tot de volgende deploy.
 * - Raakt geen bestaande pagina's of componenten aan; alleen ingeladen in layout.tsx.
 * - pointer-events: none  -> klikken gaan altijd door naar de site eronder.
 * - aria-hidden            -> schermlezers slaan het over.
 * - prefers-reduced-motion -> geen vallende sneeuw, knipperende lampjes of sneeuwballen.
 * - Werkt in licht en donker thema (html.dark).
 * - De lichtslinger meet de hoogte van de menubalk (<header>) en hangt half in, half eronder.
 *
 * Klikeffect (sneeuwbal): zie KerstSneeuwballen.tsx.
 */

import { useEffect, useState } from 'react';
import KerstSneeuwballen from './KerstSneeuwballen';

// Periode waarin de overlay aanstaat (maand 1-12, beide dagen inclusief).
// Let op: werkt alleen voor een periode binnen één kalenderjaar.
const START = { maand: 11, dag: 1 };
const EINDE = { maand: 12, dag: 28 };

function inPeriode(d: Date) {
  const vandaag = (d.getMonth() + 1) * 100 + d.getDate();
  return vandaag >= START.maand * 100 + START.dag && vandaag <= EINDE.maand * 100 + EINDE.dag;
}

// Vaste (niet-willekeurige) sneeuwvlokken, zodat elke pagina hetzelfde rustige patroon heeft.
const VLOKKEN = Array.from({ length: 20 }, (_, j) => ({
  left: ((j * 37) % 97) + 1,
  size: 4 + ((j * 7) % 5),
  dur: 10 + ((j * 5) % 9),
  delay: -((j * 3.3) % 16),
  op: 0.55 + ((j * 13) % 5) / 10,
}));

function draad(aantal: number) {
  const seg = 1000 / aantal;
  let d = 'M0 2';
  for (let i = 0; i < aantal; i++) {
    d += ` Q${((i + 0.5) * seg).toFixed(1)} 34 ${((i + 1) * seg).toFixed(1)} 2`;
  }
  return d;
}

const css = `
.kb-overlay{position:fixed;inset:0;z-index:60;pointer-events:none;overflow:hidden}
.kb-overlay svg{display:block}

.kb-vlok{position:absolute;top:-12px;border-radius:50%;background:#7DD3FC;animation:kb-val linear infinite}
html.dark .kb-vlok{background:#FFFFFF}
@keyframes kb-val{0%{transform:translate(0,0)}50%{transform:translate(14px,55vh)}100%{transform:translate(0,110vh)}}

.kb-draad{position:absolute;left:0;width:100%;height:28px}
.kb-draad path{fill:none;stroke:#334155;stroke-width:1.2}
html.dark .kb-draad path{stroke:#64748B}
.kb-lamp{position:absolute;width:9px;height:13px;margin-left:-4.5px;border-radius:50% 50% 45% 45%;background:currentColor;box-shadow:0 0 10px currentColor;animation:kb-knip 2.4s ease-in-out infinite}
.kb-lamp--0{color:#DC2626}.kb-lamp--1{color:#16A34A;animation-delay:.6s}.kb-lamp--2{color:#F59E0B;animation-delay:1.2s}.kb-lamp--3{color:#2563EB;animation-delay:1.8s}
html.dark .kb-lamp--0{color:#F87171}html.dark .kb-lamp--1{color:#4ADE80}html.dark .kb-lamp--2{color:#FCD34D}html.dark .kb-lamp--3{color:#60A5FA}
@keyframes kb-knip{0%,100%{opacity:1}50%{opacity:.4}}

.kb-sneeuwrand{position:absolute;left:0;bottom:0;width:100%;height:16px}
.kb-sneeuwrand path{fill:#E0F2FE}
html.dark .kb-sneeuwrand path{fill:#E2E8F0}

.kb-boom{position:absolute;right:16px;bottom:6px;width:120px}
.kb-boom--klein{display:none;right:10px;bottom:4px;width:44px}

/* Sneeuwbal (klikeffect) */
.kb-bal{position:absolute;left:0;top:0;width:24px;height:24px;border-radius:50%;
  background:radial-gradient(circle at 68% 64%,rgba(148,163,184,.55) 0 8%,transparent 9%),
             radial-gradient(circle at 30% 70%,rgba(148,163,184,.4) 0 6%,transparent 7%),
             radial-gradient(circle at 35% 30%,#FFFFFF 0%,#F8FAFC 35%,#CBD5E1 75%,#94A3B8 100%);
  box-shadow:0 4px 10px rgba(15,23,42,.25);will-change:transform}
.kb-spat{position:absolute;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50% 45% 55% 48%;
  background:radial-gradient(circle,#FFFFFF 0 45%,rgba(241,245,249,.9) 60%,rgba(226,232,240,0) 72%);
  filter:drop-shadow(0 1px 1px rgba(100,116,139,.45))}
.kb-kruimel{position:absolute;left:0;top:0;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;
  background:#FFFFFF;box-shadow:0 0 0 1px rgba(148,163,184,.55)}

@media (max-width:640px){
  .kb-vlok:nth-child(n+13){display:none}
  .kb-lamp{width:7px;height:10px;margin-left:-3.5px}
  .kb-sneeuwrand,.kb-boom{display:none}
  .kb-boom--klein{display:block}
}
@media (prefers-reduced-motion:reduce){
  .kb-vlok,.kb-bal,.kb-spat,.kb-kruimel{display:none}
  .kb-lamp{animation:none}
}
@media print{.kb-overlay{display:none}}
`;

export default function KerstOverlay() {
  const [actief, setActief] = useState(false);
  const [headerHoogte, setHeaderHoogte] = useState(68);
  const [lampjes, setLampjes] = useState(22);

  // Datum pas in de browser bepalen (na het laden), anders verschilt server en browser.
  useEffect(() => {
    setActief(inPeriode(new Date()));
  }, []);

  useEffect(() => {
    if (!actief) return;
    const header = document.querySelector('header');
    const meet = () => {
      if (header) setHeaderHoogte(Math.round(header.getBoundingClientRect().height));
      setLampjes(window.innerWidth < 640 ? 10 : 22);
    };
    meet();
    const ro = header ? new ResizeObserver(meet) : null;
    if (header && ro) ro.observe(header);
    window.addEventListener('resize', meet);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', meet);
    };
  }, [actief]);

  if (!actief) return null;

  return (
    <div className="kb-overlay" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Vallende sneeuw */}
      <div>
        {VLOKKEN.map((v, i) => (
          <div
            key={i}
            className="kb-vlok"
            style={{
              left: `${v.left}%`,
              width: v.size,
              height: v.size,
              animationDuration: `${v.dur}s`,
              animationDelay: `${v.delay}s`,
              opacity: v.op,
            }}
          />
        ))}
      </div>

      {/* Lichtslinger: draad in de menubalk, lampjes hangen eronder */}
      <svg
        className="kb-draad"
        style={{ top: headerHoogte - 12 }}
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
      >
        <path d={draad(lampjes)} vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: lampjes }, (_, i) => (
        <div
          key={i}
          className={`kb-lamp kb-lamp--${i % 4}`}
          style={{ left: `${((i + 0.5) / lampjes) * 100}%`, top: headerHoogte }}
        />
      ))}

      {/* Sneeuwrandje onderaan (alleen desktop) */}
      <svg className="kb-sneeuwrand" viewBox="0 0 1000 20" preserveAspectRatio="none">
        <path d="M0 10 Q40 2 80 9 T160 8 T240 10 T320 7 T400 10 T480 8 T560 10 T640 7 T720 10 T800 8 T880 10 T960 7 T1000 9 V20 H0Z" />
      </svg>

      {/* Kerstboompje met cadeautjes (desktop) */}
      <svg className="kb-boom" viewBox="0 0 120 90">
        <rect x="6" y="66" width="22" height="18" rx="2" fill="#DC2626" />
        <rect x="15" y="66" width="4" height="18" fill="#FDE68A" />
        <rect x="6" y="73" width="22" height="4" fill="#FDE68A" />
        <rect x="30" y="72" width="16" height="12" rx="2" fill="#2563EB" />
        <rect x="36" y="72" width="4" height="12" fill="#FFFFFF" />
        <Boom />
      </svg>

      {/* Klein boompje (mobiel) */}
      <svg className="kb-boom kb-boom--klein" viewBox="50 8 64 78">
        <Boom />
      </svg>

      <KerstSneeuwballen />
    </div>
  );
}

function Boom() {
  return (
    <>
      <rect x="78" y="74" width="8" height="10" fill="#78350F" />
      <path d="M82 22 L104 52 L60 52Z" fill="#166534" />
      <path d="M82 34 L108 66 L56 66Z" fill="#15803D" />
      <path d="M82 48 L112 78 L52 78Z" fill="#166534" />
      <path d="M82 10 L84.5 17 L92 17 L86 21.5 L88 29 L82 24.5 L76 29 L78 21.5 L72 17 L79.5 17Z" fill="#F59E0B" />
      <circle cx="74" cy="48" r="2.6" fill="#DC2626" />
      <circle cx="90" cy="58" r="2.6" fill="#F59E0B" />
      <circle cx="70" cy="70" r="2.6" fill="#2563EB" />
      <circle cx="96" cy="72" r="2.6" fill="#DC2626" />
      <circle cx="84" cy="40" r="2.2" fill="#FFFFFF" />
    </>
  );
}
