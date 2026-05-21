// B+ — Soft modernist, pushed.
// Rebranded as "Talkin' Deutsch" — fonts + accent palette now match the website
// (Instrument Serif display, website navy + primary blue).

const Bp = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  ink: '#0A0E1A',         // near-black with a touch of navy
  inkSoft: '#525866',
  inkMute: '#9098A4',
  hair: '#ECEEF1',
  hairDark: 'rgba(255,255,255,0.14)',

  // Brand surfaces (from website)
  brandNavy: '#03045E',   // deep navy — used for primary dark surfaces / CTAs
  brandBlue: '#0077B6',   // primary blue — accents
  brandSky:  '#00B4D8',   // sage/sky — secondary accent, hairlines

  // Monochrome blue scale. Each theme is a deeper step — which mirrors the
  // narrative arc (first contact → deep connection) and stays inside the
  // website's blue palette (sky → primary → deep → navy).
  t1: '#0096C7',  // sky-blue       (Erster Kontakt)
  t1Deep: '#0077B6',
  t1Soft: '#CAEAF5',

  t2: '#0077B6',  // primary blue   (Wiederkehrende Begegnungen)
  t2Deep: '#023E8A',
  t2Soft: '#BBD4EA',

  t3: '#023E8A',  // deep blue      (Aktive Teilhabe)
  t3Deep: '#03045E',
  t3Soft: '#C5D0E5',

  t4: '#03045E',  // brand navy     (Tiefe Verbindungen)
  t4Deep: '#000033',
  t4Soft: '#D5DAE8',

  // Type stack — Instrument Serif display, Inter body (matches website).
  display: '"Instrument Serif", "Times New Roman", Georgia, serif',
  body: 'Inter, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
};

// One <BpSheet/> per screen — idempotent because <style> is rendered into the
// shadow DOM of the iOS frame. The .bp-frame class scopes everything.
const BpSheet = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    .bp-frame, .bp-frame * { box-sizing: border-box; }
    .bp-frame {
      font-family: ${Bp.body};
      color: ${Bp.ink};
      background: ${Bp.bg};
      height: 100%;
      overflow-y: auto;
      -webkit-font-smoothing: antialiased;
      letter-spacing: -0.01em;
      position: relative;
    }
    .bp-frame::-webkit-scrollbar { display: none; }
    .bp-display {
      font-family: ${Bp.display};
      font-weight: 400;
      letter-spacing: -0.005em;
    }
    .bp-display em, .bp-italic {
      font-family: ${Bp.display};
      font-style: italic;
      font-weight: 400;
    }
    .bp-mono {
      font-family: ${Bp.mono};
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    /* Ring animation on mount */
    @keyframes bp-ring-fill {
      from { stroke-dashoffset: var(--bp-ring-empty); }
      to   { stroke-dashoffset: var(--bp-ring-target); }
    }
    .bp-ring-anim {
      animation: bp-ring-fill 900ms cubic-bezier(.2,.7,.3,1) both;
      animation-delay: var(--bp-ring-delay, 200ms);
    }

    /* Bar fill */
    @keyframes bp-bar-fill {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    .bp-bar-anim {
      transform-origin: left;
      animation: bp-bar-fill 600ms cubic-bezier(.3,.7,.3,1) both;
      animation-delay: var(--bp-bar-delay, 100ms);
    }

    /* Slide-up entry for cards */
    @keyframes bp-rise {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .bp-rise { animation: bp-rise 500ms cubic-bezier(.2,.7,.3,1) both; }

    /* Checkmark celebration burst */
    @keyframes bp-burst {
      0%   { transform: scale(0.4); opacity: 0; }
      55%  { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1.0); opacity: 1; }
    }
    .bp-burst { animation: bp-burst 600ms cubic-bezier(.3,1.6,.4,1) both; }

    @keyframes bp-radiate {
      from { transform: scale(0.4); opacity: 0.7; }
      to   { transform: scale(2.8); opacity: 0; }
    }
    .bp-radiate { animation: bp-radiate 900ms cubic-bezier(.2,.7,.3,1) both; }

    @keyframes bp-confetti-up {
      0%   { transform: translate(0,0) rotate(0); opacity: 0; }
      20%  { opacity: 1; }
      100% { transform: translate(var(--cx), var(--cy)) rotate(var(--cr)); opacity: 0; }
    }
    .bp-confetti { animation: bp-confetti-up 1100ms cubic-bezier(.2,.6,.4,1) forwards; }

    /* Theme wash — full-screen color wipe between themes */
    @keyframes bp-wash {
      0%   { transform: translateY(100%); }
      40%  { transform: translateY(0); }
      60%  { transform: translateY(0); }
      100% { transform: translateY(-100%); }
    }
    .bp-wash { animation: bp-wash 1000ms cubic-bezier(.7,0,.3,1) both; }

    /* Tab press */
    .bp-tap { transition: transform 120ms cubic-bezier(.2,.7,.3,1); }
    .bp-tap:active { transform: scale(0.97); }

    /* Hide focus rings inside the prototype */
    .bp-frame button { outline: none; -webkit-tap-highlight-color: transparent; }
  `}</style>
);

// Reusable progress ring with mount-fill animation
function BpRing({ size = 56, stroke = 5, percent, color, delay = 200, animate = true }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const target = c * (1 - percent / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
      <circle cx={size/2} cy={size/2} r={r} stroke={Bp.hair} strokeWidth={stroke} fill="none"/>
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c}
        strokeDashoffset={animate ? c : target}
        strokeLinecap="round"
        className={animate ? 'bp-ring-anim' : ''}
        style={{
          '--bp-ring-empty': c,
          '--bp-ring-target': target,
          '--bp-ring-delay': `${delay}ms`,
        }}
      />
    </svg>
  );
}

// Wordmark — "Talkin' Deutsch", echoing the website's brand lockup
// (Instrument Serif, italic + accent dot). Decoupled from the "4 themes"
// concept — just a single brand dot ahead of the wordmark, like the site nav.
function BpWordmark({ size = 22, color = Bp.ink, withText = true, accent = Bp.brandBlue }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        width: size * 0.36, height: size * 0.36, borderRadius: '50%',
        background: accent, display: 'inline-block', flexShrink: 0,
        transform: 'translateY(-2px)',
      }}/>
      {withText && (
        <span className="bp-display" style={{
          fontSize: size, color, lineHeight: 1, letterSpacing: '-0.005em',
          whiteSpace: 'nowrap',
        }}>
          Talkin&rsquo;<span style={{ fontStyle: 'italic' }}> Deutsch</span>
        </span>
      )}
    </div>
  );
}

// Wash overlay — used by the prototype when switching themes
function BpThemeWash({ color, keyId }) {
  if (!color) return null;
  return (
    <div key={keyId} className="bp-wash" style={{
      position: 'absolute', inset: 0, background: color, zIndex: 50,
      pointerEvents: 'none',
    }}/>
  );
}

Object.assign(window, { Bp, BpSheet, BpRing, BpWordmark, BpThemeWash });
