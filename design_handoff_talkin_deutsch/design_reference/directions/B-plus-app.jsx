// B+ interactive prototype — wires the screens together with state,
// navigation, and the theme-wash transition.

const BP_INITIAL_DATA = {
  themes: [
    {
      done: 4, total: 10, locked: false,
      tasks: [
        { title: 'Lächle und sag „Hallo"', body: 'Wenn du heute jemandem im Treppenhaus, im Bus oder im Café begegnest, lächle und grüße kurz. Mehr nicht.', tip: 'Ein Lächeln ist die kleinste, sicherste Form von Kontakt — und der erste Faden, an dem alles andere wächst.' },
        { title: 'Stell eine Frage zur Umgebung', body: 'Frag jemanden nach dem Weg, der Uhrzeit oder dem WLAN-Passwort — auch wenn du es eigentlich weißt.', tip: 'Kleine Fragen geben Menschen das Gefühl, gebraucht zu werden. Das ist ein Geschenk.' },
        { title: 'Frag nach einer Empfehlung', body: 'Bitte jemanden um eine lokale Empfehlung: ein Restaurant, ein Café, ein Ausflugsziel — auch wenn du die Antwort vielleicht gar nicht brauchst.', tip: 'Menschen helfen gerne. Eine konkrete Frage macht den Einstieg leicht — und oft ergibt sich daraus ein richtiges Gespräch.' },
        { title: 'Mach ein Kompliment', body: 'Sag heute einer Person etwas Aufrichtiges: zur Tasche, zur Frisur, zur Geduld an der Kasse.', tip: 'Konkrete Komplimente wirken stärker als allgemeine. „Schöne Schuhe" schlägt „Du siehst gut aus".' },
      ],
    },
    {
      done: 0, total: 10, locked: false,
      tasks: [
        { title: 'Geh dieselbe Route', body: 'Nimm heute denselben Weg wie gestern. Bekannte Gesichter brauchen Wiederholung.', tip: 'Vertrautheit ist die langsamste, aber stärkste Form von Sympathie.' },
      ],
    },
    {
      done: 0, total: 10, locked: true,
      tasks: [
        { title: 'Bring etwas mit', body: 'Bring dem Nachbarn, einer Kollegin, jemandem im Verein etwas Kleines mit.', tip: 'Kleine Gesten signalisieren: Ich denke an dich.' },
      ],
    },
    {
      done: 0, total: 10, locked: true,
      tasks: [
        { title: 'Erzähl etwas Persönliches', body: 'Teile heute mit jemandem, der dir wichtig wird, etwas, das du sonst nicht erzählst.', tip: 'Verletzlichkeit ist die Eintrittskarte zu echter Nähe.' },
      ],
    },
  ],
  upNext: [
    { title: 'Frag nach einer Empfehlung', sub: 'committed · bis Freitag', themeIdx: 0, taskIdx: 2 },
    { title: 'Mach ein Kompliment', sub: 'noch nicht begonnen', themeIdx: 0, taskIdx: 3 },
  ],
  habits: [
    { title: 'Lächle und sag Hallo',     themeIdx: 0, streak: 12, week: [1,1,1,0,1,1,1], todayDone: true  },
    { title: 'Frag nach einer Empfehlung', themeIdx: 0, streak: 4,  week: [0,1,1,1,1,0,0], todayDone: false },
    { title: 'Stell eine Frage zur Umgebung', themeIdx: 0, streak: 0, week: [0,0,0,1,0,0,0], todayDone: false },
  ],
};

function BpPrototype() {
  const [screen, setScreen] = React.useState('welcome');
  const [themeIdx, setThemeIdx] = React.useState(0);
  const [taskIdx, setTaskIdx] = React.useState(2);
  const [data, setData] = React.useState(BP_INITIAL_DATA);
  const [washColor, setWashColor] = React.useState(null);
  const [washKey, setWashKey] = React.useState(0);

  const onNav = React.useCallback((target, payload = {}) => {
    if (typeof payload.themeIdx === 'number' && payload.themeIdx !== themeIdx) {
      // Theme change — trigger color wash
      const nextColor = THEMES[payload.themeIdx].color;
      setWashColor(nextColor);
      setWashKey(k => k + 1);
      setTimeout(() => setWashColor(null), 1000);
      setThemeIdx(payload.themeIdx);
    }
    if (typeof payload.taskIdx === 'number') {
      setTaskIdx(payload.taskIdx);
    }
    if (payload.addHabit) {
      setData(d => ({
        ...d,
        habits: [
          { title: payload.addHabit.title, themeIdx: payload.addHabit.themeIdx, streak: 1, week: [0,0,0,0,0,0,1], todayDone: true },
          ...d.habits,
        ],
      }));
    }
    setScreen(target);
  }, [themeIdx]);

  const onToggleHabit = React.useCallback((idx) => {
    setData(d => {
      const habits = d.habits.map((h, i) => i === idx ? { ...h, todayDone: !h.todayDone, week: [...h.week.slice(0,6), h.todayDone ? 0 : 1] } : h);
      return { ...d, habits };
    });
  }, []);

  // Re-key the screen so it re-mounts (and animations replay) on every navigation
  const screenKey = `${screen}-${themeIdx}-${taskIdx}`;

  let body;
  if (screen === 'welcome')  body = <BpWelcome  key={screenKey} onNav={onNav}/>;
  else if (screen === 'overview') body = <BpOverview key={screenKey} themeIdx={themeIdx} onNav={onNav} data={data}/>;
  else if (screen === 'detail')   body = <BpDetail   key={screenKey} themeIdx={themeIdx} taskIdx={taskIdx} onNav={onNav} data={data}/>;
  else if (screen === 'habits')   body = <BpHabits   key={screenKey} themeIdx={themeIdx} onNav={onNav} data={data} onToggleHabit={onToggleHabit}/>;
  else if (screen === 'done')     body = <BpDone     key={screenKey} themeIdx={themeIdx} taskIdx={taskIdx} onNav={onNav} data={data}/>;

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {body}
      <BpThemeWash color={washColor} keyId={washKey}/>
    </div>
  );
}

Object.assign(window, { BpPrototype, BP_INITIAL_DATA });
