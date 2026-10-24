'use strict';
// Kiro 小曲 MV · the lyrics. Every character appears when it is sung (cues.json tokens[].start), on the beat, laid out
// for its picture; each line has its own entrance (ST) and they all breathe a little with the kick drum.
let CUE = null; const LN = {};
const T = (id, k = 0) => { const tk = LN[id].tokens; return tk[clamp(k, 0, tk.length - 1)].start; };
const TE = id => LN[id].end;
function setCues(c) { CUE = c; for (const l of c.lines) LN[l.id] = l; }
const LEAD = .03;                                                // a character starts its entrance this long before it is sung

// rows: [tokens, align L|C|R, x, y, size]; st: entrance per row; tst: entrance per token index; key: colour per character
// fill: default fill; ex: exit; out: when the line starts to leave; br: how much it breathes with the kick
const SPEC = {
  L01: { rows: [[4, 'L', 96, 318, 112], [4, 'C', 500, 1318, 150]], st: ['terminal', 'neon'], key: { 灵: 'gold', 感: 'gold' }, ex: 'glitch' },
  L02: { rows: [[4, 'R', 870, 560, 92], [4, 'L', 262, 812, 92]], st: ['type', 'suggest'], w: [700, 700], ex: 'fade' },
  L03: { rows: [[4, 'C', 500, 300, 120], [4, 'C', 500, 456, 120]], st: ['key', 'draw'] },
  L04: { rows: [[4, 'C', 500, 300, 120], [4, 'C', 500, 1318, 146]], st: ['queue', 'float'], w: [900, 300], key: { 我: 'tea', 来: 'tea', 喝: 'tea', 茶: 'tea' } },
  L05: { rows: [[3, 'L', 86, 1150, 156], [3, 'R', 926, 1322, 156]], st: ['slice', 'slice'], key: { 催: 'red', 改: 'red' }, ex: 'glitch' },
  L06: { rows: [[4, 'C', 500, 1150, 150], [3, 'C', 500, 1318, 166]], st: ['stamp', 'dash'], fill: 'kiro', ex: 'zoom', outs: [26.62] },
  L07: { rows: [[4, 'C', 500, 330, 156], [3, 'C', 500, 566, 164]], st: ['extrude', 'lift'], tst: { 4: 'zoom' }, br: .04 },
  L08: { rows: [[4, 'L', 80, 318, 136], [4, 'R', 926, 486, 136]], st: ['holo', 'scramble'], key: { 想: 'gold', 法: 'gold' }, br: .035 },
  L09: { rows: [[3, 'L', 72, 350, 162], [3, 'R', 928, 570, 162]], st: ['drop', 'lift'], tst: { 0: 'zoom', 3: 'zoom' }, br: .05 },
  L10: { rows: [[4, 'C', 500, 318, 146], [3, 'C', 500, 520, 168]], st: ['hud', 'bounce'], key: { 回: 'gold', 家: 'gold', 啦: 'gold' }, br: .035 },
  L11: { rows: [[4, 'L', 96, 300, 116], [4, 'R', 926, 452, 120]], st: ['terminal', 'run'], ex: 'up' },
  L12: { rows: [[4, 'L', 80, 308, 128], [4, 'R', 926, 460, 128]], st: ['lamp', 'hud'], key: { 红: 'red', 灯: 'red', 亮: 'red' } },
  L13: { rows: [[4, 'L', 80, 300, 124], [4, 'R', 926, 456, 124]], st: ['laser', 'lock'] },
  L14: { rows: [[4, 'C', 500, 300, 124], [4, 'C', 500, 1320, 154]], st: ['rise', 'bubble'], w: [300, 900] },
  L15: { rows: [[3, 'L', 86, 1166, 160], [3, 'R', 926, 1328, 160]], st: ['glitch', 'glitch'], fill: 'red', ex: 'glitch', out: 65.22 },
  L16: { rows: [[4, 'C', 500, 1150, 154], [3, 'C', 500, 1318, 166]], st: ['wipe', 'dash'], fill: 'kiro', ex: 'zoom', outs: [67.6] },
  L17: { rows: [[4, 'C', 500, 400, 156], [3, 'C', 500, 626, 164]], st: ['echo', 'slice'], tst: { 4: 'zoom' }, br: .045 },
  L18: { rows: [[4, 'L', 80, 400, 144], [4, 'R', 926, 580, 144]], st: ['colorflip', 'stamp'], tst: { 4: 'zap' }, br: .04 },
  L19: { rows: [[3, 'R', 926, 400, 162], [3, 'L', 76, 620, 162]], st: ['flip', 'flip'], br: .05 },
  L20: { rows: [[4, 'C', 500, 400, 146], [3, 'C', 500, 1318, 170]], st: ['neon', 'bounce'], key: { 回: 'gold', 家: 'gold', 啦: 'gold' }, br: .04 },
  L21: { rows: [[4, 'C', 500, 400, 112], [3, 'C', 500, 600, 146]], st: ['wave', 'wave'], key: { 嗨: 'magenta' }, ex: 'up' },
  L22: { rows: [[4, 'C', 500, 1150, 108], [3, 'C', 500, 1320, 136]], st: ['snap', 'snap'], code: 1, ex: 'up' },
  L23: { rows: [[5, 'C', 500, 342, 144], [3, 'C', 500, 1318, 160]], st: ['holo', 'depth'], fill: 'kiro' },
  L24: { rows: [[7, 'C', 500, 318, 112]], st: ['sway'], out: 95.6 },
  L25: { rows: [[4, 'C', 500, 640, 166], [3, 'C', 500, 868, 174]], st: ['mega', 'mega'], tst: { 4: 'zoom' }, br: .05 },
  L26: { rows: [[4, 'C', 500, 650, 150], [4, 'C', 500, 872, 160]], st: ['hud', 'pop'], key: { 周: 'magenta', 五: 'magenta', 晚: 'magenta', 上: 'magenta' }, br: .04 },
  L27: { rows: [[3, 'L', 72, 640, 178], [3, 'R', 928, 872, 178]], st: ['slam', 'extrude'], br: .06 },
  L28: { rows: [[4, 'C', 500, 640, 166], [3, 'C', 500, 878, 198]], st: ['rainbow', 'burst'], br: .05, out: 118.3, ex: 'zoom' },
};
const FILL = {
  cream: ['#ffffff', '#ffffff', '#e8e0f7', KP.p300], kiro: ['#f4eeff', '#c59eff', '#8a3ff5', KP.p500], gold: ['#fffbe8', '#fff2b3', '#ffd966', KP.rx],
  red: ['#ffe3e6', '#ff8a96', '#ff3a52', C.red], green: ['#e6fff0', '#80ffb5', '#2fe08a', KP.str], magenta: ['#ffe6f1', '#ff80b5', '#ff4f9a', KP.ent],
  cyan: ['#e8fdff', '#80f4ff', '#38d6ee', KP.vari], blue: ['#e9f4ff', '#8dc8fb', '#4fa6f2', KP.fn], tea: ['#fff6e8', '#ffd9a3', '#ffb35c', KP.rx], dim: ['#5a4a72', '#4a3a62', '#3a2c52', C.ink],
};
const LAT_FILL = { Kiro: 'kiro', vibe: 'magenta', spec: 'cyan', bug: 'green' };
const LAY = {};
function layoutLyrics() {
  const [, m] = buf('measure', 8, 8);
  for (const l of CUE.lines) {
    const sp = SPEC[l.id]; if (!sp) continue;
    const gaps = []; let p = 0;
    for (const tk of l.tokens) { const i = l.text.indexOf(tk.t, p); gaps.push(i > 0 && l.text[i - 1] === ' '); p = i >= 0 ? i + tk.t.length : p; }
    let ti = 0; const rows = [];
    sp.rows.forEach((r, ri) => {
      const [n, al, x, y, size] = r, gl = []; let w = 0;
      for (let k = 0; k < n; k++, ti++) {
        const tk = l.tokens[ti], lat = /^[A-Za-z]/.test(tk.t), code = sp.code || (sp.st || [])[ri] === 'terminal';
        const fam = lat ? (code ? FONT.code : FONT.disp) : (code ? FONT.cjkCode : FONT.cjk), wt = lat ? (code ? 400 : 700) : (code ? 700 : ((sp.w || [])[ri] || 900)), fs = lat ? size * (code ? .95 : .86) : size;
        m.font = `${wt} ${fs}px ${fam}`; const adv = m.measureText(tk.t).width * (lat ? 1 : .98);
        w += k ? (gaps[ti] ? size * .24 : size * .02) : 0;
        gl.push({ ch: tk.t, lat, fam, wt, fs, cx: w + adv / 2, adv, ti, t0: tk.start, k, row: ri }); w += adv;
      }
      const x0 = al === 'L' ? x : al === 'R' ? x - w : x - w / 2;
      gl.forEach(q => { q.x = x0 + q.cx; q.y = y; });
      rows.push({ gl, x0, x1: x0 + w, y, size, st: (sp.st || [])[ri] || 'rise', n, ri });
    });
    LAY[l.id] = { id: l.id, rows, line: l, sp, idx: CUE.lines.indexOf(l) };
  }
}
function exitAt(L) {
  if (L.sp.out) return L.sp.out;
  const nx = CUE.lines[L.idx + 1], ns = nx ? nx.tokens[0].start : 1e9;
  return Math.min(ns - .14, L.line.end + 1.6);
}
const fillOf = (q, sp) => (sp.key && sp.key[q.ch]) || (q.lat && LAT_FILL[q.ch]) || sp.fill || 'cream';
function paintFor(g, name, fs) {
  const F = FILL[name] || FILL.cream, lg = g.createLinearGradient(0, -fs * .5, 0, fs * .5);
  lg.addColorStop(0, F[0]); lg.addColorStop(.45, F[1]); lg.addColorStop(1, F[2]); return lg;
}
// one glyph: o = { dx dy s sx sy rot al blur glow fill gc ch vis }
function drawGlyph(g, q, o, mask) {
  const al = mask ? Math.max(o.al, o.vis || 0) : o.al; if (al <= .004 || o.s <= .001) return;
  g.save(); if (o.clipR != null) { g.beginPath(); g.rect(-1e4, -1e4, o.clipR + 1e4, 3e4); g.clip(); }
  g.translate(q.x + (o.dx || 0), q.y + (o.dy || 0) + (q.lat ? q.fs * .04 : 0)); if (o.rot) g.rotate(o.rot);
  g.scale(o.s * (o.sx ?? 1), o.s * (o.sy ?? 1)); g.globalAlpha *= clamp(al);
  g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const ch = o.ch || q.ch; if (o.fam) g.font = `${o.wt || 400} ${q.fs * (o.fsk || 1)}px ${o.fam}`;
  if (mask) { g.fillStyle = '#fff'; g.fillText(ch, 0, 0); g.restore(); return; }
  if (o.blur > .4) g.filter = `blur(${o.blur.toFixed(1)}px)`;
  g.lineJoin = 'round'; g.lineWidth = q.fs * .11; g.strokeStyle = 'rgba(16,6,34,.78)'; g.strokeText(ch, 0, 0);
  const F = FILL[o.fill] || FILL.cream;
  if (o.glow > .02) { g.shadowColor = rgba(o.gc || F[3], clamp(o.glow)); g.shadowBlur = q.fs * (.3 + .25 * clamp(o.glow - 1, 0, 1)); }
  g.fillStyle = o.solid || paintFor(g, o.fill, q.fs); g.fillText(ch, 0, 0);
  g.restore();
}
const RAND_CH = '0123456789ABCDEF<>/{}';
// entrances: f(a, q, R, t, L) -> o; fx(g, a, q, R, t, o) draws extras behind the glyph (not in the mask)
const STY = {
  rise: { f: a => ({ dy: 46 * (1 - E.out3(a / .32)), al: E.out2(a / .2), blur: 7 * (1 - E.out2(a / .26)), glow: .5 * bump(a, .01, .4) }) },
  pop: { f: a => ({ s: a < .3 ? Math.max(.01, E.back(a / .3, 2.6)) : 1, al: clamp(a / .04), glow: .9 * bump(a, .01, .35) }) },
  stamp: {
    f: a => ({ s: 1 + .95 * (1 - E.out3(a / .13)), dy: -24 * (1 - E.out3(a / .13)), al: clamp(a / .05), glow: .3 + .9 * bump(a - .12, .04, .45) }),
    fx: (g, a, q, R, t) => ring(g, a, .12, q.x, q.y, q.fs * .35, q.fs * 1.05, FILL.kiro[3], .8, .5, 6),
  },
  type: { f: a => ({ s: 1 + .14 * (1 - E.out3(a / .1)), al: 1, glow: .6 * bump(a, .01, .25) }) },
  key: {
    f: a => ({ dy: 10 * bump(a, .01, .08), al: 1, glow: .7 * bump(a - .05, .02, .3) }),
    fx: (g, a, q) => { const k = 1 - sstep(.3, .7, a), d = 10 * bump(a, .01, .08); if (k <= 0) return; const s = q.fs * 1.12; panel(g, q.x - s / 2, q.y - s / 2 + d, s, s, s * .18, { a: k, shadow: false, top: 'rgba(80,46,160,.75)', bot: 'rgba(30,14,64,.85)', edge: rgba(C.lilac, .8), lw: 3 }); },
  },
  draw: {
    f: a => ({ al: sstep(.22, .5, a), vis: 1, glow: .6 * bump(a - .4, .02, .4) }),
    fx: (g, a, q) => {
      if (a > .7) return; const u = E.io2(a / .46), L = q.fs * 9;
      g.save(); g.translate(q.x, q.y); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.setLineDash([L * u, L]); g.lineWidth = 3.5; g.strokeStyle = rgba(C.cyan, 1 - sstep(.45, .7, a)); g.shadowColor = C.cyan; g.shadowBlur = 12; g.strokeText(q.ch, 0, 0); g.restore();
    },
  },
  queue: {
    f: a => ({ dx: 260 * (1 - E.out5(a / .26)), al: clamp(a / .05), glow: .7 * bump(a - .22, .03, .35) }),
    fx: (g, a, q) => tick(g, q.x + q.fs * .4, q.y + q.fs * .52, 34, E.out3((a - .22) / .2), C.green, 6),
  },
  float: { f: (a, q, R, t) => ({ dy: 60 * (1 - E.out3(a / .6)) + 10 * Math.sin(t * 2.3 + q.k * .9), rot: .05 * Math.sin(t * 1.8 + q.k), al: E.out2(a / .35), blur: 6 * (1 - E.out2(a / .4)), glow: .5 }) },
  badge: {
    f: a => ({ s: a < .3 ? Math.max(.01, E.back(a / .3, 2.2)) : 1, al: clamp(a / .04), glow: .5 * bump(a, .01, .3) }),
    fx: null,
    after: (g, a, q) => { const u = a - .1; if (u < 0) return; const s = E.back(u / .2, 3), x = q.x + q.fs * .44, y = q.y - q.fs * .42, r = q.fs * .16 * s; g.fillStyle = C.red; g.shadowColor = C.red; g.shadowBlur = 16; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.shadowBlur = 0; txt(g, String(q.ti + 1), x, y + 1, r * 1.3, { f: FONT.brico, w: 800, al: 'center' }); },
  },
  dash: {
    f: a => ({ dx: 380 * (1 - E.out5(a / .24)), sx: 1 + .6 * (1 - E.out3(a / .24)), al: clamp(a / .05), glow: .4 + .6 * bump(a - .2, .03, .4) }),
    fx: (g, a, q) => { const k = 1 - sstep(.1, .45, a); if (k <= 0) return; add(g, () => { for (let i = 0; i < 3; i++) { const y = q.y + (i - 1) * q.fs * .26, x0 = q.x + q.fs * .5 + 380 * (1 - E.out5(a / .24)); g.fillStyle = rgba(C.lilac, .5 * k); g.fillRect(x0, y - 3, q.fs * (1.4 - .3 * i) * k, 6); } }); },
  },
  zoom: {
    f: a => ({ s: lerp(2.7, 1, E.out3(a / .22)), al: clamp(a / .08), glow: .5 + 1.2 * bump(a - .2, .04, .5) }),
    fx: (g, a, q) => { const u = (a - .16) / .5; if (u < 0 || u > 1) return; add(g, () => { g.strokeStyle = rgba(C.lav, .8 * (1 - u)); g.lineWidth = 5; g.beginPath(); for (let i = 0; i < 14; i++) { const an = i * TAU / 14 + .2, r0 = q.adv * .55 + 200 * E.out3(u), r1 = r0 + 90 * (1 - u); g.moveTo(q.x + Math.cos(an) * r0, q.y + Math.sin(an) * r0 * .7); g.lineTo(q.x + Math.cos(an) * r1, q.y + Math.sin(an) * r1 * .7); } g.stroke(); }); },
  },
  drop: { f: a => ({ dy: -330 * (1 - E.out5(a / .24)), sy: 1 + .35 * (1 - E.out3(a / .24)), al: clamp(a / .05), glow: .3 + .8 * bump(a - .2, .03, .4) }), fx: (g, a, q, R, t, o) => vtrail(g, q, o, a, -1) },
  lift: { f: a => ({ dy: 330 * (1 - E.out5(a / .24)), sy: 1 + .35 * (1 - E.out3(a / .24)), al: clamp(a / .05), glow: .3 + .8 * bump(a - .2, .03, .4) }), fx: (g, a, q, R, t, o) => vtrail(g, q, o, a, 1) },
  slideL: { f: a => ({ dx: -420 * (1 - E.out5(a / .24)), al: clamp(a / .05), glow: .3 + .8 * bump(a - .2, .03, .4) }), fx: (g, a, q, R, t, o) => trail(g, q, o, a, -1) },
  slideR: { f: a => ({ dx: 420 * (1 - E.out5(a / .24)), al: clamp(a / .05), glow: .3 + .8 * bump(a - .2, .03, .4) }), fx: (g, a, q, R, t, o) => trail(g, q, o, a, 1) },
  scramble: {
    f: (a, q, R, t) => ({ ch: a < .3 ? RAND_CH[(hash(Math.floor(t * 22) + q.ti * 31) * RAND_CH.length) | 0] : null, fam: a < .3 ? FONT.code : null, fill: a < .3 ? 'cyan' : undefined, al: clamp(a / .03), glow: a < .3 ? .6 : .9 * bump(a - .3, .02, .35), s: a < .3 ? .8 : 1 + .12 * bump(a - .3, .01, .12) }),
  },
  flap: {
    f: a => ({ sy: Math.max(.04, E.out3(a / .16)), al: clamp(a / .03), glow: .6 * bump(a - .14, .02, .3) }),
    fx: (g, a, q) => { const w = q.fs * 1.02, h = q.fs * 1.16; g.fillStyle = 'rgba(20,10,44,.86)'; g.beginPath(); g.roundRect(q.x - w / 2, q.y - h / 2, w, h, 12); g.fill(); g.strokeStyle = 'rgba(200,170,255,.35)'; g.lineWidth = 2; g.stroke(); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(q.x - w / 2, q.y - 2, w, 4); },
  },
  bounce: { f: a => ({ dy: -(1 - E.bounce(a / .62)) * 300, sy: 1 - .16 * bump(a - .23, .01, .07), sx: 1 + .1 * bump(a - .23, .01, .07), al: clamp(a / .05), glow: .5 * bump(a - .2, .02, .5) }) },
  run: {
    f: a => ({ dx: 300 * (1 - E.out5(a / .22)), sx: 1 + .4 * (1 - E.out3(a / .22)), al: clamp(a / .05), glow: .4 * bump(a - .18, .02, .3) }),
    row: (g, R, t) => { const a = R.gl[0].t0, b = R.gl[R.n - 1].t0 + .3, u = clamp((t - a) / (b - a)); if (u <= 0) return; const y = R.y + R.size * .66, x0 = R.x0, x1 = R.x1; g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.roundRect(x0, y - 7, x1 - x0, 14, 7); g.fill(); const lg = g.createLinearGradient(x0, 0, x1, 0); lg.addColorStop(0, C.purple); lg.addColorStop(1, C.green); g.fillStyle = lg; g.shadowColor = C.green; g.shadowBlur = 14; g.beginPath(); g.roundRect(x0, y - 7, (x1 - x0) * u, 14, 7); g.fill(); g.shadowBlur = 0; },
  },
  lamp: { f: (a, q) => ({ fill: a < .09 && q.k < 2 ? 'dim' : undefined, al: 1, vis: 1, glow: a < .09 ? 0 : .4 + 1.0 * bump(a - .09, .02, .45), s: 1 + .1 * bump(a - .09, .01, .12) }) },
  lock: {
    f: a => ({ s: a < .25 ? Math.max(.01, E.back(a / .25, 2)) : 1, al: clamp(a / .04), glow: .7 * bump(a - .16, .02, .4) }),
    fx: (g, a, q) => { const k = 1 - sstep(.18, .4, a); if (k <= 0) return; const d = lerp(q.fs * .9, q.fs * .52, E.out3(a / .14)), h = q.fs * .5; g.strokeStyle = rgba(C.lilac, k); g.lineWidth = 7; g.lineJoin = 'round'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(q.x + s * (d - 22), q.y - h); g.lineTo(q.x + s * d, q.y - h); g.lineTo(q.x + s * d, q.y + h); g.lineTo(q.x + s * (d - 22), q.y + h); g.stroke(); } },
  },
  bubble: {
    f: a => ({ rot: .14 * Math.sin(a * 30) * Math.exp(-a * 5), s: 1 + .12 * bump(a - .14, .01, .1), al: clamp(a / .04), glow: .6 * bump(a - .14, .02, .3) }),
    fx: (g, a, q) => {
      const u = (a - .12) / .2, s = q.fs * .7;
      if (u < 1) { const k = u < 0 ? 1 : 1 - u, sc = u < 0 ? E.back(clamp(a / .1), 2) : 1 + .35 * u; g.save(); g.globalAlpha *= k; g.translate(q.x, q.y); g.scale(sc, sc); g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.ellipse(0, 0, s, s * .82, 0, 0, TAU); g.moveTo(-s * .2, s * .7); g.lineTo(-s * .55, s * 1.05); g.lineTo(s * .1, s * .78); g.fill(); g.restore(); }
      burst(g, a, .14, q.x, q.y, { n: 14, v: 900, life: .6, kind: 'spark', size: 6, seed: q.ti + 40, cols: [C.lav, C.pink, C.white] });
    },
  },
  glitch: {
    f: (a, q, R, t) => { const j = a < .36 ? (1 - a / .36) : .25 * kick(t, 1, .06), f = Math.floor(t * 40); return { dx: (hash(f + q.ti * 7) - .5) * 60 * j, dy: (hash(f * 3 + q.ti) - .5) * 16 * j, al: clamp(a / .03), glow: .5 + .5 * kick(t), s: 1 + .06 * j }; },
    fx: (g, a, q, R, t, o) => { const j = a < .36 ? 1 - a / .36 : .3 * kick(t, 1, .08); if (j < .03) return; add(g, () => { for (const [c, d] of [[C.red, -1], [C.cyan, 1]]) { g.save(); g.translate(q.x + (o.dx || 0) + d * 14 * j, q.y + (o.dy || 0)); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(c, .55 * j); g.fillText(q.ch, 0, 0); g.restore(); } }); },
  },
  wipe: {
    f: (a, q, R, t) => { const w = sweepX(t); return { s: 1 + .95 * (1 - E.out3(a / .13)), dy: -24 * (1 - E.out3(a / .13)), al: clamp(a / .05), fill: q.x < w ? 'kiro' : 'red', glow: .4 + .9 * bump(a - .12, .04, .45) }; },
    fx: (g, a, q) => ring(g, a, .12, q.x, q.y, q.fs * .35, q.fs * 1.05, C.purple, .8, .5, 6),
  },
  echo: {
    f: a => ({ s: 1 + .95 * (1 - E.out3(a / .13)), dy: -24 * (1 - E.out3(a / .13)), al: clamp(a / .05), glow: .4 + .9 * bump(a - .12, .04, .45) }),
    fx: (g, a, q) => { const k = 1 - sstep(.1, .9, a); if (k <= 0) return; add(g, () => { [[C.magenta, 1], [C.cyan, 2], [C.purple, 3]].forEach(([c, i]) => { g.save(); g.translate(q.x - i * 16 * k, q.y - i * 10 * k); g.scale(1 + .1 * i * k, 1 + .1 * i * k); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(c, .32 * k / i); g.fillText(q.ch, 0, 0); g.restore(); }); }); },
  },
  colorflip: { f: a => { const u = (a - .26) / .14; return { fill: u < .5 ? 'red' : 'green', sy: u > 0 && u < 1 ? Math.max(.05, Math.abs(Math.cos(Math.PI * u))) : 1, al: clamp(a / .04), glow: .5 + .8 * bump(a - .33, .02, .45), s: a < .2 ? Math.max(.01, E.back(a / .2, 2)) : 1 }; } },
  zap: {
    f: a => ({ fill: 'green', al: clamp(a / .03), s: 1 + .2 * bump(a - .05, .01, .15), glow: .6 + bump(a - .05, .02, .4), rot: -.05 }),
    fx: (g, a, q) => { bolt(g, [q.x + 40, q.y - 420], [q.x, q.y - q.fs * .3], 7 + Math.floor(a * 20), 5, C.lilac, 1 - sstep(.08, .35, a)); },
    after: (g, a, q) => { const u = E.out3((a - .2) / .2); if (u <= 0) return; g.strokeStyle = C.white; g.lineWidth = 8; g.lineCap = 'round'; g.shadowColor = C.green; g.shadowBlur = 16; g.beginPath(); g.moveTo(q.x - q.adv * .55, q.y + 4); g.lineTo(q.x - q.adv * .55 + q.adv * 1.1 * u, q.y - 4); g.stroke(); g.shadowBlur = 0; },
  },
  flip: { f: (a, q) => ({ sx: Math.max(.03, Math.abs(Math.cos((1 - E.out3(a / .3)) * Math.PI))), fill: a < .15 ? 'magenta' : undefined, al: clamp(a / .04), glow: .5 + .8 * bump(a - .25, .03, .4), rot: (q.k % 2 ? 1 : -1) * .1 * (1 - E.out3(a / .3)) }) },
  marquee: {
    f: a => ({ s: a < .3 ? Math.max(.01, E.back(a / .3, 2.4)) : 1, al: clamp(a / .04), glow: .5 * bump(a, .01, .4) }),
    fx: (g, a, q, R, t) => { const k = E.out3(a / .25), r = q.fs * .7 * k, ph = Math.floor(t * 10); for (let j = 0; j < 12; j++) { const an = j * TAU / 12 + q.k, on = (j + ph) % 3 === 0; g.fillStyle = on ? C.gold : 'rgba(255,211,92,.25)'; if (on) { g.shadowColor = C.gold; g.shadowBlur = 12; } g.beginPath(); g.arc(q.x + Math.cos(an) * r, q.y + Math.sin(an) * r, 7, 0, TAU); g.fill(); g.shadowBlur = 0; } },
  },
  wave: { f: (a, q, R, t) => ({ dy: 56 * (1 - E.out3(a / .3)) + 22 * Math.sin(t * TAU * .55 - q.x / 140), rot: .07 * Math.cos(t * TAU * .55 - q.x / 140), al: E.out2(a / .2), glow: .6, fill: q.lat ? 'magenta' : undefined }) },
  snap: {
    f: (a, q) => { const u = E.back(a / .22, 1.6), r1 = hash(q.ti * 17 + 3) - .5, r2 = hash(q.ti * 29 + 7) - .5; return { dx: (1 - u) * r1 * 520, dy: (1 - u) * r2 * 320, rot: (1 - u) * r1 * 1.4, al: clamp(a / .05), fill: q.lat ? 'cyan' : undefined, glow: .4 + .6 * bump(a - .2, .02, .3) }; },
    fx: (g, a, q) => { const k = .25 + .75 * bump(a - .2, .02, .3); if (a < .18) return; const w = q.adv + q.fs * .14, h = q.fs * 1.1; g.strokeStyle = rgba(C.cyan, k); g.lineWidth = 2.5; g.strokeRect(q.x - w / 2, q.y - h / 2, w, h); g.fillStyle = rgba(C.cyan, .12 * k); g.fillRect(q.x - w / 2, q.y - h / 2, w, h); },
  },
  depth: { f: a => ({ s: lerp(.12, 1, E.out3(a / .5)), dy: -140 * (1 - E.out3(a / .5)), al: E.out2(a / .3), blur: 9 * (1 - E.out2(a / .45)), glow: .7 }) },
  sway: { f: (a, q, R, t) => ({ s: a < .28 ? Math.max(.01, E.back(a / .28, 2.4)) : 1, rot: .16 * Math.sin(Math.PI * beatF(t) + (q.k % 2) * Math.PI) * sstep(.1, .5, a), dy: -10 * Math.abs(Math.sin(Math.PI * beatF(t))), al: clamp(a / .04), glow: .5 }) },
  mega: {
    f: a => ({ dy: -560 * (1 - E.out3(a / .16)), sy: 1 - .2 * bump(a - .16, .01, .09), sx: 1 + .12 * bump(a - .16, .01, .09), al: clamp(a / .04), glow: .5 + 1.1 * bump(a - .16, .03, .5) }),
    fx: (g, a, q) => { ring(g, a, .16, q.x, q.y, q.fs * .3, q.fs * 1.2, C.magenta, .85, .55, 7); burst(g, a, .16, q.x, q.y + q.fs * .4, { n: 16, v: 900, life: .7, kind: 'spark', size: 6, seed: q.ti + 70, dir: -Math.PI / 2, spread: 2.6 }); },
  },
  neon: { f: (a, q) => { const fl = a < .32 ? (hash(Math.floor(a * 34) + q.k * 13) > .4 ? 1 : .25) : 1; return { al: clamp(a / .02) * fl, vis: 1, glow: .9 * fl + .3, s: 1 }; } },
  slam: {
    f: a => ({ s: lerp(3.4, 1, E.out3(a / .15)), al: clamp(a / .07), glow: .5 + 1.2 * bump(a - .14, .03, .5) }),
    fx: (g, a, q) => ring(g, a, .14, q.x, q.y, q.fs * .4, q.fs * 1.4, C.cyan, .8, .5, 8),
  },
  rainbow: { f: (a, q, R, t) => ({ s: a < .3 ? Math.max(.01, E.back(a / .3, 2.4)) : 1, al: clamp(a / .04), fill: ['magenta', 'cyan', 'gold', 'kiro'][(q.k + Math.floor(beatF(t))) % 4], glow: .8 }) },
  burst: {
    f: a => ({ s: Math.max(.01, E.elastic(a / .8)), al: clamp(a / .04), glow: .6 + 1.2 * bump(a - .1, .03, .6), fill: 'gold' }),
    fx: (g, a, q, R, t) => { const k = clamp(a / .2) * (1 - sstep(1.2, 1.8, a)); if (k <= 0) return; add(g, () => { g.save(); g.translate(q.x, q.y); g.rotate(t * .8 + q.k); for (let i = 0; i < 10; i++) { g.rotate(TAU / 10); g.fillStyle = rgba(C.gold, .18 * k); g.beginPath(); g.moveTo(0, 0); g.lineTo(q.fs * 1.4, -q.fs * .12); g.lineTo(q.fs * 1.4, q.fs * .12); g.closePath(); g.fill(); } g.restore(); }); },
  },
};
function trail(g, q, o, a, dir) {
  const k = 1 - sstep(.06, .4, a); if (k <= 0) return;
  add(g, () => { for (let i = 1; i <= 3; i++) { g.save(); g.translate(q.x + (o.dx || 0) + dir * i * 46 * k, q.y); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(i % 2 ? C.magenta : C.cyan, .3 * k / i); g.fillText(q.ch, 0, 0); g.restore(); } });
}
function vtrail(g, q, o, a, dir) {
  const k = 1 - sstep(.05, .32, a); if (k <= 0) return;
  add(g, () => { for (let i = 1; i <= 3; i++) { g.save(); g.translate(q.x, q.y + (o.dy || 0) + dir * i * 40 * k); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(i % 2 ? C.magenta : C.cyan, .3 * k / i); g.fillText(q.ch, 0, 0); g.restore(); } });
}
let sweepX = () => -1e4;                                         // the purple wipe of 别慌 (set by the alarm scene)
const EXIT = {
  up: (o, u) => { o.dy = (o.dy || 0) - 70 * E.io2(u); o.al *= 1 - u; o.blur = (o.blur || 0) + 6 * u; },
  fade: (o, u) => { o.al *= 1 - u; },
  zoom: (o, u) => { o.s *= 1 + 1.5 * E.in2(u); o.al *= 1 - E.in2(u); o.blur = (o.blur || 0) + 10 * u; },
  drop: (o, u, q) => { o.dy = (o.dy || 0) + 520 * u * u; o.rot = (o.rot || 0) + (q.k % 2 ? .5 : -.5) * u; o.al *= 1 - sstep(.5, 1, u); },
};
function drawLyrics(g, t, mask) {
  for (const id in LAY) {
    const L = LAY[id], sp = L.sp, first = L.line.tokens[0].start;
    if (t < first - .2) continue;
    const xs = exitAt(L), xd = .34; if (t > xs + xd + .4) continue;
    for (const R of L.rows) {
      const rxs = (sp.outs && sp.outs[R.ri]) || xs;
      if (!mask && STY[R.st] && STY[R.st].row) STY[R.st].row(g, R, t, L);
      for (const q of R.gl) {
        const a = t - (q.t0 - LEAD); if (a < 0) continue;
        const S = STY[(sp.tst && sp.tst[q.ti]) || R.st] || STY.rise;
        const o = Object.assign({ dx: 0, dy: 0, s: 1, sx: 1, sy: 1, rot: 0, al: 1, blur: 0, glow: 0 }, S.f(a, q, R, t, L));
        if (!o.fill) o.fill = fillOf(q, sp);
        const xu = clamp((t - rxs - q.k * .03) / xd);
        if (xu >= 1) continue;
        if (xu > 0) EXIT[sp.ex || 'up'](o, xu, q);
        o.s *= 1 + (sp.br ?? .025) * kick(t) * clamp(a / .35);
        if (!mask && S.fx) withA(g, 1 - xu, () => S.fx(g, a, q, R, t, o));
        drawGlyph(g, q, o, mask);
        if (!mask && S.after) withA(g, 1 - xu, () => { g.save(); S.after(g, a, q, R, t, o); g.restore(); });
      }
      if (R.st === 'type' && !mask) {                            // the caret after the last character typed
        const vis = R.gl.filter(q => t >= q.t0 - LEAD), last = vis[vis.length - 1], end = R.gl[R.n - 1].t0 + .9;
        if (last && t < Math.min(end, rxs) && sinceBeat(t, .5) < SPB * .3) { g.fillStyle = C.lilac; g.shadowColor = C.purple; g.shadowBlur = 14; g.fillRect(last.x + last.adv / 2 + 10, R.y - R.size * .42, R.size * .09, R.size * .84); g.shadowBlur = 0; }
      }
    }
  }
}

// the cyberpunk entrances
Object.assign(STY, {
  // typed at the prompt in the code face: ❯ in front, a block caret after the last character
  terminal: {
    f: a => ({ s: 1 + .1 * (1 - E.out3(a / .08)), al: 1, fill: 'green', glow: .5 * bump(a, .01, .25) }),
    row: (g, R, t) => { const a = t - R.gl[0].t0; if (a < -.05) return; g.save(); g.font = `700 ${R.size * .8}px ${FONT.code}`; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillStyle = KP.p400; g.shadowColor = KP.p500; g.shadowBlur = 16; g.fillText('❯', R.x0 - R.size * .2, R.y); const vis = R.gl.filter(q => t >= q.t0 - LEAD), q = vis[vis.length - 1]; if (q && t < R.gl[R.n - 1].t0 + 1.2 && sinceBeat(t, .5) < SPB * .3) { g.fillStyle = KP.str; g.fillRect(q.x + q.adv / 2 + 8, R.y - R.size * .4, R.size * .5, R.size * .8); } g.restore(); },
  },
  // an inline suggestion: grey ghost text first, accepted on the beat
  suggest: {
    f: a => { const acc = a > .16; return { fill: acc ? 'cream' : 'dim', al: acc ? 1 : .75, vis: 1, s: acc ? 1 + .12 * bump(a - .16, .01, .12) : 1, glow: acc ? .8 * bump(a - .16, .02, .35) : 0 }; },
    after: (g, a, q) => { const u = (a - .16) / .3; if (u < 0 || u > 1) return; g.globalAlpha *= 1 - u; panel(g, q.x - 30, q.y + q.fs * .55, 60, 30, 8, { shadow: false, top: 'rgba(144,70,255,.6)', bot: 'rgba(90,40,180,.7)' }); txt(g, 'Tab', q.x, q.y + q.fs * .55 + 15, 18, { f: FONT.code, al: 'center' }); },
  },
  // a hologram: scanlines, a cyan and pink double image that closes, a flicker
  holo: {
    f: (a, q) => { const fl = a < .3 ? (hash(Math.floor(a * 40) + q.ti * 7) > .3 ? 1 : .35) : 1; return { al: clamp(a / .05) * fl, vis: 1, fill: q.lat ? undefined : 'cyan', glow: .7, sy: 1 + .3 * (1 - E.out3(a / .2)) }; },
    fx: (g, a, q) => { const k = 1 - sstep(.05, .45, a); if (k <= 0) return; add(g, () => { for (const [c, d] of [[KP.vari, -1], [KP.ent, 1]]) { g.save(); g.translate(q.x + d * 22 * k, q.y); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(c, .5 * k); g.fillText(q.ch, 0, 0); g.restore(); } g.fillStyle = rgba(KP.vari, .35 * k); g.fillRect(q.x - q.adv * .7, q.y - q.fs * .6 + q.fs * 1.2 * E.io2(clamp(a / .3)), q.adv * 1.4, 4); }); },
  },
  // glitch slices: the glyph cut into bands that slide back into line
  slice: {
    f: a => ({ al: a < .3 ? 0 : 1, vis: 1, glow: .5 * bump(a - .3, .02, .3) }),
    fx: (g, a, q, R, t, o) => { if (a >= .3) return; const k = 1 - E.out3(a / .3), n = 4; for (let i = 0; i < n; i++) { const y0 = q.y - q.fs * .55 + i * q.fs * 1.1 / n, dx = (hash(q.ti * 13 + i) - .5) * 260 * k; g.save(); g.beginPath(); g.rect(q.x - q.fs, y0, q.fs * 2, q.fs * 1.1 / n + 1); g.clip(); g.translate(q.x + dx, q.y); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = paintFor(g, o.fill, q.fs); g.fillText(q.ch, 0, 0); g.restore(); } },
  },
  // extruded: a stack of copies behind the face, deep then shallow
  extrude: {
    f: a => ({ s: 1 + .5 * (1 - E.out3(a / .16)), al: clamp(a / .05), glow: .3 + .7 * bump(a - .14, .03, .4) }),
    fx: (g, a, q) => { const d = 4 + 10 * (1 - E.out3(a / .3)); for (let i = 7; i >= 1; i--) { g.save(); g.translate(q.x + i * d * .7, q.y + i * d); g.font = `${q.wt} ${q.fs}px ${q.fam}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = mix(KP.p800, KP.p400, i / 7 * .4); g.fillText(q.ch, 0, 0); g.restore(); } },
  },
  // locked on: four corner brackets close in round the glyph, with a hex label
  hud: {
    f: a => ({ s: a < .22 ? Math.max(.01, E.back(a / .22, 2)) : 1, al: clamp(a / .04), glow: .6 * bump(a - .12, .02, .4) }),
    fx: (g, a, q) => { const u = E.out3(a / .2), w = q.adv * lerp(1.9, 1.15, u), h = q.fs * lerp(1.9, 1.18, u), k = 1 - sstep(.6, 1.2, a) * .6; hudFrame(g, q.x - w / 2, q.y - h / 2, w, h, KP.vari, .9 * k, q.fs * .18, 3); if (a < .9) txt(g, '0x' + (q.ti + 10).toString(16).toUpperCase(), q.x - w / 2, q.y - h / 2 - 12, 18, { f: FONT.code, c: KP.vari, a: k }); },
  },
  // a laser scans across and leaves the glyph behind it
  laser: {
    f: (a, q) => ({ al: 1, clipR: q.x - q.adv * .6 + q.adv * 1.2 * E.io2(clamp(a / .14)), glow: .5 * bump(a - .14, .02, .3) }),
    fx: (g, a, q) => { const u = E.io2(clamp(a / .14)), x = q.x - q.adv * .6 + q.adv * 1.2 * u; if (a < .25) add(g, () => { g.fillStyle = rgba(KP.ent, .9 * (1 - a / .25)); g.fillRect(x - 3, q.y - q.fs * .7, 6, q.fs * 1.4); glow(g, x, q.y, q.fs * .6, KP.ent, .6 * (1 - a / .25)); }); },
  },
});
EXIT.glitch = (o, u, q) => { o.dx = (o.dx || 0) + (hash(q.ti * 7 + Math.floor(u * 12)) - .5) * 120 * u; o.al *= 1 - E.in2(u); o.sx = (o.sx || 1) * (1 + .6 * u); o.sy = (o.sy || 1) * (1 - .7 * u); };
