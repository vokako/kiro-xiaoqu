'use strict';
// Kiro 小曲 MV · the drawing kit: maths, beats, buffers, light, the ghost, neon digits, glass, props, the dance floor,
// beams, the mirror ball, the tunnel, particles. Everything is a function of t: no Math.random, no clocks.
const W = 1080, H = 1920, TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, u) => a + (b - a) * u;
const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const io3 = u => { u = clamp(u); return u * u * u * (u * (u * 6 - 15) + 10); };
const E = {
  out2: u => 1 - (1 - clamp(u)) ** 2, out3: u => 1 - (1 - clamp(u)) ** 3, out5: u => 1 - (1 - clamp(u)) ** 5,
  in2: u => clamp(u) ** 2, in3: u => clamp(u) ** 3,
  io2: u => { u = clamp(u); return u < .5 ? 2 * u * u : 1 - 2 * (1 - u) ** 2; },
  back: (u, k = 1.7) => { u = clamp(u) - 1; return 1 + (k + 1) * u ** 3 + k * u ** 2; },
  elastic: u => { u = clamp(u); return u === 0 || u === 1 ? u : Math.pow(2, -10 * u) * Math.sin((u * 10 - .75) * TAU / 3) + 1; },
  bounce: u => { u = clamp(u); const n = 7.5625, d = 2.75; if (u < 1 / d) return n * u * u; if (u < 2 / d) return n * (u -= 1.5 / d) * u + .75; if (u < 2.5 / d) return n * (u -= 2.25 / d) * u + .9375; return n * (u -= 2.625 / d) * u + .984375; },
};
const hash = i => { i = Math.imul((i | 0) ^ 0x9e3779b9, 0x85ebca6b); i ^= i >>> 13; i = Math.imul(i, 0xc2b2ae35); i ^= i >>> 16; return (i >>> 0) / 4294967296; };
const h2 = (a, b) => hash(Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663));
const vnoise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i * 7919 + seed * 104729), hash((i + 1) * 7919 + seed * 104729), u); };
const bump = (u, rise = .1, fall = .5) => (u < 0 ? (u > -rise ? sstep(-rise, 0, u) : 0) : Math.exp(-u / fall));   // light that swells and dies away
const win = (t, a, b, fi = .2, fo = .2) => sstep(a - fi, a, t) * (1 - sstep(b, b + fo, t));                     // on between a and b
// keyframes [[t, v | [v...]], ...] eased from one to the next
const keyed = (t, ks, ease = io3) => {
  const V = v => (Array.isArray(v) ? v : [v]);
  if (t <= ks[0][0]) return V(ks[0][1]);
  for (let i = 1; i < ks.length; i++) if (t < ks[i][0]) { const u = ease((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])), a = V(ks[i - 1][1]), b = V(ks[i][1]); return a.map((v, j) => lerp(v, b[j], u)); }
  return V(ks[ks.length - 1][1]);
};

// ---------- beats (117 BPM; set from cues.json) ----------
let SPB = 60 / 117, B0 = .035;
const setTempo = (bpm, b0) => { SPB = 60 / bpm; B0 = b0; };
const beatF = t => (t - B0) / SPB;
const sinceBeat = (t, every = 1) => { const p = SPB * every; return (((t - B0) % p) + p) % p; };
const kick = (t, every = 1, decay = .14) => { const s = sinceBeat(t, every); return sstep(0, .025, s) * Math.exp(-s / decay); };   // light comes up in a frame and a half, then dies away
const BAR = k => B0 + k * 4 * SPB;
const BEAT = k => B0 + k * SPB;

// ---------- colour ----------
const RGB = {};
const rgb = c => RGB[c] || (RGB[c] = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)));
const rgba = (c, a) => { const v = rgb(c); return `rgba(${v[0]},${v[1]},${v[2]},${clamp(a)})`; };
const mix = (c1, c2, u) => { const a = rgb(c1), b = rgb(c2); u = clamp(u); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], u)).toString(16).padStart(2, '0')).join(''); };
const C = {
  ink: '#07040D', deep: '#0E0620', night: '#170A33', wall: '#1E0B44',
  purple: '#9046FF', violet: '#7A3AE6', lilac: '#C6A2FF', lav: '#E9DEFF', tileT: '#8E48FE', tileB: '#733ACD',
  magenta: '#FF4FD8', pink: '#FF7DC4', cyan: '#57E2FF', gold: '#FFD35C', tea: '#FFD9A3', red: '#FF4A5E', green: '#3CF29C', white: '#FFFFFF',
};
const DISCO = [C.purple, C.magenta, C.cyan, C.pink, C.gold, C.lilac];

// ---------- buffers: one canvas per name, reused every frame ----------
const POOL = new Map();
function buf(name, w = W, h = H) {
  let c = POOL.get(name);
  if (!c) { c = document.createElement('canvas'); c.width = w; c.height = h; POOL.set(name, c); }
  const g = c.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  g.shadowBlur = 0; g.shadowColor = 'rgba(0,0,0,0)'; g.shadowOffsetX = g.shadowOffsetY = 0; g.clearRect(0, 0, c.width, c.height);
  return [c, g];
}
const add = (g, fn) => { g.save(); g.globalCompositeOperation = 'lighter'; fn(); g.restore(); };
const withA = (g, a, fn) => { if (a <= 0.002) return; g.save(); g.globalAlpha *= clamp(a); fn(); g.restore(); };
// src scaled by s so that its point `from` lands at `to`
function put(g, src, from, to, s, rot = 0) { g.save(); g.imageSmoothingQuality = 'high'; g.translate(to[0], to[1]); if (rot) g.rotate(rot); g.scale(s, s); g.translate(-from[0], -from[1]); g.drawImage(src, 0, 0); g.restore(); }

// ---------- light ----------
function glow(g, x, y, r, c, a) {
  if (a <= .002 || r <= 1) return;
  const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, rgba(c, a)); rg.addColorStop(.3, rgba(c, a * .45)); rg.addColorStop(1, rgba(c, 0));
  g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function sparkle(g, x, y, r, c, a) {                             // a four-point star
  if (a <= .01) return;
  g.fillStyle = rgba(c, a); g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r); g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill();
  glow(g, x, y, r * .9, c, a * .45);
}
function vgrad(g, y0, y1, stops) { const lg = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => lg.addColorStop(o, c)); return lg; }
// the room: a deep purple gradient, slow fog, rising dust
function space(g, t, o = {}) {
  const top = o.top || C.ink, bot = o.bot || C.night;
  g.fillStyle = vgrad(g, 0, H, [[0, top], [.55, mix(top, bot, .6)], [1, bot]]); g.fillRect(0, 0, W, H);
  const cols = o.fog || [C.violet, C.purple, C.magenta], fa = o.fogA ?? .16;
  add(g, () => { for (let i = 0; i < 5; i++) glow(g, W * (.1 + .8 * vnoise(t * .06 + i * 3.1, 11 + i)), H * (.1 + .8 * vnoise(t * .05 + i * 1.7 + 9, 21 + i)), 520 + 320 * hash(i * 7 + 3), cols[i % cols.length], fa * (.55 + .45 * hash(i + 5))); });
  if (o.dust !== 0) dust(g, t, o.dust ?? 46, 7, o.dustC || C.lav, o.dustA ?? .5);
}
function dust(g, t, n, seed, col, a = .5, box = [0, 0, W, H], speed = 26) {
  const bh = box[3] - box[1];
  add(g, () => { for (let i = 0; i < n; i++) {
    const x = box[0] + hash(seed + i * 3) * (box[2] - box[0]) + 14 * Math.sin(t * .7 + i), y = box[1] + ((((hash(seed + i * 5 + 1) * bh - speed * t * (.4 + hash(i + seed * 9))) % bh) + bh) % bh);
    const s = 1.2 + 2.6 * hash(i * 7 + seed) ** 2, tw = .45 + .55 * Math.sin(t * (1.3 + 2 * hash(i)) + i);
    g.fillStyle = rgba(col, a * tw); g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill();
  } });
}

// ---------- text ----------
const FONT = { smiley: 'Smiley', brico: 'Brico', sans: '"Sans SC"', mono: 'Mono' };
function txt(g, s, x, y, size, o = {}) {
  g.font = `${o.w ?? 500} ${size}px ${o.f ?? FONT.sans}`; g.textAlign = o.al ?? 'left'; g.textBaseline = o.bl ?? 'middle';
  g.fillStyle = o.c ?? '#fff';
  if (o.a != null && o.a < 1) { if (o.a <= .003) return; g.save(); g.globalAlpha *= o.a; g.fillText(s, x, y); g.restore(); } else g.fillText(s, x, y);
}
const twidth = (g, s, size, f = FONT.sans, w = 500) => { g.font = `${w} ${size}px ${f}`; return g.measureText(s).width; };

// ---------- the ghost: kiro.dev/icon.svg, bent by a state ----------
let GB = null;                                                   // ghost_geom.json (icon units, 1200)
const GHOST_H = () => GB.bottom - GB.top;
function ghostBody(st) {
  const P = GB.body, fl = st.fl || 0, ph = st.fph || 0, wv = st.wave || 0, out = new Path2D();
  for (let i = 0; i < P.length; i++) {
    let x = P[i][0], y = P[i][1];
    if (fl) { const w = sstep(560, GB.bottom, y) ** 1.4; x += fl * w * Math.sin(ph - (y - 560) / 160); y += .35 * fl * w * Math.sin(2 * ph - x / 90); }
    if (wv) { const w = Math.exp(-((x - 292) ** 2 + (y - 792) ** 2) / (2 * 62 * 62)); x -= .45 * 60 * wv * w; y -= 60 * wv * w; }
    i ? out.lineTo(x, y) : out.moveTo(x, y);
  }
  out.closePath(); return out;
}
function eyePath(E0, c, sx, sy, dx, dy) { const p = new Path2D(); E0.forEach(([x, y], i) => { const X = c[0] + (x - c[0]) * sx + dx, Y = c[1] + (y - c[1]) * sy + dy; i ? p.lineTo(X, Y) : p.moveTo(X, Y); }); p.closePath(); return p; }
function arcLine(g, cx, cy, w, h, lw) { g.beginPath(); for (let i = 0; i <= 16; i++) { const u = i / 8 - 1; const x = cx + w * u, y = cy + h * (1 - u * u); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.lineWidth = lw; g.lineCap = 'round'; g.stroke(); }
// draw the ghost with its foot (bottom centre) at screen (x, y), body h px tall. st: sx sy (squash about the foot),
// rot (lean about the foot), flip (-1..1 facing), fl/fph (hem flutter), wave (-1..1 the little hand), look [x, y] (units),
// blink 0..1, eyes ('oval' | 'happy' | 'sleep' | 'big' | 'shock' | 'flat' | 'wink' | 'none'), a, glow (0..1), gc (glow colour), body / ink colours
function drawGhost(g, x, y, h, st = {}) {
  const k = h / GHOST_H(), FY = GB.foot[1];
  g.save(); if (st.a != null) g.globalAlpha *= clamp(st.a);
  g.translate(x, y); g.scale(k, k);
  if (st.rot) g.rotate(st.rot);
  g.scale((st.sx ?? 1) * (st.flip ?? 1), st.sy ?? 1); g.translate(-600, -FY);
  const body = ghostBody(st);
  if (st.glow) { g.shadowColor = rgba(st.gc || C.purple, .85 * clamp(st.glow)); g.shadowBlur = 70 * st.glow * Math.min(1, k * 2.2) + 8; }
  if (st.body) g.fillStyle = st.body;
  else { const lg = g.createLinearGradient(0, GB.top, 0, GB.bottom); lg.addColorStop(0, '#ffffff'); lg.addColorStop(.62, '#fbf8ff'); lg.addColorStop(1, st.hem || '#e4d6ff'); g.fillStyle = lg; }
  g.fill(body); g.shadowBlur = 0; g.shadowColor = 'rgba(0,0,0,0)';
  if (st.rim) { g.lineWidth = 14; g.strokeStyle = rgba(st.rim, .9); g.stroke(body); }
  const eyes = st.eyes || 'oval';
  if (eyes !== 'none') {
    const ink = st.ink || '#0b0614', lk = st.look || [0, 0], bl = clamp(st.blink || 0);
    g.fillStyle = ink; g.strokeStyle = ink;
    for (let j = 0; j < 2; j++) {
      const c = GB.eye_c[j], E0 = GB.eyes[j], cx = c[0] + lk[0], cy = c[1] + lk[1], inner = j ? -1 : 1;
      let ev = eyes; if (ev === 'wink') ev = j ? 'happy' : 'oval';
      if (ev === 'oval' || ev === 'big') {
        const s = ev === 'big' ? 1.3 : 1, sy = s * Math.max(.07, 1 - bl);
        g.fill(eyePath(E0, c, s, sy, lk[0], lk[1]));
        if (ev === 'big' && bl < .5) { g.fillStyle = '#fff'; g.beginPath(); g.arc(cx - 14, cy - 34, 19, 0, TAU); g.fill(); g.beginPath(); g.arc(cx + 15, cy + 30, 9, 0, TAU); g.fill(); g.fillStyle = ink; }
      } else if (ev === 'happy') arcLine(g, cx, cy + 14, 36, -34, 24);
      else if (ev === 'sleep') arcLine(g, cx, cy + 6, 36, 10, 20);
      else if (ev === 'flat') { g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 34, cy + 4); g.lineTo(cx + 34, cy + 4 - 6 * inner); g.stroke(); }
      else if (ev === 'laugh') { g.lineWidth = 22; g.lineCap = g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx - 26 * inner, cy - 30); g.lineTo(cx + 24 * inner, cy); g.lineTo(cx - 26 * inner, cy + 30); g.stroke(); }
      else if (ev === 'heart') { const r = 54 * (1 + .14 * Math.sin(st.eph || 0)), p = new Path2D(); for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, x = 16 * Math.sin(a) ** 3, y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) - 2.5; i ? p.lineTo(cx + x * r / 16, cy + y * r / 16) : p.moveTo(cx + x * r / 16, cy + y * r / 16); } g.fillStyle = '#ff4f8b'; g.fill(p); g.fillStyle = ink; }
      else if (ev === 'spiral') { g.lineWidth = 11; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * 2.3 * TAU, r = 3 + 46 * i / 60, ph = (st.eph || 0) * (j ? -1 : 1); i ? g.lineTo(cx + r * Math.cos(a + ph), cy + r * Math.sin(a + ph)) : g.moveTo(cx + r * Math.cos(a + ph), cy + r * Math.sin(a + ph)); } g.stroke(); }
      else if (ev === 'angry' || ev === 'half') { const p = new Path2D(); E0.forEach(([x, y], i) => { const X = x + lk[0], Y0 = y + lk[1], Y = ev === 'angry' ? Math.max(Y0, cy - 36 + .95 * inner * (X - cx)) : Math.max(Y0, cy - 4); i ? p.lineTo(X, Y) : p.moveTo(X, Y); }); p.closePath(); g.fill(p); if (ev === 'half') { g.lineWidth = 14; g.beginPath(); g.moveTo(cx - 46, cy - 4); g.lineTo(cx + 46, cy - 4); g.stroke(); } }
      else if (ev === 'cry') { g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 34, cy + 8 * inner); g.lineTo(cx + 34, cy - 8 * inner); g.stroke(); const d = ((st.eph || 0) * .5 + j * .4) % 1; g.fillStyle = '#7fd6ff'; g.beginPath(); g.ellipse(cx + 6, cy + 40 + 90 * d, 12, 18, 0, 0, TAU); g.fill(); g.fillStyle = ink; }
      else if (ev === 'confused') { if (j === 0) g.fill(eyePath(E0, c, 1.1, 1.1, lk[0], lk[1])); else g.fill(eyePath(E0, c, 1, .42, lk[0], lk[1] - 8)); }
      else if (ev === 'star') { const r = 50 * (1 + .12 * Math.sin(st.eph || 0)); g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .38 : r; i ? g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.fill(); }
      else if (ev === 'shock') { g.beginPath(); g.arc(cx, cy, 48, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, 33, 0, TAU); g.fill(); g.fillStyle = ink; g.beginPath(); g.arc(cx, cy, 12, 0, TAU); g.fill(); }
    }
    if (st.blush) { g.fillStyle = rgba('#ff8fc0', .55 * st.blush); for (const [ex, sd] of [[GB.eye_c[0][0], -1], [GB.eye_c[1][0], 1]]) { g.beginPath(); g.ellipse(ex + sd * 60 + lk[0] * .5, 592 + lk[1] * .5, 40, 21, 0, 0, TAU); g.fill(); } }
  }
  g.restore();
}
// a dance: bounce on every beat (squash on the beat, stretch on the way up), sway every two beats, the hem flutters
function groove(t, o = {}) {
  const bf = beatF(t + (o.lag || 0)), p = bf - Math.floor(bf), amp = o.amp ?? 1;
  const contact = Math.exp(-p / .09) + Math.exp(-(1 - p) / .045);
  const sy = 1 - .085 * amp * contact + .05 * amp * Math.sin(Math.PI * p) * (1 - contact);
  return {
    dy: -(o.hop ?? 26) * amp * Math.sin(Math.PI * p) ** 1.4, dx: (o.swayX ?? 16) * amp * Math.sin(Math.PI * bf / 2),
    st: { sy, sx: 1 + .75 * (1 - sy), rot: (o.lean ?? .07) * amp * Math.sin(Math.PI * bf / 2 + .4), fl: (o.fl ?? 16) * (.6 + .4 * amp), fph: t * TAU * 1.1 + (o.ph || 0), blink: blinkAt(t, o.seed || 1) },
  };
}
function blinkAt(t, seed = 1) { const P = 2.9 + seed * .37, k = Math.floor((t + seed * 1.3) / P), u = t + seed * 1.3 - k * P - (.6 + 1.6 * hash(k * 13 + seed)); return u > 0 && u < .16 ? Math.sin(Math.PI * u / .16) : 0; }
// the official app icon: the rounded tile with its gradient and the ghost on it, centred at (cx, cy), size px wide
function drawIcon(g, cx, cy, size, st = {}) {
  const k = size / 1200, x0 = cx - size / 2, y0 = cy - size / 2;
  g.save(); if (st.a != null) g.globalAlpha *= clamp(st.a);
  if (st.glow) { g.shadowColor = rgba(C.purple, .9 * st.glow); g.shadowBlur = 120 * st.glow; }
  const lg = g.createLinearGradient(0, y0, 0, y0 + size); lg.addColorStop(0, C.tileT); lg.addColorStop(1, C.tileB);
  g.fillStyle = lg; g.beginPath(); g.roundRect(x0, y0, size, size, 260 * k); g.fill(); g.restore();
  if (st.ghost !== false) drawGhost(g, x0 + 600 * k + (st.dx || 0), y0 + GB.foot[1] * k + (st.dy || 0), GHOST_H() * k, { body: '#ffffff', ink: '#000000', ...st.gs, a: st.a });
}

// ---------- glass ----------
function panel(g, x, y, w, h, r, o = {}) {
  g.save(); if (o.a != null) g.globalAlpha *= clamp(o.a);
  g.beginPath(); g.roundRect(x, y, w, h, r);
  if (o.shadow !== false) { g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 50; g.shadowOffsetY = 20; }
  g.fillStyle = vgrad(g, y, y + h, [[0, o.top || 'rgba(62,34,128,.62)'], [1, o.bot || 'rgba(22,11,50,.78)']]); g.fill();
  g.shadowColor = 'rgba(0,0,0,0)'; g.shadowBlur = 0; g.shadowOffsetY = 0;
  if (o.hot) { g.shadowColor = rgba(o.hotC || C.purple, o.hot); g.shadowBlur = 40; }
  g.lineWidth = o.lw ?? 2.5; g.strokeStyle = o.edge || 'rgba(205,175,255,.42)'; g.stroke(); g.shadowBlur = 0;
  g.clip(); const sh = g.createLinearGradient(x, y, x + w * .5, y + h * .6); sh.addColorStop(0, 'rgba(255,255,255,.11)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.fillRect(x, y, w, h);
  g.restore();
}
// a tick drawn up to p (0..1)
function tick(g, x, y, s, p, col, lw) {
  if (p <= 0) return;
  const A = [x - .42 * s, y + .02 * s], B = [x - .12 * s, y + .3 * s], Cc = [x + .45 * s, y - .32 * s], l1 = Math.hypot(B[0] - A[0], B[1] - A[1]), l2 = Math.hypot(Cc[0] - B[0], Cc[1] - B[1]), d = p * (l1 + l2);
  g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = g.lineJoin = 'round'; g.beginPath(); g.moveTo(A[0], A[1]);
  if (d <= l1) g.lineTo(lerp(A[0], B[0], d / l1), lerp(A[1], B[1], d / l1)); else { g.lineTo(B[0], B[1]); const u = (d - l1) / l2; g.lineTo(lerp(B[0], Cc[0], u), lerp(B[1], Cc[1], u)); }
  g.stroke(); g.restore();
}
function cross(g, x, y, s, col, lw) { g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - s, y - s); g.lineTo(x + s, y + s); g.moveTo(x + s, y - s); g.lineTo(x - s, y + s); g.stroke(); g.restore(); }
// an idea: a light bulb (radius r of the glass), lit 0..1
function bulb(g, x, y, r, lit, t) {
  if (lit > .01) add(g, () => { glow(g, x, y, r * 6, C.gold, .35 * lit); glow(g, x, y, r * 2.4, '#fff3c4', .55 * lit); });
  g.save(); g.lineJoin = 'round';
  const p = new Path2D(); p.arc(x, y, r, Math.PI * .78, Math.PI * .22); p.lineTo(x + r * .38, y + r * 1.05); p.lineTo(x - r * .38, y + r * 1.05); p.closePath();
  g.fillStyle = lit > .01 ? rgba(mix('#4a3a70', '#fff6cf', lit), .95) : 'rgba(80,60,130,.6)'; g.fill(p);
  g.lineWidth = r * .09; g.strokeStyle = rgba(mix(C.lilac, '#ffffff', lit), .9); g.stroke(p);
  g.fillStyle = mix('#8a7ab0', '#d9cfee', lit); for (let i = 0; i < 3; i++) { g.beginPath(); g.roundRect(x - r * .42, y + r * (1.1 + i * .22), r * .84, r * .16, r * .06); g.fill(); }
  g.strokeStyle = rgba(mix('#b49be0', '#ff9d2e', lit), 1); g.lineWidth = r * .07; g.beginPath(); g.moveTo(x - r * .22, y + r * .9); g.lineTo(x - r * .22, y + r * .1); g.lineTo(x, y + r * .35); g.lineTo(x + r * .22, y + r * .1); g.lineTo(x + r * .22, y + r * .9); g.stroke();
  g.restore();
}
// the save icon, s px
function floppy(g, x, y, s, col = C.lilac) {
  const h = s / 2; g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(x - h, y - h + s * .1); g.quadraticCurveTo(x - h, y - h, x - h + s * .1, y - h); g.lineTo(x + h - s * .2, y - h); g.lineTo(x + h, y - h + s * .2); g.lineTo(x + h, y + h - s * .1); g.quadraticCurveTo(x + h, y + h, x + h - s * .1, y + h); g.lineTo(x - h + s * .1, y + h); g.quadraticCurveTo(x - h, y + h, x - h, y + h - s * .1); g.closePath(); g.fill();
  g.fillStyle = C.deep; g.fillRect(x - s * .26, y - h, s * .46, s * .3); g.fillStyle = col; g.fillRect(x + s * .06, y - h + s * .05, s * .1, s * .2);
  g.fillStyle = C.deep; g.beginPath(); g.roundRect(x - s * .32, y + s * .04, s * .64, s * .4, s * .04); g.fill(); g.restore();
}
// a bug, crawling (phase ph), facing ang
function bugIcon(g, x, y, s, ang, ph, col = '#9cff7a') {
  g.save(); g.translate(x, y); g.rotate(ang); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = s * .07; g.lineCap = 'round';
  for (let i = -1; i <= 1; i++) for (const sd of [-1, 1]) { const w = Math.sin(ph * 9 + i * 2 + (sd > 0 ? Math.PI : 0)) * .12; g.beginPath(); g.moveTo(i * s * .2, 0); g.lineTo(i * s * .25 + w * s, sd * s * .55); g.stroke(); }
  g.beginPath(); g.ellipse(0, 0, s * .42, s * .3, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(s * .45, 0, s * .17, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(s * .55, -s * .08); g.lineTo(s * .8, -s * .3); g.moveTo(s * .55, s * .08); g.lineTo(s * .8, s * .3); g.stroke();
  g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = s * .04; g.beginPath(); g.moveTo(-s * .38, 0); g.lineTo(s * .36, 0); g.stroke(); g.restore();
}
// a lightning bolt from a to b
function bolt(g, a, b, seed, w, col, al) {
  if (al <= .01) return; const n = 9, pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n, j = i && i < n ? (hash(seed * 31 + i) - .5) * 70 : 0, nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny) || 1; pts.push([lerp(a[0], b[0], u) + nx / L * j, lerp(a[1], b[1], u) + ny / L * j]); }
  const path = () => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); };
  add(g, () => { g.lineJoin = 'round'; g.strokeStyle = rgba(col, .35 * al); g.lineWidth = w * 4; path(); g.stroke(); g.strokeStyle = rgba('#ffffff', al); g.lineWidth = w; path(); g.stroke(); });
}

// ---------- particles ----------
// a burst at t0 from (x, y): o.n pieces, o.v speed, o.dir/o.spread, o.cols; confetti (o.kind 'paper') or sparks
function burst(g, t, t0, x, y, o = {}) {
  const a = t - t0, life = o.life ?? 2.6; if (a < 0 || a > life) return;
  const n = o.n ?? 40, seed = o.seed ?? 1, cols = o.cols || DISCO, kd = 2.6, VT = o.vt ?? 260, fade = 1 - sstep(life * .65, life, a);
  for (let i = 0; i < n; i++) {
    const r1 = hash(seed * 7919 + i), r2 = hash(seed * 31 + i * 17 + 3), r3 = hash(i * 131 + seed), r4 = hash(i * 7 + seed * 3 + 1);
    const ang = (o.dir ?? -Math.PI / 2) + (r1 - .5) * (o.spread ?? TAU), v = (o.v ?? 1200) * (.3 + .7 * r2), d = v * (1 - Math.exp(-kd * a)) / kd;
    const px = x + Math.cos(ang) * d + (o.kind === 'spark' ? 0 : 26 * Math.sin(a * (2.5 + 3 * r3) + i)), py = y + Math.sin(ang) * d + VT * Math.max(0, a - (1 - Math.exp(-2 * a)) / 2);
    const col = cols[i % cols.length];
    if (o.kind === 'spark') { const s = (o.size ?? 5) * (.5 + r4) * (1 - a / life); g.fillStyle = rgba(col, fade); g.beginPath(); g.arc(px, py, s, 0, TAU); g.fill(); continue; }
    const s = (o.size ?? 16) * (.6 + .7 * r4);
    g.save(); g.translate(px, py); g.rotate(a * (2 + 6 * r3) + i); g.scale(1, Math.cos(a * (5 + 7 * r4) + i * 1.7)); g.globalAlpha *= fade; g.fillStyle = col; g.fillRect(-s / 2, -s * .3, s, s * .6); g.restore();
  }
}
// a ring of light from (x, y) at t0
function ring(g, t, t0, x, y, r0, r1, col, a = 1, dur = .55, lw = 8) {
  const u = (t - t0) / dur; if (u < 0 || u > 1) return; const e = E.out3(u);
  add(g, () => { g.strokeStyle = rgba(col, a * (1 - u) ** 1.5); g.lineWidth = lw * (1 - .6 * u); g.beginPath(); g.arc(x, y, lerp(r0, r1, e), 0, TAU); g.stroke(); });
}

// ---------- the dance floor: tiles in perspective. lit(i, j) -> [colour, alpha] | null, j counts rows from the camera ----------
function floor(g, o) {
  const hy = o.hy, cx = o.cx ?? 540, D = o.D ?? 900, f = o.f ?? 1000, tw = o.tw ?? .55, dz = o.dz ?? .55, z0 = o.z0 ?? .5, rows = o.rows ?? 22, cols = o.cols ?? 7, scroll = o.scroll || 0;
  const P = (X, Z) => [cx + f * X / Z, hy + D / Z], zFar = z0 + rows * dz, off = ((scroll % dz) + dz) % dz, base = Math.floor(scroll / dz);
  g.fillStyle = vgrad(g, hy, H, [[0, o.far || '#160833'], [1, o.near || '#0a0418']]); g.fillRect(0, hy, W, H - hy);
  add(g, () => {
    for (let j = rows - 1; j >= 0; j--) {
      const za = z0 + j * dz - off, zb = za + dz; if (za < .12) continue;
      const fogA = clamp(1.25 - za / zFar), jj = j + base;
      for (let i = -cols; i < cols; i++) {
        const L = o.lit(i, jj, za); if (!L || L[1] <= .01) continue;
        const ins = .06, x0 = (i + ins) * tw, x1 = (i + 1 - ins) * tw, a1 = P(x0, za + dz * ins), b1 = P(x1, za + dz * ins), c1 = P(x1, zb - dz * ins), d1 = P(x0, zb - dz * ins);
        g.fillStyle = rgba(L[0], L[1] * fogA); g.beginPath(); g.moveTo(a1[0], a1[1]); g.lineTo(b1[0], b1[1]); g.lineTo(c1[0], c1[1]); g.lineTo(d1[0], d1[1]); g.closePath(); g.fill();
      }
    }
    g.strokeStyle = rgba(o.line || C.purple, o.la ?? .28); g.lineWidth = 2; g.beginPath();
    for (let i = -cols; i <= cols; i++) { const a = P(i * tw, Math.max(.12, z0 - off)), b = P(i * tw, zFar); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
    for (let j = 0; j <= rows; j++) { const z = z0 + j * dz - off; if (z < .12) continue; const a = P(-cols * tw, z), b = P(cols * tw, z); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
    g.stroke();
  });
  const hz = g.createLinearGradient(0, hy - 60, 0, hy + 260); hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(.25, rgba(o.haze || C.violet, .35)); hz.addColorStop(1, 'rgba(0,0,0,0)');
  add(g, () => { g.fillStyle = hz; g.fillRect(0, hy - 60, W, 320); });
  return P;
}
// a moving-head beam: a soft cone from (x, y) toward angle ang (0 = straight down)
function beam(g, x, y, ang, len, w0, w1, col, a) {
  if (a <= .01) return;
  const dx = Math.sin(ang), dy = Math.cos(ang), nx = dy, ny = -dx, ex = x + dx * len, ey = y + dy * len;
  for (const [k, aa] of [[1, .45], [.38, 1]]) {
    const lg = g.createLinearGradient(x, y, ex, ey); lg.addColorStop(0, rgba(col, a * aa)); lg.addColorStop(.55, rgba(col, a * aa * .4)); lg.addColorStop(1, rgba(col, 0));
    g.fillStyle = lg; g.beginPath(); g.moveTo(x + nx * w0 * k, y + ny * w0 * k); g.lineTo(ex + nx * w1 * k, ey + ny * w1 * k); g.lineTo(ex - nx * w1 * k, ey - ny * w1 * k); g.lineTo(x - nx * w0 * k, y - ny * w0 * k); g.closePath(); g.fill();
  }
  glow(g, x, y, w0 * 5, col, a * .8);
}
// the tunnel: frames shaped like the icon's tile rushing at the camera; travel = distance flown (frames 1 apart)
function tunnel(g, t, o) {
  const cx = o.cx ?? 540, cy = o.cy ?? 860, n = o.n ?? 16, tr = o.travel, a = o.a ?? 1, cols = o.cols || [C.purple, C.magenta], tw = o.twist || 0;
  const ph = ((tr % 1) + 1) % 1, base = Math.floor(tr);
  add(g, () => {
    glow(g, cx, cy, 520, o.core || C.lilac, .5 * a);
    for (let k = n - 1; k >= 0; k--) {
      const z = k + 1 - ph; if (z < .12) continue;
      const s = 820 / z, al = a * clamp(1.5 - z / n * 1.5) * clamp((z - .12) * 2.5), idx = k + base, col = cols[((idx % cols.length) + cols.length) % cols.length];
      g.save(); g.translate(cx, cy); g.rotate(tw * (idx * .22 + t * .4)); g.strokeStyle = rgba(col, al * .35); g.lineWidth = Math.max(2, 70 / z); g.beginPath(); g.roundRect(-s, -s, 2 * s, 2 * s, s * .43); g.stroke();
      g.strokeStyle = rgba(mix(col, '#ffffff', .6), al); g.lineWidth = Math.max(1.2, 16 / z); g.stroke(); g.restore();
    }
    const sp = o.speed ?? 1;
    for (let i = 0; i < (o.streaks ?? 70); i++) {
      const ang = hash(i * 13 + 5) * TAU, u = ((hash(i * 3 + 1) + tr * (.25 + .3 * hash(i * 7))) % 1), r0 = 60 + 1300 * u * u, len = (40 + 260 * u) * sp;
      g.strokeStyle = rgba(cols[i % cols.length], .55 * a * u); g.lineWidth = 1.5 + 3 * u; g.beginPath(); g.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0); g.lineTo(cx + Math.cos(ang) * (r0 + len), cy + Math.sin(ang) * (r0 + len)); g.stroke();
    }
  });
}
