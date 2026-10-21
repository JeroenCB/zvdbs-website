/*
 * Halloween-overlay: puur decoratieve laag over de hele site.
 *
 * - Raakt geen bestaande pagina's of componenten aan; alleen ingeladen in layout.tsx.
 * - pointer-events: none  -> klikken gaan altijd door naar de site eronder.
 * - aria-hidden            -> schermlezers slaan het over.
 * - prefers-reduced-motion -> geen bewegende onderdelen voor wie dat heeft ingesteld.
 * - Werkt in licht en donker thema (html.dark).
 *
 * Uitzetten na Halloween: zet HALLOWEEN_AAN op false (of haal de regel uit layout.tsx).
 */

import HalloweenKlikVleermuizen from './HalloweenKlikVleermuizen';

const HALLOWEEN_AAN = true;

const BAT_PATH =
  'M0 8 Q5 0 10 5 Q12 1 14 5 Q16 1 18 5 Q23 0 28 8 Q22 6 18 11 Q14 8 10 11 Q6 6 0 8Z';

const css = `
.hw-overlay{position:fixed;inset:0;z-index:60;pointer-events:none;overflow:hidden}
.hw-overlay svg{display:block}
.hw-web{position:absolute;top:0;width:150px;height:150px;opacity:.55}
.hw-web--links{left:0;transform:scaleX(-1)}
.hw-web--rechts{right:0}
.hw-web path{stroke:#C2410C;stroke-width:.6;fill:none}
html.dark .hw-web path{stroke:#FDBA74}

.hw-spider{position:absolute;top:0;right:96px;width:22px;animation:hw-zak 6s ease-in-out infinite}
.hw-spider .hw-draad{stroke:#475569;stroke-width:.6}
.hw-spider .hw-lijf{fill:#1E1B2E}
.hw-spider .hw-poot{stroke:#1E1B2E;stroke-width:1}
html.dark .hw-spider .hw-draad{stroke:#94A3B8}
html.dark .hw-spider .hw-lijf{fill:#C4B5FD}
html.dark .hw-spider .hw-poot{stroke:#C4B5FD}

.hw-pompoen{position:absolute;left:16px;bottom:12px;width:64px}

.hw-bat{position:absolute;left:0;width:44px;animation:hw-vlieg linear infinite}
.hw-bat > div{animation:hw-golf 3s ease-in-out infinite}
.hw-bat svg{animation:hw-flap .35s ease-in-out infinite alternate;transform-origin:50% 60%}
.hw-bat path{fill:#1E1B2E}
html.dark .hw-bat path{fill:#C4B5FD}
.hw-bat--1{top:18%;animation-duration:22s;animation-delay:-4s}
.hw-bat--2{top:42%;width:30px;animation-duration:30s;animation-delay:-17s;opacity:.8}
.hw-bat--3{top:66%;width:36px;animation-duration:38s;animation-delay:-28s;opacity:.7}

.hw-klik{position:absolute;width:32px;margin:-7px 0 0 -16px;animation:hw-weg 1.4s ease-out forwards}
.hw-klik svg{animation:hw-flap .2s ease-in-out infinite alternate;transform-origin:50% 60%}
.hw-klik path{fill:#1E1B2E}
html.dark .hw-klik path{fill:#C4B5FD}
@keyframes hw-weg{0%{transform:translate(0,0) scale(.3);opacity:1}70%{opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1);opacity:0}}

@keyframes hw-vlieg{from{transform:translateX(-80px)}to{transform:translateX(calc(100vw + 80px))}}
@keyframes hw-golf{0%,100%{transform:translateY(0)}50%{transform:translateY(-24px)}}
@keyframes hw-flap{from{transform:scaleY(1)}to{transform:scaleY(.45)}}
@keyframes hw-zak{0%,100%{transform:translateY(-6px)}50%{transform:translateY(18px)}}

@media (max-width:640px){
  .hw-web{width:84px;height:84px;opacity:.45}
  .hw-spider{right:52px;width:16px}
  .hw-pompoen{width:40px;left:8px;bottom:8px;opacity:.85}
  .hw-bat--3{display:none}
}
@media (prefers-reduced-motion:reduce){
  .hw-bat,.hw-klik{display:none}
  .hw-spider{animation:none}
}
@media print{.hw-overlay{display:none}}
`;

function Web({ kant }: { kant: 'links' | 'rechts' }) {
  return (
    <svg className={`hw-web hw-web--${kant}`} viewBox="0 0 60 60">
      <path d="M60 0 L0 0 M60 0 L8 34 M60 0 L26 60 M60 0 L60 60" />
      <path d="M48 0 Q52 6 60 9 M36 0 Q42 12 60 18 M24 0 Q32 18 60 28 M12 0 Q22 26 60 40" />
      <path d="M47 0 Q50 8 51 14 Q54 20 60 22" />
    </svg>
  );
}

function Bat({ nr }: { nr: 1 | 2 | 3 }) {
  return (
    <div className={`hw-bat hw-bat--${nr}`}>
      <div>
        <svg viewBox="0 0 28 14">
          <path d={BAT_PATH} />
        </svg>
      </div>
    </div>
  );
}

export default function HalloweenOverlay() {
  if (!HALLOWEEN_AAN) return null;

  return (
    <div className="hw-overlay" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <Web kant="links" />
      <Web kant="rechts" />

      <svg className="hw-spider" viewBox="0 0 20 60">
        <path className="hw-draad" d="M10 0 V42" />
        <ellipse className="hw-lijf" cx="10" cy="47" rx="5" ry="6" />
        <path
          className="hw-poot"
          d="M5 44 L0 40 M5 48 L0 50 M15 44 L20 40 M15 48 L20 50 M6 52 L2 57 M14 52 L18 57"
        />
      </svg>

      <svg className="hw-pompoen" viewBox="0 0 64 60">
        <path d="M30 10 C30 4 34 2 37 1" stroke="#4D7C0F" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="20" cy="36" rx="14" ry="20" fill="#EA580C" />
        <ellipse cx="44" cy="36" rx="14" ry="20" fill="#EA580C" />
        <ellipse cx="32" cy="36" rx="14" ry="22" fill="#F97316" />
        <path d="M22 30 L27 35 L20 36Z M42 30 L37 35 L44 36Z" fill="#431407" />
        <path d="M21 44 Q32 52 43 44 Q38 48 35 46 L32 49 L29 46 Q26 48 21 44Z" fill="#431407" />
      </svg>

      <Bat nr={1} />
      <Bat nr={2} />
      <Bat nr={3} />

      <HalloweenKlikVleermuizen batPath={BAT_PATH} />
    </div>
  );
}
