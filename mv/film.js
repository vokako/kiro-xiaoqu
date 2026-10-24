'use strict';
// Kiro 小曲 MV · the film: shots joined by camera moves (each one through the focus of the shot before), a light pass,
// the lyrics on top. The README has the design; every frame is renderAt(t).
const DURATION = 136.44;
const SHOTS = {
  title: sTitle, night: sNight, chat: sChat, spec: sSpec, club1: sClub1, tests: sTests, alarm: sAlarm, club2: sClub2, bridge: sBridge, club3: sClub3, end: sEnd,
};
const ORDER = ['title', 'night', 'chat', 'spec', 'club1', 'tests', 'alarm', 'club2', 'bridge', 'club3', 'end'];
// the hand-overs: [a, b] in seconds; zoom K > 1 pushes into A's point pa and B opens out of it at pb; K < 1 pulls back
const TR = [
  { a: 3.86, b: 4.36, kind: 'zoom', K: 9, pa: t => titleCursor(t).slice(0, 2), pb: () => [540, 980] },
  { a: 7.8, b: 8.22, kind: 'zoom', K: 7, dark: .2, pa: t => nightBulb(t), pb: () => [540, 700] },
  { a: 11.52, b: 11.66, kind: 'dissolve' },
  { a: 28.52, b: 28.92, kind: 'zoom', K: 10, pa: () => [540, 900], pb: () => [540, HY - 120] },
  { a: 44.28, b: 44.74, kind: 'zoom', K: 7, pa: () => C1_TILE, pb: () => [540, 1215] },
  { a: 60.22, b: 60.66, kind: 'zoom', K: 9, pa: () => ALERT, pb: () => [540, 700] },
  { a: 69.52, b: 69.92, kind: 'zoom', K: 12, pa: () => [540, 900], pb: () => [540, HY - 120] },
  { a: 85.8, b: 86.25, kind: 'zoom', K: 8, pa: t => club2Ball(t), pb: () => [540, 960] },
  { a: 102.5, b: 102.76, kind: 'dissolve' },
  { a: 118.8, b: 119.5, kind: 'zoom', K: 1 / 4, pa: () => [540, 1000], pb: () => [END.cx, END.cy] },
];
TR.forEach((r, i) => { r.A = ORDER[i]; r.B = ORDER[i + 1]; });
function shotAt(t) { let i = 0; while (i < TR.length && t >= TR[i].b) i++; return ORDER[i]; }
// a picture smaller than the frame melts at its edges into the bigger one
function feather(m, [x0, y0, x1, y1], w) {
  if (w < 1) return; m.save(); m.globalCompositeOperation = 'destination-in';
  for (const [a, b, across] of [[x0, x0 + w, 1], [x1, x1 - w, 1], [y0, y0 + w, 0], [y1, y1 - w, 0]]) { const lg = across ? m.createLinearGradient(a, 0, b, 0) : m.createLinearGradient(0, a, 0, b); lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(1, '#000'); m.fillStyle = lg; m.fillRect(0, 0, W, H); }
  m.restore();
}
function melt(m, p, r, rect, w) {
  feather(m, rect, w);
  const rg = m.createRadialGradient(p[0], p[1], r * .3, p[0], p[1], r); rg.addColorStop(0, '#000'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  m.save(); m.globalCompositeOperation = 'destination-in'; m.fillStyle = rg; m.fillRect(0, 0, W, H); m.restore();
}
const TRANS = {
  zoom(A, B, o) {
    const K = o.K, into = K > 1, pa = o.pa(o.a), pb = o.pb(o.b);
    return u => {
      const e = io3(u), z = Math.pow(K, e), P = [lerp(pa[0], pb[0], e), lerp(pa[1], pb[1], e)];
      const [Cv, g] = buf('zs'); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      put(g, into ? A : B, into ? pa : pb, P, into ? z : z / K);
      if (into) { g.fillStyle = `rgba(0,0,0,${((o.dark ?? .55) * sstep(.35, .85, e)).toFixed(3)})`; g.fillRect(0, 0, W, H); }
      const al = into ? sstep(.3, .72, e) : 1 - sstep(.28, .7, e);
      if (al > 0) {
        const si = into ? z / K : z, pi = into ? pb : pa, late = into ? sstep(.5, 1, e) : 1 - sstep(0, .5, e), x0 = P[0] - pi[0] * si, y0 = P[1] - pi[1] * si;
        const [M, m] = buf('zm'); put(m, into ? B : A, pi, P, si);
        melt(m, P, 1100 * si * (1 + 6 * late), [x0, y0, x0 + W * si, y0 + H * si], 260 * si * (1 - late));
        g.globalAlpha = al; g.drawImage(M, 0, 0); g.globalAlpha = 1;
      }
      return Cv;
    };
  },
  dissolve(A, B) { return u => { const [Cv, g] = buf('zs'); g.drawImage(A, 0, 0); g.globalAlpha = io3(u); g.drawImage(B, 0, 0); g.globalAlpha = 1; return Cv; }; },
};
// a move drawn at n moments while the shutter is open, averaged (a running mean)
function smeared(f, u, du, n) {
  if (n <= 1) return f(u);
  const [Cv, g] = buf('zt');
  for (let i = 0; i < n; i++) { g.globalAlpha = 1 / (i + 1); g.drawImage(f(clamp(u + (i / (n - 1) - .5) * du)), 0, 0); }
  g.globalAlpha = 1; return Cv;
}
// the camera of a shot travelled v px during the shutter: the frame smeared along it
function panSmear(src, [vx, vy], name) {
  const L = Math.hypot(vx, vy), n = Math.min(7, Math.ceil(L / 5)); if (n <= 1) return src;
  const [Cv, g] = buf(name + 's');
  for (let i = 0; i < n; i++) { const k = i / (n - 1) - .5; g.globalAlpha = 1 / (i + 1); g.drawImage(src, vx * k, vy * k); }
  g.globalAlpha = 1; return Cv;
}
function drawShot(id, t, name) { const [Cv, g] = buf(name); const r = SHOTS[id](g, t) || {}; return r.blur ? panSmear(Cv, r.blur, name) : Cv; }
function picture(t) {
  const tr = TR.find(r => t >= r.a && t < r.b);
  if (!tr) return drawShot(shotAt(t), t, 'A');
  const A = drawShot(tr.A, t, 'A'), B = drawShot(tr.B, t, 'B'), d = tr.b - tr.a, u = (t - tr.a) / d;
  const n = tr.kind === 'zoom' ? Math.round(1 + 9 * Math.sin(Math.PI * u) ** 2) : 1;
  return smeared(TRANS[tr.kind](A, B, tr), u, SHUT / d * 1.6, n);
}
// light: highlights bleed (a bright pass at quarter size), and swell on the hits; then a vignette
const HITS = () => once('hits', () => [
  [BAR(1), .3], [T('L01', 4), .35], [T('L02', 7), .2], [28.754, .9], [T('L07', 4), .6], [T('L09', 0), .35], [T('L09', 3), .35], [T('L10', 3), .35],
  [T('L11', 3), .3], [T('L12', 3), .35], [T('L13', 7), .2], [T('L15', 5), .3], [T('L16', 1), .35], [T('L16', 3), .35], [69.78, 1], [T('L17', 4), .65], [T('L18', 4), .5],
  [T('L19', 0), .3], [T('L19', 3), .3], [T('L20', 3), .35], [86.2, .4], [T('L23', 0), .3], [102.6, 1.1], [T('L25', 4), .7], [T('L26', 0), .35], [T('L27', 0), .55], [T('L27', 3), .55],
  [T('L28', 6), 1], [BAR(60), .8], [BAR(61) + 2 * SPB, .45], [BAR(66), .7],
]);
const liftAt = t => HITS().reduce((s, [t0, k]) => s + k * bump(t - t0, .08, .5), 0);
let VIG = null;
function post(g, t) {
  const [S, s] = buf('bloom', 270, 480);
  s.filter = 'brightness(.78) contrast(2.6) blur(5px)'; s.drawImage(g.canvas, 0, 0, 270, 480); s.filter = 'none';
  const lift = liftAt(t);
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = clamp(.34 + .32 * lift, 0, .85); g.imageSmoothingQuality = 'high'; g.drawImage(S, 0, 0, W, H); g.restore();
  if (!VIG) { const [V, v] = buf('vig'); const rg = v.createRadialGradient(540, 900, 520, 540, 960, 1250); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(0,0,0,.5)'); v.fillStyle = rg; v.fillRect(0, 0, W, H); VIG = V; }
  g.drawImage(VIG, 0, 0);
}
(async () => {
  try {
    const q = new URLSearchParams(location.search), MASK = q.get('lyrics') === '1';
    window.DEMO = { width: W, height: H, fps: 60, duration: DURATION };
    const fonts = [['700 100px KDisp', 'Kiro'], ['400 100px KDisp', 'Kiro'], ['700 100px KRound', 'Kiro'], ['400 40px KSans', 'Kiro'], ['700 40px KSans', 'Kiro'], ['400 30px KMono', 'Kiro'],
      ['900 100px Rounded', '凌晨两点'], ['700 100px Rounded', '凌晨两点'], ['300 100px Rounded', '凌晨两点'], ['400 40px MapleCN', '凌晨❯'], ['700 40px MapleCN', '凌晨❯'], ['500 40px "Sans SC"', '凌晨']];
    await Promise.all(fonts.map(([f, s]) => document.fonts.load(f, s)));
    for (const [f, s] of fonts) if (!document.fonts.check(f, s)) throw new Error('font not loaded: ' + f);
    const [cues, geom] = await Promise.all([fetch('cues.json').then(r => r.json()), fetch('ghost_geom.json').then(r => r.json())]);
    GB = geom; setTempo(cues.bpm, cues.beat0); setCues(cues); layoutLyrics();
    const cv = document.getElementById('c'), G = cv.getContext('2d');
    window.renderAt = async t => {
      try {
        G.setTransform(1, 0, 0, 1, 0, 0); G.globalAlpha = 1; G.globalCompositeOperation = 'source-over'; G.filter = 'none';
        G.fillStyle = '#000'; G.fillRect(0, 0, W, H);
        if (!MASK) { G.drawImage(picture(t), 0, 0); post(G, t); }
        drawLyrics(G, t, MASK);
        const f = sstep(135.52, 136.36, t); if (f > 0) { G.fillStyle = `rgba(0,0,0,${f})`; G.fillRect(0, 0, W, H); }
      } catch (e) { document.title = 'ERR ' + t.toFixed(2) + ' ' + e.message; throw e; }
    };
    window.__ready = true;
  } catch (e) { document.title = 'ERR ' + e.message; console.error(e); }
})();
