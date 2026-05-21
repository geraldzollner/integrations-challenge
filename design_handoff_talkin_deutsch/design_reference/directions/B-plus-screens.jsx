// B+ screens — themed, color-rich, animated.
// Each screen accepts:
//   themeIdx: 0..3 (which theme is "current")
//   onNav(screen, payload): tap handler for prototype navigation
//   data: shared task/habit state
// Screens read theme color from THEMES[themeIdx].

const THEMES = [
  { num: 1, key: 't1', title: 'Erster Kontakt',           sub: 'Lächeln · grüßen · fragen',         color: Bp.t1, deep: Bp.t1Deep, soft: Bp.t1Soft },
  { num: 2, key: 't2', title: 'Wiederkehrende Begegnungen', sub: 'Bekannte Gesichter werden',       color: Bp.t2, deep: Bp.t2Deep, soft: Bp.t2Soft },
  { num: 3, key: 't3', title: 'Aktive Teilhabe',           sub: 'Mitgestalten · einbringen',         color: Bp.t3, deep: Bp.t3Deep, soft: Bp.t3Soft },
  { num: 4, key: 't4', title: 'Tiefe Verbindungen',        sub: 'Vertrauen · Heimat · Freundschaft', color: Bp.t4, deep: Bp.t4Deep, soft: Bp.t4Soft },
];

// ─── Welcome ──────────────────────────────────────────────────
function BpWelcome({ onNav = () => {} }) {
  return (
    <div className="bp-frame" style={{ padding: '60px 28px 28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BpSheet/>
      <div style={{ marginTop: 20, marginBottom: 36 }}>
        <BpWordmark size={22} color={Bp.ink}/>
      </div>

      {/* Hero mark — concentric arcs in the theme hues, brand-blue center.
          Decorative; no longer encodes a specific theme count. */}
      <div className="bp-rise" style={{ display: 'flex', justifyContent: 'center', marginTop: 6, marginBottom: 40 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <radialGradient id="bp-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor={Bp.brandSky} stopOpacity="0.28"/>
              <stop offset="60%" stopColor={Bp.brandSky} stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="90" cy="90" r="82" fill="url(#bp-glow)"/>
          <circle cx="90" cy="90" r="76" stroke={Bp.t4} strokeWidth="2.5" fill="none"
            strokeDasharray="430 1000" strokeLinecap="round" transform="rotate(-95 90 90)"/>
          <circle cx="90" cy="90" r="60" stroke={Bp.t3} strokeWidth="2.5" fill="none"
            strokeDasharray="320 1000" strokeLinecap="round" transform="rotate(-65 90 90)"/>
          <circle cx="90" cy="90" r="44" stroke={Bp.t2} strokeWidth="2.5" fill="none"
            strokeDasharray="225 1000" strokeLinecap="round" transform="rotate(-30 90 90)"/>
          <circle cx="90" cy="90" r="28" fill={Bp.brandNavy}/>
          <circle cx="90" cy="90" r="10" fill="#fff" opacity="0.92"/>
        </svg>
      </div>

      <h1 className="bp-display bp-rise" style={{ fontSize: 44, margin: '0 0 16px', lineHeight: 1.0, textAlign: 'center', animationDelay: '120ms', letterSpacing: '-0.01em' }}>
        Ankommen,<br/><span style={{ fontStyle: 'italic', color: Bp.brandBlue }}>Schritt für Schritt.</span>
      </h1>
      <p className="bp-rise" style={{ fontSize: 15, lineHeight: 1.55, color: Bp.inkSoft, textAlign: 'center', margin: '0 8px', animationDelay: '220ms' }}>
        Vom ersten Hallo bis zur echten Freundschaft.<br/>
        In kleinen, machbaren Schritten.
      </p>

      <div style={{ flex: 1 }}/>

      <div className="bp-rise" style={{ animationDelay: '320ms' }}>
        <button
          onClick={() => onNav('overview')}
          className="bp-tap"
          style={{ width: '100%', padding: '16px', background: Bp.brandNavy, color: '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: -0.1 }}>
          Loslegen
        </button>
        <button
          onClick={() => onNav('overview')}
          className="bp-tap"
          style={{ width: '100%', padding: '14px', background: 'transparent', color: Bp.inkSoft, border: 'none', fontSize: 13, fontFamily: 'inherit', marginTop: 4, cursor: 'pointer' }}>
          Schon dabei? Anmelden
        </button>
      </div>
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────
function BpOverview({ themeIdx = 0, onNav = () => {}, data }) {
  const active = THEMES[themeIdx];
  const totalDone = data.themes.reduce((s, t) => s + t.done, 0);
  const totalAll = data.themes.reduce((s, t) => s + t.total, 0);

  return (
    <div className="bp-frame">
      <BpSheet/>

      {/* Themed full-bleed header — color washes the top of the screen */}
      <div style={{
        background: `linear-gradient(180deg, ${active.color} 0%, ${active.deep} 100%)`,
        padding: '54px 22px 32px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* big number set in the corner */}
        <div style={{ position: 'absolute', right: -10, bottom: -50, opacity: 0.16 }}>
          <span className="bp-display" style={{ fontSize: 200, color: '#fff', lineHeight: 0.85, letterSpacing: -0.05 }}>{active.num}</span>
        </div>
        {/* little dots — concentric, soft */}
        <div style={{ position: 'absolute', top: 40, right: -60, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }}/>
        <div style={{ position: 'absolute', top: 70, right: -30, width: 140, height: 140, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }}/>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <BpWordmark size={16} color="#fff" accent="#fff"/>
            <button className="bp-tap" onClick={() => onNav('habits')} style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'rgba(255,255,255,0.16)', border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
              backdropFilter: 'blur(8px)',
            }}>L</button>
          </div>

          <div style={{ fontSize: 12, opacity: 0.78, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>
            Aktuelles Thema
          </div>
          <h1 className="bp-display" style={{ fontSize: 38, margin: 0, lineHeight: 1.0, color: '#fff', maxWidth: 280, letterSpacing: '-0.01em' }}>
            <span style={{ fontStyle: 'italic' }}>{active.title}.</span>
          </h1>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8, fontWeight: 500 }}>
            {active.sub}
          </div>

          {/* hero progress: ring + count */}
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
            <BpRing size={64} stroke={5} percent={(totalDone / totalAll) * 100} color="#fff" delay={300}/>
            <div>
              <div className="bp-display" style={{ fontSize: 32, color: '#fff', lineHeight: 1 }}>
                {totalDone}<span style={{ opacity: 0.55 }}>/{totalAll}</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Aufgaben gemeistert</div>
            </div>
          </div>
        </div>
      </div>

      {/* Themes list */}
      <div style={{ padding: '20px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: Bp.inkMute, letterSpacing: 0.5, textTransform: 'uppercase' }}>Themen</div>
      </div>

      {data.themes.map((t, i) => {
        const meta = THEMES[i];
        const isActive = i === themeIdx;
        const isLocked = t.locked;
        const pct = (t.done / t.total) * 100;
        return (
          <div
            key={i}
            onClick={() => !isLocked && onNav('detail', { themeIdx: i })}
            className={!isLocked ? 'bp-tap' : ''}
            style={{
              margin: '0 20px 10px', padding: 16, borderRadius: 18,
              background: Bp.surface,
              border: `1px solid ${isActive ? meta.color + '55' : Bp.hair}`,
              boxShadow: isActive ? `0 6px 24px -10px ${meta.color}55` : 'none',
              opacity: isLocked ? 0.6 : 1,
              cursor: isLocked ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: isLocked ? Bp.hair : meta.color,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontStyle: 'italic', paddingBottom: 2,
            }} className="bp-display">
              {isLocked ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.4" fill={Bp.inkMute}/>
                  <path d="M5 7V5a3 3 0 116 0v2" stroke={Bp.inkMute} strokeWidth="1.6" fill="none"/>
                </svg>
              ) : meta.num}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.2 }}>{meta.title}</div>
              <div style={{ fontSize: 12, color: Bp.inkSoft, marginTop: 2 }}>{meta.sub}</div>
              {!isLocked && (
                <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: Bp.hair, overflow: 'hidden' }}>
                  <div className="bp-bar-anim" style={{
                    height: '100%', width: `${pct}%`,
                    background: meta.color,
                    borderRadius: 3,
                    '--bp-bar-delay': `${300 + i * 80}ms`,
                  }}/>
                </div>
              )}
            </div>
            {!isLocked && (
              <div className="bp-display" style={{ fontSize: 18, color: meta.color, flexShrink: 0 }}>
                {t.done}<span style={{ color: Bp.inkMute, fontSize: 14 }}>/{t.total}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Up next */}
      <div style={{ padding: '18px 20px 8px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: Bp.inkMute, letterSpacing: 0.5, textTransform: 'uppercase' }}>Als nächstes</div>
      </div>
      {data.upNext.map((c, i) => (
        <div key={i}
          onClick={() => onNav('detail', { themeIdx: c.themeIdx, taskIdx: c.taskIdx })}
          className="bp-tap"
          style={{
            margin: '0 20px 8px', padding: '14px 16px', borderRadius: 14,
            background: Bp.surface, border: `1px solid ${Bp.hair}`,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: THEMES[c.themeIdx].color, flexShrink: 0 }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: Bp.inkSoft, marginTop: 1 }}>{c.sub}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1l6 6-6 6" stroke={Bp.inkMute} strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
        </div>
      ))}

      <div style={{ height: 100 }}/>
      <BpTabBar active="challenges" onNav={onNav} themeColor={active.color}/>
    </div>
  );
}

// ─── Detail ──────────────────────────────────────────────────
// Borrows from A: quieter, content-first. The themed color is reduced to a
// thin band at the top + the CTA.
function BpDetail({ themeIdx = 0, taskIdx = 2, onNav = () => {}, data }) {
  const t = THEMES[themeIdx];
  const task = data.themes[themeIdx].tasks[taskIdx] || data.themes[themeIdx].tasks[0];
  const [accepted, setAccepted] = React.useState(false);

  return (
    <div className="bp-frame" style={{ background: Bp.surface }}>
      <BpSheet/>

      {/* Top bar — nav back, theme color as a thin chip */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onNav('overview')} className="bp-tap" style={{
          width: 36, height: 36, borderRadius: 12, background: Bp.bg, border: `1px solid ${Bp.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 1L3 7l6 6" stroke={Bp.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: t.soft, color: t.deep,
          fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: t.color }}/>
          Thema 0{t.num} · Aufgabe {taskIdx + 1}
        </div>
        <div style={{ width: 36 }}/>
      </div>

      {/* Body — quiet, generous, A-influenced */}
      <div style={{ padding: '40px 28px 0' }}>
        <h1 className="bp-display" style={{ fontSize: 40, margin: '0 0 22px', lineHeight: 1.0, letterSpacing: '-0.01em' }}>
          {task.title}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: Bp.ink, margin: 0, fontWeight: 400 }}>
          {task.body}
        </p>
      </div>

      {/* Single tip block — the only color in the body */}
      <div style={{ padding: '32px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: t.color, marginTop: 4 }}/>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.deep, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
              Tipp
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: Bp.inkSoft, margin: 0 }}>
              {task.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Timeframe */}
      <div style={{ padding: '36px 28px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: Bp.inkMute, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>Bis wann?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { l: 'Heute',     s: 'Mi' },
            { l: 'In 3 Tagen', s: 'Sa' },
            { l: 'Diese Woche', s: 'So' },
          ].map((tf, i) => (
            <button key={i} className="bp-tap" style={{
              flex: 1, padding: '14px 6px', borderRadius: 14,
              background: i === 1 ? t.color : Bp.bg,
              color: i === 1 ? '#fff' : Bp.ink,
              border: `1px solid ${i === 1 ? t.color : Bp.hair}`,
              fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              boxShadow: i === 1 ? `0 4px 12px -4px ${t.color}80` : 'none',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>{tf.l}</span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{tf.s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '36px 28px 100px' }}>
        <button
          onClick={() => onNav('done', { themeIdx, taskIdx })}
          className="bp-tap"
          style={{
            width: '100%', padding: '16px',
            background: t.color, color: '#fff', border: 'none', borderRadius: 16,
            fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: -0.1,
            boxShadow: `0 8px 22px -6px ${t.color}90`,
          }}>
          Annehmen
        </button>
        <button className="bp-tap" style={{
          width: '100%', padding: '14px', background: 'transparent', color: Bp.inkSoft, border: 'none',
          fontSize: 13, fontFamily: 'inherit', marginTop: 4, cursor: 'pointer',
        }}>
          Bereits erledigt
        </button>
      </div>

      <BpTabBar active="challenges" onNav={onNav} themeColor={t.color}/>
    </div>
  );
}

// ─── Habits ──────────────────────────────────────────────────
function BpHabits({ themeIdx = 0, onNav = () => {}, data, onToggleHabit }) {
  const active = THEMES[themeIdx];
  return (
    <div className="bp-frame">
      <BpSheet/>

      <div style={{ padding: '54px 22px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: Bp.inkMute, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>Routinen</div>
          <h1 className="bp-display" style={{ fontSize: 38, margin: 0, lineHeight: 1.0, letterSpacing: '-0.01em' }}><span style={{ fontStyle: 'italic' }}>Gewohnheiten</span></h1>
        </div>
        <button onClick={() => onNav('overview')} className="bp-tap" style={{
          width: 36, height: 36, borderRadius: 12, background: Bp.surface, border: `1px solid ${Bp.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 1L3 7l6 6" stroke={Bp.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Today summary card — themed */}
      <div style={{
        margin: '8px 20px 22px', padding: 18, borderRadius: 18,
        background: `linear-gradient(135deg, ${active.color} 0%, ${active.deep} 100%)`,
        color: '#fff',
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)' }}/>
        <BpRing size={56} stroke={4} percent={(data.habits.filter(h => h.todayDone).length / data.habits.length) * 100} color="#fff" delay={200}/>
        <div style={{ position: 'relative' }}>
          <div className="bp-display" style={{ fontSize: 28, lineHeight: 1.1, color: '#fff' }}>
            {data.habits.filter(h => h.todayDone).length} <span style={{ fontStyle: 'italic', opacity: 0.7 }}>von</span> {data.habits.length}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Routinen heute erledigt</div>
        </div>
      </div>

      {data.habits.map((h, i) => {
        const t = THEMES[h.themeIdx];
        return (
          <div key={i} style={{
            margin: '0 20px 12px', padding: 18, borderRadius: 18,
            background: Bp.surface, border: `1px solid ${Bp.hair}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: t.color }}/>
                  <div style={{ fontSize: 10, fontWeight: 600, color: t.deep, letterSpacing: 0.5, textTransform: 'uppercase' }}>Thema 0{t.num}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}>{h.title}</div>
                {h.streak > 0 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '3px 10px', borderRadius: 999, background: t.soft }}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0c1 2 3 3 3 5.5A3 3 0 015 9 3 3 0 012 5.5C2 3.5 4 3 5 0z" fill={t.color}/></svg>
                    <span style={{ fontSize: 11, fontWeight: 600, color: t.deep }}>{h.streak} Tage Serie</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {['M','D','M','D','F','S','S'].map((d, k) => (
                <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 32, borderRadius: 10, marginBottom: 4,
                    background: h.week[k] ? t.color : Bp.bg,
                    border: h.week[k] ? 'none' : `1px solid ${Bp.hair}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 200ms',
                  }}>
                    {h.week[k] === 1 && <svg width="12" height="9" viewBox="0 0 12 9"><path d="M1 4.5L4.5 8L11 1" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div style={{ fontSize: 10, color: Bp.inkMute, fontWeight: 500 }}>{d}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onToggleHabit && onToggleHabit(i)}
              className="bp-tap"
              style={{
                width: '100%', padding: '12px', borderRadius: 12,
                background: h.todayDone ? Bp.bg : t.color,
                color: h.todayDone ? Bp.inkSoft : '#fff',
                border: h.todayDone ? `1px solid ${Bp.hair}` : 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: h.todayDone ? 'none' : `0 4px 12px -4px ${t.color}90`,
              }}>
              {h.todayDone ? (
                <><svg width="12" height="9" viewBox="0 0 12 9"><path d="M1 4.5L4.5 8L11 1" stroke={Bp.inkSoft} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> Heute erledigt</>
              ) : 'Heute abhaken'}
            </button>
          </div>
        );
      })}

      <div style={{ height: 100 }}/>
      <BpTabBar active="habits" onNav={onNav} themeColor={active.color}/>
    </div>
  );
}

// ─── Done ──────────────────────────────────────────────────
function BpDone({ themeIdx = 0, taskIdx = 2, onNav = () => {}, data }) {
  const t = THEMES[themeIdx];
  const task = data.themes[themeIdx].tasks[taskIdx] || data.themes[themeIdx].tasks[0];
  const [showRipple, setShowRipple] = React.useState(true);

  // Confetti pieces — randomized angles
  const confetti = React.useMemo(() => {
    const N = 16;
    return Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2;
      const dist = 80 + Math.random() * 40;
      const cx = Math.cos(angle) * dist;
      const cy = Math.sin(angle) * dist - 20;
      const cr = (Math.random() - 0.5) * 720;
      const colors = [t.color, t.deep, '#fff', t.soft];
      return { cx, cy, cr, color: colors[i % colors.length], delay: Math.random() * 200 };
    });
  }, [t]);

  return (
    <div className="bp-frame" style={{
      padding: 0,
      background: `linear-gradient(180deg, ${t.color} 0%, ${t.color} 38%, ${Bp.bg} 70%)`,
    }}>
      <BpSheet/>

      <div style={{ padding: '52px 20px 0', position: 'relative', zIndex: 2 }}>
        <button onClick={() => onNav('overview')} className="bp-tap" style={{
          width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.2)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7h12M1 7l5-5M1 7l5 5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Hero check + celebration */}
      <div style={{ textAlign: 'center', padding: '40px 28px 0', position: 'relative' }}>
        {/* confetti ring */}
        <div style={{ position: 'absolute', top: 100, left: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 1 }}>
          {confetti.map((c, i) => (
            <div key={i} className="bp-confetti" style={{
              position: 'absolute',
              width: 8, height: 14, borderRadius: 2, background: c.color,
              left: -4, top: -7,
              '--cx': `${c.cx}px`, '--cy': `${c.cy}px`, '--cr': `${c.cr}deg`,
              animationDelay: `${c.delay}ms`,
            }}/>
          ))}
        </div>
        {/* radiating ring */}
        {showRipple && (
          <>
            <div className="bp-radiate" style={{
              position: 'absolute', top: 30, left: '50%', marginLeft: -50,
              width: 100, height: 100, borderRadius: '50%',
              border: `2px solid #fff`,
              animationDelay: '100ms',
            }}/>
            <div className="bp-radiate" style={{
              position: 'absolute', top: 30, left: '50%', marginLeft: -50,
              width: 100, height: 100, borderRadius: '50%',
              border: `2px solid #fff`,
              animationDelay: '300ms',
            }}/>
          </>
        )}

        <div className="bp-burst" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 110, height: 110, borderRadius: '50%',
          background: '#fff',
          boxShadow: `0 18px 50px -12px rgba(0,0,0,0.25), 0 0 0 8px rgba(255,255,255,0.25)`,
          marginBottom: 30, position: 'relative', zIndex: 2,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M14 24.5l7 7 14-15" stroke={t.color} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="bp-rise" style={{ animationDelay: '400ms', color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase', opacity: 0.9, marginBottom: 8 }}>Erledigt</div>
          <h1 className="bp-display" style={{ fontSize: 42, margin: 0, lineHeight: 1.0, color: '#fff', letterSpacing: '-0.01em' }}>
            Stark, <span style={{ fontStyle: 'italic' }}>das war&rsquo;s!</span>
          </h1>
        </div>
      </div>

      {/* The completed-task card */}
      <div className="bp-rise" style={{
        margin: '38px 20px 0', padding: 20, borderRadius: 18,
        background: Bp.surface, border: `1px solid ${Bp.hair}`,
        animationDelay: '500ms',
        boxShadow: '0 12px 32px -16px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: t.color }}/>
          <div style={{ fontSize: 10, fontWeight: 600, color: t.deep, letterSpacing: 0.5, textTransform: 'uppercase' }}>Thema 0{t.num} · Aufgabe {taskIdx + 1}</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.3 }}>{task.title}</div>
        <div style={{ fontSize: 13, color: Bp.inkSoft, marginTop: 6, lineHeight: 1.5 }}>
          Möchtest du diese Aufgabe zur täglichen Gewohnheit machen?
        </div>
      </div>

      <div className="bp-rise" style={{ padding: '24px 20px 32px', animationDelay: '600ms' }}>
        <button
          onClick={() => onNav('habits', { addHabit: { title: task.title, themeIdx } })}
          className="bp-tap"
          style={{
            width: '100%', padding: '16px',
            background: Bp.brandNavy, color: '#fff', border: 'none', borderRadius: 16,
            fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: -0.1,
          }}>
          Zur Gewohnheit machen
        </button>
        <button
          onClick={() => onNav('overview')}
          className="bp-tap"
          style={{
            width: '100%', padding: '14px', background: 'transparent', color: Bp.inkSoft, border: 'none',
            fontSize: 13, fontFamily: 'inherit', marginTop: 4, cursor: 'pointer',
          }}>
          Nein, danke
        </button>
      </div>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────
function BpTabBar({ active, onNav = () => {}, themeColor = Bp.ink }) {
  const Tab = ({ id, label, icon, target }) => {
    const isActive = active === id;
    return (
      <button onClick={() => onNav(target)} className="bp-tap" style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        padding: '10px 0 18px', background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit',
      }}>
        <div style={{
          padding: '6px 16px', borderRadius: 12,
          background: isActive ? themeColor : 'transparent',
          color: isActive ? '#fff' : Bp.inkMute,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 250ms, color 250ms',
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 10.5, fontWeight: isActive ? 600 : 500, color: isActive ? Bp.ink : Bp.inkMute, letterSpacing: 0.1 }}>{label}</div>
      </button>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: `1px solid ${Bp.hair}`,
      display: 'flex',
    }}>
      <Tab id="challenges" target="overview" label="Aufgaben" icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>}/>
      <Tab id="habits"     target="habits"   label="Routine"  icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 1110 0M13 8l-1.5-1.5M3 8v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>}/>
    </div>
  );
}

Object.assign(window, { THEMES, BpWelcome, BpOverview, BpDetail, BpHabits, BpDone, BpTabBar });
