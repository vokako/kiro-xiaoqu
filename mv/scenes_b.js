'use strict';
// Kiro 小曲 MV · the three choruses on a rainy street in the city, each one fuller: four lasers and the pad; then
// the holographic core, a laser fan and the ghost's afterimages; then the whole Kiro Crew, tagged and linked.
const HY = 1080;                                                 // the horizon of the street
const EXPR = ['happy', 'laugh', 'heart', 'star', 'wink', 'oval'];
function hero(g, x, y, h, st, refl = .2) {
  if (refl > 0) { g.save(); g.translate(0, 2 * y + 6); g.scale(1, -1); g.globalAlpha = refl; drawGhost(g, x, y, h, { ...st, glow: 0, eyes: 'none' }); g.restore(); }
  add(g, () => glow(g, x, y + 10, h * .9, KP.p500, .35));
  drawGhost(g, x, y, h, st);
}
const spinAt = (t, t0, d = .75) => { const u = (t - t0) / d; if (u <= 0 || u >= 1) return 1; const c = Math.cos(TAU * E.io2(u)); return Math.sign(c || 1) * Math.max(.18, Math.abs(c)); };
const turnAt = (t, t0, d = .45) => { const c = Math.cos(Math.PI * E.io2(clamp((t - t0) / d))); return Math.sign(c || 1) * Math.max(.18, Math.abs(c)); };
const jumpArc = (t, t0, h, d = .42) => { const u = (t - t0) / d; return u > 0 && u < 1 ? -h * Math.sin(Math.PI * u) : 0; };
const camBump = (g, t, c = [540, 900], amt = .012) => { const s = 1 + amt * kick(t, 4, .22); g.translate(c[0], c[1]); g.scale(s, s); g.translate(-c[0], -c[1]); };
const exprAt = (t, seed, base = 'happy') => (hash(seed) < .45 ? base : EXPR[(Math.floor(beatF(t) / 4) + Math.floor(hash(seed) * 6)) % EXPR.length]);
const ephAt = t => t * 6;
function tag(g, x, y, s, col = KP.p300, a = 1) {
  g.save(); g.globalAlpha *= a; g.font = `400 22px ${FONT.code}`; const w = g.measureText(s).width + 26;
  g.fillStyle = 'rgba(9,9,11,.75)'; g.beginPath(); g.roundRect(x - w / 2, y - 18, w, 36, 18); g.fill(); g.strokeStyle = rgba(col, .85); g.lineWidth = 2; g.stroke();
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, x, y + 1); g.restore();
}
function cityClub(g, t, lv) { city(g, t, { signA: .9, rainA: .14 + .04 * lv, seed: lv * 3, lift: 120 }); add(g, () => glow(g, 540, HY - 160, 760, lv > 2 ? KP.ent : KP.p500, .18 + .1 * kick(t))); }

// ---------- chorus 1 ----------
const c1x = t => keyed(t, [[36.62, 540], [36.95, 372], [37.7, 372], [38.03, 708], [38.95, 708], [39.4, 540], [42.9, 540], [43.5, 330]])[0];
const c1Dive = t => io3((t - 43.3) / 1.0), C1_TILE = [690, 1566];
function sClub1(g, t) {
  const dv = c1Dive(t);
  g.save(); g.translate(C1_TILE[0], C1_TILE[1]); g.scale(1 + .3 * dv, 1 + .3 * dv); g.translate(-C1_TILE[0], -C1_TILE[1]); camBump(g, t);
  const dr = 1 + .05 * sstep(28.8, 43.3, t); g.translate(540 + 14 * Math.sin(Math.PI * beatF(t) / 8), 1100); g.scale(dr, dr); g.translate(-540, -1100);
  cityClub(g, t, 1);
  const tC = T('L10', 0), rise = E.out3((t - tC + .3) / .6);
  if (rise > 0) {                                                // 18:00 rises behind the street like a sign switching on
    const y = lerp(HY + 120, 820, rise), d = t < T('L10', 3) ? (t < T('L10', 2) ? '17:58' : '17:59') : '18:00', hot = bump(t - T('L10', 3), .02, .6);
    g.save(); g.beginPath(); g.rect(0, 0, W, HY); g.clip(); hudClock(g, d, 540, y, 190, { col: hot > .05 ? KP.rx : KP.p300, hot, label: 'LOCAL TIME · 下班' }); g.restore();
  }
  lasers(g, t, 1);
  street(g, t, 1, { cx: c1x(t), py: 1352 });
  const gr = groove(t, { amp: 1, hop: 30, seed: 7 }), x = c1x(t), jy = jumpArc(t, 36.62, 90, .4) + jumpArc(t, 37.7, 90, .4) + jumpArc(t, 38.95, 60, .45);
  const tK = T('L07', 4), wave = t > T('L10', 4) ? Math.sin((t - T('L10', 4)) * TAU * 1.9) : 0;
  const eyes = t > tK - .05 && t < tK + .9 ? 'star' : t > T('L10', 3) ? 'heart' : t > T('L09', 0) - .1 && t < 39.5 ? 'laugh' : Math.floor(beatF(t) / 4) % 2 ? 'happy' : 'wink';
  hero(g, x + gr.dx, 1352 + gr.dy + jy, 400, { ...gr.st, flip: spinAt(t, tK - .1), eyes, eph: ephAt(t), wave, glow: .7 + .5 * bump(t - tK, .02, .5), look: [x < 500 ? -18 : x > 580 ? 18 : 0, -6] });
  const tb = T('L08', 2), tm = T('L08', 4);                     // 一句想法: an idea, 变成计划: it turns into a checklist
  if (t > tb - .05 && t < 36.5) {
    const out = 1 - sstep(36.0, 36.4, t), u = io3((t - tm + .05) / .32), bx = 540, by = 780;
    if (u < 1) { g.save(); g.translate(bx, by); const s = E.back((t - tb + .05) / .3, 2.2) * (1 - u); g.scale(s, s); bulb(g, 0, 0, 52, clamp((t - T('L08', 3)) / .1) * .9 + .1, t); g.restore(); }
    if (u > 0) {
      g.save(); g.globalAlpha = out; g.translate(bx, by); g.scale(u, u); panel(g, -190, -140, 380, 280, 24, { hot: .6, hotC: KP.vari, edge: rgba(KP.vari, .7), top: 'rgba(20,40,60,.6)', bot: 'rgba(10,14,30,.8)' });
      txt(g, 'tasks.md', -160, -105, 22, { f: FONT.code, c: KP.vari });
      for (let i = 0; i < 3; i++) { const tt = T('L08', 5 + i); g.strokeStyle = KP.vari; g.lineWidth = 3; g.beginPath(); g.roundRect(-160, -70 + i * 70, 36, 36, 8); g.stroke(); tick(g, -142, -52 + i * 70, 30, E.out3((t - tt) / .18), KP.str, 6); txt(g, ['建表', '接口', '页面'][i], -106, -52 + i * 70, 30, { w: 700, c: t > tt ? '#ffffff' : KP.g400 }); }
      g.restore();
    }
  }
  burst(g, t, tK, 540, 900, { n: 50, v: 1500, life: 2.2, seed: 11, spread: 2.2 });
  if (t > 43.25) {                                               // the light the camera dives into
    const u = clamp((t - 43.25) / 1.0); add(g, () => { glow(g, C1_TILE[0], C1_TILE[1], 120 + 300 * u, KP.vari, .5 + .5 * u); glow(g, C1_TILE[0], C1_TILE[1], 40 + 60 * u, '#ffffff', .8 * u); });
  }
  g.restore();
  return {};
}

// ---------- chorus 2 ----------
const ballY2 = t => lerp(-320, 210, E.out3((t - 69.6) / 1.1));
const c2x = t => keyed(t, [[77.4, 540], [77.7, 720], [78.75, 720], [79.05, 360], [80.2, 360], [80.7, 540]])[0];
const LAMPS = [270, 430, 650, 810], BUGS = [0, 1, 2, 3, 4, 5];
const bugBurst = j => T('L18', 5 + (j % 3));
function sClub2(g, t) {
  const dv = io3((t - 84.6) / 1.3), by = ballY2(t);
  g.save(); g.translate(540, by); g.scale(1 + .5 * dv * dv, 1 + .5 * dv * dv); g.translate(-540, -by); camBump(g, t);
  const dr = 1 + .04 * Math.sin(Math.PI * clamp((t - 69.8) / 14.5)); g.translate(540 + 22 * Math.sin(Math.PI * beatF(t) / 8), 1100); g.scale(dr, dr); g.translate(-540, -1100);
  cityClub(g, t, 2);
  if (t > 73.0 && t < 77.3) {                                   // 红灯变绿: four test lights in a HUD rack
    const a = sstep(73.0, 73.3, t) * (1 - sstep(76.9, 77.3, t));
    withA(g, a, () => { hudFrame(g, 200, 720, 680, 150, KP.vari, .8, 30, 3); txt(g, 'tests · property-based', 210, 700, 22, { f: FONT.code, c: KP.vari }); });
    LAMPS.forEach((x, i) => { const tg = T('L18', i), on = t > tg, c = on ? KP.str : C.red, f = bump(t - tg, .02, .5);
      withA(g, a, () => { add(g, () => glow(g, x, 795, 130 + 70 * f, c, .4 + .4 * f)); g.fillStyle = '#0c0a12'; g.beginPath(); g.arc(x, 795, 50, 0, TAU); g.fill(); g.fillStyle = c; g.shadowColor = c; g.shadowBlur = 36; g.beginPath(); g.arc(x, 795, 36, 0, TAU); g.fill(); g.shadowBlur = 0; txt(g, on ? 'PASS' : 'FAIL', x, 852, 18, { f: FONT.code, al: 'center', c }); }); });
  }
  const tS = T('L20', 0) - .3, sy = lerp(-320, 760, E.bounce((t - tS) / .8));   // 准时下班: you go home; the agents keep working
  if (t > tS && t < 85.0) {
    const hot = bump(t - T('L20', 3), .02, .7), a = 1 - sstep(84.4, 84.9, t);
    withA(g, a, () => {
      hudClock(g, '18:00', 540, sy, 170, { col: KP.rx, hot, label: 'OFF WORK · 准时下班' });
      const u = E.out3((t - T('L20', 4)) / .4); if (u > 0) { g.save(); g.globalAlpha *= u; panel(g, 300, sy + 130, 480, 66, 33, { shadow: false, top: 'rgba(20,40,60,.7)', bot: 'rgba(10,14,30,.85)', edge: rgba(KP.vari, .8) }); txt(g, 'agents · 3 running in cloud', 540, sy + 164, 24, { f: FONT.code, al: 'center', c: KP.vari }); g.restore(); }
    });
  }
  lasers(g, t, 2, by);
  holoCore(g, 540, by, 140, t, { spin: 2.2 * sstep(77.4, 80.4, t) * (t - 77.4) * .3, eyes: t > T('L19', 0) - .1 && t < 80.4 ? 'wink' : 'happy' });
  street(g, t, 2, { cx: c2x(t), py: 1352 });
  const gr = groove(t, { amp: 1.2, hop: 36, seed: 8 }), x = c2x(t), jy = jumpArc(t, 77.4, 100, .4) + jumpArc(t, 78.75, 100, .4) + jumpArc(t, 80.2, 70, .5);
  const wave = t > T('L20', 4) ? Math.sin((t - T('L20', 4)) * TAU * 1.9) : 0, tK = T('L17', 4);
  const eyes = t > tK - .05 && t < tK + .8 ? 'star' : t > T('L18', 4) - .1 && t < T('L18', 4) + .6 ? 'angry' : t > T('L18', 5) && t < 77 ? 'laugh' : t > T('L19', 0) - .1 && t < 80.5 ? 'wink' : t > T('L20', 4) ? 'heart' : 'happy';
  const st = { ...gr.st, flip: spinAt(t, tK - .1) * turnAt(t, T('L19', 0) - .1) * turnAt(t, T('L19', 3) - .1), eyes, eph: ephAt(t), wave, glow: .8 + .6 * bump(t - tK, .02, .5) };
  for (let i = 3; i >= 1; i--) { const g2 = groove(t - i * .07, { amp: 1.2, hop: 36, seed: 8 }); withA(g, .22 / i, () => drawGhost(g, c2x(t - i * .07) + g2.dx, 1352 + g2.dy, 400, { ...g2.st, body: i % 2 ? KP.ent : KP.vari, eyes: 'none' })); }
  hero(g, x + gr.dx, 1352 + gr.dy + jy, 400, st);
  if (t > 72.8 && t < 77.4) BUGS.forEach(j => {                  // bug 全拿下: zapped into confetti
    const tb = bugBurst(j), side = j < 3 ? -1 : 1, bx = 540 + side * (560 - 140 * Math.min(t - 72.8, 2.2) * .5 - (j % 3) * 70), byy = 1470 + (j % 3) * 110;
    if (t < tb) { bugIcon(g, bx, byy, 70, side < 0 ? 0 : Math.PI, t + j, KP.ent); bolt(g, [540, 1120], [bx, byy], 31 + j + Math.floor(t * 24), 4, KP.vari, bump(t - T('L18', 4), .01, .25) * (t < T('L18', 4) + .5 ? 1 : 0)); }
    else burst(g, t, tb, bx, byy, { n: 30, v: 1000, life: 1.6, seed: 50 + j, cols: [KP.str, KP.p300, KP.vari, KP.rx] });
  });
  add(g, () => { const k = kick(t, .5, .1), q = Math.floor(beatF(t) * 2); for (let i = 0; i < 26; i++) { const x = hash(i * 7 + q) * W, y = hash(i * 13 + q) * 1700; sparkle(g, x, y, 8 + 14 * k * hash(i), i % 2 ? KP.vari : KP.ent, .55 * k); } });
  burst(g, t, tK, 540, 880, { n: 70, v: 1700, life: 2.4, seed: 21, spread: 2.6 });
  burst(g, t, 69.78, 540, 600, { n: 60, v: 1600, life: 2.4, seed: 22, spread: TAU });
  g.restore();
  return {};
}
const club2Ball = t => [540, ballY2(t)];

// ---------- chorus 3: the whole Kiro Crew ----------
const CREW_TAGS = ['crew/test', 'crew/review', 'kiro', 'crew/deploy', 'crew/docs'];
const CROWD = once('crowd', () => {
  const out = [], rows = [[11, 1086, 96, .5], [9, 1180, 132, .66], [7, 1310, 180, .82]];
  rows.forEach(([n, y, h, a], r) => { for (let i = 0; i < n; i++) out.push({ x: 540 + (i - (n - 1) / 2) * (960 / (n - 1)) + (hash(r * 31 + i) - .5) * 40, y: y + (hash(r * 7 + i) - .5) * 18, h: h * (.9 + .2 * hash(r * 3 + i)), a, r, lag: hash(r * 11 + i) * .08, tint: ['#ffffff', '#efe4ff', '#ffe4f4', '#e2f6ff'][(i + r) % 4], seed: r * 37 + i }); });
  for (let k = 0; k < 5; k++) out.push({ x: 540 + (k - 2) * 200, y: 1500, h: k === 2 ? 300 : 236, a: 1, r: 3, lag: Math.abs(k - 2) * .03, tint: '#ffffff', front: 1, k, seed: 500 + k });
  return out;
});
const JUMPS = () => once('jumps', () => [102.6, ...[0, 1, 2, 3, 4].map(k => T('L25', k)), T('L27', 0), T('L27', 3), T('L28', 4), T('L28', 6)]);
function sClub3(g, t) {
  const pull = io3((t - 116.9) / 2.2);
  g.save(); g.translate(540, 1000); g.scale(1 - .12 * pull, 1 - .12 * pull); g.translate(-540, -1000); camBump(g, t, [540, 900], .016);
  cityClub(g, t, 3);
  const tF = T('L26', 0) - .25, fy = lerp(-200, 446, E.bounce((t - tF) / .8));   // 周五晚上: FRI 18:00, and the crew keeps working
  if (t > tF) { const hot = bump(t - T('L26', 3), .02, .6); hudClock(g, 'FRI 18:00', 540, fy, 112, { col: KP.ent, hot, label: 'Kiro Crew · keeps working while you’re away', ls: 24 }); }
  lasers(g, t, 3, 140);
  holoCore(g, 540, 40, 280, t, { spin: t * .3 });
  street(g, t, 3, { cx: 540, py: 1500 });
  const J = JUMPS(), hub = CROWD[CROWD.length - 3];
  add(g, () => {                                                 // the crew is linked: a graph from the hero to the others, pulses on the beat
    for (let i = 0; i < CROWD.length; i += 2) { const p = CROWD[i]; if (p === hub) continue; const a = .14 + .14 * kick(t - i * .02, 1, .3); g.strokeStyle = rgba(i % 3 ? KP.p300 : KP.vari, a); g.lineWidth = 2; g.beginPath(); g.moveTo(hub.x, hub.y - hub.h * .5); g.lineTo(p.x, p.y - p.h * .5); g.stroke(); const u = ((t * .8 + hash(i)) % 1); g.fillStyle = rgba('#ffffff', .8); g.beginPath(); g.arc(lerp(hub.x, p.x, u), lerp(hub.y - hub.h * .5, p.y - p.h * .5, u), 4, 0, TAU); g.fill(); }
  });
  for (const p of CROWD) {
    const gr = groove(t - p.lag, { amp: p.front ? 1.1 : .9, hop: p.h * .09, seed: 3 + p.r * 5 + (p.k || 0) }), dx = Math.abs(p.x - 540) / 2600;
    const jy = J.reduce((s, tj) => s + jumpArc(t, tj + dx + p.lag * .5, p.h * .42, .44), 0);
    const st = { ...gr.st, eyes: exprAt(t, p.seed, p.front ? 'happy' : 'oval'), eph: ephAt(t) + p.seed, body: p.front ? undefined : mix(p.tint, '#8a6ad0', .32 - p.r * .08), glow: p.front ? .35 : 0, a: p.a, rim: '#2a1258' };
    if (p.front && p.k === 2) hero(g, p.x + gr.dx * .6, p.y + gr.dy + jy, p.h, { ...st, rim: undefined, eyes: t > T('L25', 4) - .05 && t < T('L25', 4) + .8 ? 'star' : t > T('L28', 4) ? 'laugh' : 'happy', flip: spinAt(t, T('L25', 4) - .1) * turnAt(t, T('L27', 0) - .1) * turnAt(t, T('L27', 3) - .1), glow: .8 + .6 * bump(t - T('L25', 4), .02, .5) }, .2);
    else drawGhost(g, p.x + gr.dx * .4, p.y + gr.dy + jy, p.h, st);
    if (p.front) tag(g, p.x + gr.dx * .4, p.y - p.h - 34 + gr.dy + jy, CREW_TAGS[p.k], p.k === 2 ? KP.p300 : KP.vari, sstep(102.5, 103, t));
  }
  [[102.6, 1, TAU, 540, 700], [T('L25', 4), 2, 2.4, 540, 900], [T('L26', 7), 3, 2.4, 540, 1300], [T('L27', 0), 4, 2.4, 300, 900], [T('L27', 3), 5, 2.4, 780, 1100], [T('L28', 6), 6, TAU, 540, 900]].forEach(([t0, s, sp, x, y]) => burst(g, t, t0, x, y, { n: s === 6 ? 160 : 80, v: s === 6 ? 2300 : 1700, life: 3, seed: 60 + s, spread: sp }));
  burst(g, t, T('L28', 6), 120, 1500, { n: 60, v: 2100, life: 3, seed: 81, dir: -1.2, spread: .6 });
  burst(g, t, T('L28', 6), 960, 1500, { n: 60, v: 2100, life: 3, seed: 82, dir: -1.95, spread: .6 });
  add(g, () => { const k = kick(t, .5, .1), q = Math.floor(beatF(t) * 2); for (let i = 0; i < 40; i++) { const x = hash(i * 7 + q * 3) * W, y = hash(i * 13 + q) * 1800; sparkle(g, x, y, 8 + 16 * k * hash(i), DISCO[i % 5], .6 * k); } });
  g.restore();
  return {};
}
