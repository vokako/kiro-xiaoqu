'use strict';
// Kiro 小曲 MV · verse 2 (save, tests, the red light, the rules, the nagging), the alarm and the second tunnel, the
// bridge (vibe above, spec below, then five ghosts dancing), and the end card.

// ---------- verse 2: one long take down a pipeline of four stops ----------
const testCam = t => keyed(t, [[44.3, 900], [52.3, 950], [53.25, 2400], [56.5, 2440], [57.4, 3900], [60.7, 3940]])[0];
const CODEL = [['export', ' ', 'async', ' ', 'function', ' ', 'login', '(phone) {'], ['  ', 'const', ' ok = ', 'await', ' ', 'verify', '(phone);'], ['  ', 'if', ' (!ok) ', 'throw', ' ', 'new', ' Error(', "'denied'", ');'], ['  ', 'return', ' ', 'issueToken', '(phone);'], ['}']];
const KW = new Set(['export', 'async', 'function', 'const', 'await', 'if', 'throw', 'new', 'return']), FN = new Set(['login', 'verify', 'issueToken']);
const TESTS = ['auth.test.ts', 'login.test.ts', 'api.test.ts', 'user.test.ts', 'pay.test.ts'];
const RULES = ['统一用 TypeScript', '先写测试，再改代码', '不碰生产数据库'];
const NAGS = [['写测试！', 250, 650], ['又忘了？', 830, 720], ['规范呢？', 236, 1070], ['注释！', 846, 1120]];
const ALERT = [430, 820];
function sTests(g, t) {
  city(g, t, { a: .5, signA: .5, rainA: .12, shift: -(testCam(t) - 900) * .25 });
  const cy = testCam(t), Y = wy => wy - cy + 900;
  add(g, () => {                                                  // the pipeline the four stops sit on
    g.strokeStyle = rgba(C.purple, .45); g.lineWidth = 4; g.beginPath(); g.moveTo(52, Y(500)); g.lineTo(52, Y(4300)); g.stroke();
    for (const wy of [760, 1215, 2400, 3900]) { glow(g, 52, Y(wy), 60, C.purple, .6); g.fillStyle = C.lav; g.beginPath(); g.arc(52, Y(wy), 9, 0, TAU); g.fill(); }
    const v = Math.abs(camVel(testCam, t)) / SHUT; if (v > 200) glow(g, 52, 900, 160, C.lilac, clamp(v / 3000));
  });
  // 1 · the editor: 文件一存
  let oy = Y(0);
  if (oy > -1700 && oy < 1900) {
    g.save(); g.translate(0, oy);
    const tS = T('L11', 3);
    panel(g, 80, 560, 860, 390, 34, {});
    g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.roundRect(80, 560, 860, 70, [34, 34, 0, 0]); g.fill();
    g.fillStyle = 'rgba(144,70,255,.35)'; g.beginPath(); g.roundRect(104, 572, 230, 58, [16, 16, 0, 0]); g.fill();
    txt(g, 'login.ts', 130, 601, 28, { f: FONT.mono, w: 600 });
    if (t < tS) { g.fillStyle = C.lav; g.beginPath(); g.arc(306, 601, 8, 0, TAU); g.fill(); } else tick(g, 306, 601, 26, E.out3((t - tS) / .2), C.green, 5);
    CODEL.forEach((ln, i) => { let x = 112; txt(g, String(i + 1), 112, 668 + i * 50, 24, { f: FONT.mono, c: C.lilac, a: .4 }); x = 150; for (const s of ln) { const c = KW.has(s) ? '#ff7ad9' : FN.has(s) ? C.cyan : s.startsWith("'") ? C.gold : '#e9e0ff'; txt(g, s, x, 668 + i * 50, 27, { f: FONT.mono, w: 500, c }); x += twidth(g, s, 27, FONT.mono, 500); } });
    if (t < tS && sinceBeat(t, .5) < SPB * .3) { g.fillStyle = C.lav; g.fillRect(505, 652, 4, 34); }
    const su = t - tS + .04;
    if (su > 0 && su < 1.6) { const s = 1 + .8 * (1 - E.out3(su / .14)), a = 1 - sstep(1.1, 1.6, su); g.save(); g.globalAlpha = a; g.translate(850, 690); g.scale(s, s); g.shadowColor = C.purple; g.shadowBlur = 40; floppy(g, 0, 0, 110, C.lav); g.restore(); ring(g, su, .12, 850, 690, 50, 260, C.purple, .9, .5, 7); }
    const hu = E.out3((t - tS - .1) / .3); if (hu > 0) { g.save(); g.globalAlpha = hu; g.beginPath(); g.rect(100, 880, 820, 60); g.clip(); txt(g, 'Agent Hook · On File Save → 运行测试', 112 - 200 * (1 - hu), 912, 26, { f: FONT.code, c: KP.rx }); g.restore(); bolt(g, [880, 895], [900, 930], 3, 2, KP.rx, hu * bump(t - tS - .1, .02, .5)); }
    // the tests: 测试就跑, then one goes red: 红灯一亮
    panel(g, 80, 990, 860, 470, 34, {});
    txt(g, '❯ npm test', 112, 1036, 28, { f: FONT.code, c: KP.str });
    const tR = T('L12', 0), tL = T('L12', 3), done = TESTS.filter((_, k) => t > T('L11', 4) + k * SPB / 4 + .3).length;
    if (done) txt(g, t > tR ? '4 passed · 1 failed' : `${Math.min(done, 4)} passed`, 908, 1036, 26, { f: FONT.mono, al: 'right', c: t > tR ? C.red : C.green });
    TESTS.forEach((s, k) => {
      const y = 1100 + k * 74, t0 = T('L11', 4) + k * SPB / 4, u = E.out2((t - t0) / .3); if (t < t0 - .02) return;
      const bad = k === 4, fill = bad ? Math.min(u, .72) : u, isRed = bad && t > tR;
      txt(g, s, 130, y, 30, { f: FONT.mono, w: 500, c: isRed ? '#ffb3bc' : '#ece4ff' });
      g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.roundRect(520, y - 8, 300, 16, 8); g.fill();
      g.fillStyle = isRed ? C.red : u >= 1 && !bad ? C.green : C.purple; g.beginPath(); g.roundRect(520, y - 8, 300 * fill, 16, 8); g.fill();
      const lc = isRed ? C.red : (u >= 1 && !bad) ? C.green : '#5a4a7a', f = isRed ? .5 + .5 * kick(t, 1, .3) + 1.4 * bump(t - tL, .03, .7) : 0;
      if (isRed) add(g, () => { glow(g, 880, y, 90 + 220 * bump(t - tL, .03, .8), C.red, .6 * f); });
      g.fillStyle = lc; if (u >= 1 || isRed) { g.shadowColor = lc; g.shadowBlur = 20; } g.beginPath(); g.arc(880, y, isRed ? 20 : 15, 0, TAU); g.fill(); g.shadowBlur = 0;
      if (bad && !isRed && u > .7) { g.strokeStyle = C.lav; g.lineWidth = 4; g.beginPath(); g.arc(880, y, 13, t * 9, t * 9 + 4.2); g.stroke(); }
      if (isRed) cross(g, 880, y, 8, '#fff', 4);
    });
    g.restore();
  }
  // 3 · the rules: 规矩一条 它都记牢
  oy = Y(2400) - 900;
  const cG = [800, 2660];
  if (oy > -1700 && oy < 1900) {
    g.save(); g.translate(0, oy);
    panel(g, 80, 620, 860, 540, 34, { hot: .3 });
    g.strokeStyle = C.lilac; g.lineWidth = 4; g.beginPath(); g.arc(124, 681, 16, 0, TAU); g.stroke(); g.fillStyle = C.gold; g.beginPath(); g.moveTo(124, 667); g.lineTo(130, 681); g.lineTo(124, 695); g.lineTo(118, 681); g.fill();
    txt(g, '.kiro/steering/规矩.md', 160, 682, 28, { f: FONT.code, c: KP.vari }); txt(g, 'inclusion: always', 906, 682, 22, { f: FONT.code, al: 'right', c: KP.g400 });
    RULES.forEach((s, i) => {
      const t0 = [T('L13', 0), T('L13', 1) + .1, T('L13', 3)][i], u = E.out3((t - t0) / .25), fl = io3((t - T('L13', 4 + i)) / .38); if (u <= 0) return;
      const x0 = 130, y0 = 800 + i * 120, ex = lerp(x0, 740, fl), ey = lerp(y0, 1190, fl) - 160 * Math.sin(Math.PI * fl), sc = lerp(1, .25, fl);
      if (fl >= 1) return;
      g.save(); g.globalAlpha = u * (1 - sstep(.75, 1, fl)); g.translate(ex, ey); g.scale(sc, sc);
      txt(g, '>', 0, 0, 44, { f: FONT.mono, w: 800, c: C.purple }); txt(g, RULES[i], 44 + 40 * (1 - u), 0, 40, { w: 700 }); g.restore();
    });
    const tM = T('L13', 7), mu = E.back((t - tM) / .25, 2);
    if (mu > 0) { g.save(); g.translate(cG[0], 1040); g.scale(mu, mu); panel(g, -110, -36, 220, 72, 36, { shadow: false, top: 'rgba(60,200,140,.5)', bot: 'rgba(20,90,60,.6)', edge: rgba(C.green, .8) }); txt(g, '已记住', -18, 2, 30, { al: 'center', w: 700 }); tick(g, 62, 2, 30, E.out3((t - tM - .1) / .2), '#fff', 6); g.restore(); }
    g.restore();
  }
  // 4 · the nagging: 不用天天 唠唠叨叨
  oy = Y(3900) - 900;
  if (oy > -1700 && oy < 1900) {
    g.save(); g.translate(0, oy);
    NAGS.forEach(([s, x, y], i) => {
      const t0 = T('L14', i), tp = T('L14', 4 + i), a = t - t0; if (a < 0) return;
      if (t > tp) { burst(g, t, tp, x, y, { n: 26, v: 1000, life: .9, kind: 'spark', size: 7, seed: 90 + i, cols: [C.lav, C.pink, C.white] }); ring(g, t, tp, x, y, 60, 230, C.lav, .9, .45, 6); return; }
      const sc = E.back(a / .25, 2) * (1 + .05 * kick(t)), wob = .06 * Math.sin(t * 9 + i);
      g.save(); g.translate(x, y); g.rotate(wob); g.scale(sc, sc);
      g.fillStyle = 'rgba(255,255,255,.95)'; g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 30; g.beginPath(); g.roundRect(-150, -62, 300, 124, 50); g.fill(); g.shadowBlur = 0;
      g.beginPath(); g.moveTo(i % 2 ? -60 : 60, 55); g.lineTo(i % 2 ? -100 : 100, 100); g.lineTo(i % 2 ? -20 : 20, 58); g.fill();
      txt(g, s, 0, 2, 44, { al: 'center', w: 900, c: '#2a1450' }); g.restore();
    });
    const au = E.back((t - 59.72) / .3, 2);                       // and then: an alert, live
    if (au > 0) {
      g.save(); g.translate(540, ALERT[1]); g.scale(au, au); panel(g, -160, -38, 320, 76, 38, { shadow: false, top: 'rgba(120,20,40,.8)', bot: 'rgba(60,8,20,.9)', edge: rgba(C.red, .8) }); txt(g, '线上告警', 20, 2, 32, { al: 'center', w: 800 }); g.restore();
      const k = kick(t, 1, .2); add(g, () => glow(g, ALERT[0], ALERT[1], 60 + 60 * k, C.red, .8)); g.fillStyle = C.red; g.beginPath(); g.arc(ALERT[0], ALERT[1], 14 * au, 0, TAU); g.fill();
    }
    g.restore();
  }
  // one ghost all the way down: on the editor, over to the red light, by the rules, among the nagging
  const tK = T('L12', 4), tM = T('L13', 7), last = T('L14', 7);
  const [gx, gy, gh] = keyed(t, [[44.3, [236, 562, 180]], [tK - .05, [236, 562, 180]], [tK + .3, [860, 1300, 190]], [52.35, [860, 1300, 190]], [53.25, [800, 1360, 270]], [56.55, [800, 1360, 270]], [57.4, [540, 1380, 330]], [61, [540, 1380, 330]]]);
  const hopY = -200 * Math.sin(Math.PI * clamp((t - tK + .05) / .35)), gr = groove(t, { amp: .7, hop: 16, seed: 11 });
  const absorb = [4, 5, 6].reduce((s, k) => s + bump(t - T('L13', k) - .38, .02, .3), 0);
  let lean = 0; NAGS.forEach((_, i) => { lean += (i % 2 ? .18 : -.18) * bump(t - T('L14', 4 + i), .08, .2); });
  const nagged = t > T('L14', 0) && t < last + .1;
  const ex = t < T('L11', 3) ? 'half' : t < tK - .05 ? 'happy' : t < tK + .9 ? 'shock' : t < 52.3 ? 'angry' : t < 56.5 ? (t > tM ? 'star' : absorb > .3 ? 'spiral' : 'oval') : nagged ? (t < T('L14', 4) ? 'flat' : 'angry') : 'laugh';
  hero(g, gx + gr.dx * .4, gy + gr.dy + hopY, gh, { ...gr.st, rot: gr.st.rot + lean, eyes: ex, wave: Math.abs(lean) * 4, glow: .5 + absorb, look: t > tK && t < 52.3 ? [-10, 12] : [0, 0] }, 0);
  const bu = E.back((t - T('L12', 5)) / .22, 2.5); if (bu > 0 && t < 52.4) { g.save(); g.translate(gx, gy - 250); g.scale(bu, bu); g.fillStyle = C.gold; g.shadowColor = C.gold; g.shadowBlur = 24; g.beginPath(); g.arc(0, 0, 38, 0, TAU); g.fill(); g.shadowBlur = 0; txt(g, '!', 0, 4, 54, { al: 'center', w: 800, f: FONT.brico, c: '#2a1450' }); g.restore(); }
  return { blur: [0, -camVel(testCam, t)] };
}

// ---------- the alarm: the graph falls, the red spreads; 别慌 sweeps it purple; 跟我来 into the second tunnel ----------
const wipe1 = t => lerp(-260, 1340, io3((t - T('L16', 1) + .08) / .62));
const wipe2 = t => lerp(1340, -260, io3((t - T('L16', 3) + .08) / .62));
const crash = s => .72 * sstep(T('L15', 3), T('L15', 5), s) + .08 * bump(s - T('L15', 5), .02, .4);
const healAt = s => sstep(T('L16', 3), T('L16', 3) + .5, s);
const sr = s => clamp(.84 + .05 * (vnoise(s * 3, 4) - .5) - crash(s) * (1 - healAt(s)), .03, 1);
function dash(g, t, red, healed) {
  panel(g, 80, 330, 880, 680, 36, { top: rgba(mix('#3a1f6e', '#4a0f24', red), .7), bot: rgba(mix('#160a34', '#22060f', red), .85), edge: rgba(mix(C.lilac, C.red, red), .55), hot: .3 + .4 * red, hotC: mix(C.purple, C.red, red) });
  txt(g, '线上监控 · 请求成功率', 120, 392, 32, { w: 700, c: C.lav });
  const v = sr(t), pct = (v * 100 / .89 * .999).toFixed(1);
  txt(g, `${Math.min(99.9, +pct).toFixed(1)}%`, 920, 396, 70, { f: FONT.brico, w: 800, al: 'right', c: mix(healed ? C.green : C.lav, C.red, red * (v < .5 ? 1 : .3)) });
  g.strokeStyle = 'rgba(200,170,255,.12)'; g.lineWidth = 2; g.beginPath(); for (let i = 0; i <= 4; i++) { g.moveTo(120, 540 + i * 105); g.lineTo(920, 540 + i * 105); } g.stroke();
  const pts = []; for (let i = 0; i <= 80; i++) { const s = t - (80 - i) * .035; pts.push([120 + i * 10, 960 - sr(s) * 400]); }
  const col = mix(healed ? C.green : C.purple, C.red, red * (v < .5 ? 1 : .5));
  g.save(); g.lineJoin = 'round'; g.strokeStyle = col; g.lineWidth = 6; g.shadowColor = col; g.shadowBlur = 20; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.restore();
  const lg = g.createLinearGradient(0, 540, 0, 960); lg.addColorStop(0, rgba(col, .3)); lg.addColorStop(1, rgba(col, 0)); g.fillStyle = lg; g.beginPath(); g.moveTo(120, 960); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(920, 960); g.closePath(); g.fill();
  const [ex, ey] = pts[80]; add(g, () => glow(g, ex, ey, 50, col, .9));
}
sweepX = s => (s < T('L16', 1) - .1 ? -1e4 : wipe1(s));
function sAlarm(g, t) {
  const red0 = sstep(60.4, 61.6, t), w1 = wipe1(t), healed = t > T('L16', 3);
  const red = red0 * (1 - io3((t - T('L16', 1) + .08) / .62));
  city(g, t, { red, a: .6, signA: .6, rainA: .2 });
  const inW = t > T('L16', 1) - .1 && t < T('L16', 1) + .56;
  if (inW) { g.save(); g.beginPath(); g.rect(w1, 0, W, H); g.clip(); dash(g, t, red0, false); g.restore(); g.save(); g.beginPath(); g.rect(0, 0, w1, H); g.clip(); dash(g, t, 0, false); g.restore(); }
  else dash(g, t, red, healed);
  const tE = T('L15', 4);                                        // the errors
  ['500', 'ERROR', 'timeout', '502', 'OOM', '500'].forEach((s, i) => {
    const t0 = tE + i * SPB * .5, a = t - t0, gone = T('L16', 3) + (1 - i / 6) * .4; if (a < 0) return;
    if (t > gone) { burst(g, t, gone, 200 + i * 130, 560 + (i % 3) * 120, { n: 16, v: 800, life: .8, kind: 'spark', size: 6, seed: 120 + i, cols: [C.lilac, C.green, C.white] }); return; }
    const j = kick(t, .5, .05), x = 200 + i * 130 + (hash(Math.floor(t * 30) + i) - .5) * 14 * j, y = 560 + (i % 3) * 120;
    g.save(); g.globalAlpha = clamp(a / .05); g.translate(x, y); g.scale(E.back(a / .2, 2), E.back(a / .2, 2)); g.fillStyle = rgba(mix(C.red, C.purple, 1 - red), .9); g.beginPath(); g.roundRect(-74, -30, 148, 60, 14); g.fill(); txt(g, s, 0, 2, 30, { f: FONT.mono, w: 800, al: 'center' }); g.restore();
  });
  { const t0 = T('L16', 0) - .2, a = sstep(t0, t0 + .25, t) * (1 - sstep(T('L16', 4) + .2, T('L16', 4) + .6, t));   // Kiro CLI takes the incident
    if (a > 0) withA(g, a, () => { const s = E.back(clamp((t - t0) / .3), 1.4); g.save(); g.translate(540, 820); g.scale(s, s); g.translate(-540, -820);
      terminal(g, 110, 600, 860, 420, [{ p: '❯', s: 'kiro-cli chat', t: t0 + .1, c: KP.str }, { p: '❯', s: '线上 500 了，帮我查一下', t: t0 + .5, c: '#ffffff' }, { s: '● 读取 logs/api.log', t: T('L16', 1), c: KP.fn }, { s: '● 定位 pay.ts:42 空指针', t: T('L16', 2), c: KP.fn }, { s: '● 修复 · 跑测试', t: T('L16', 3), c: KP.fn }, { s: '✓ 5 passed · 已提交 PR', t: T('L16', 4) - .2, c: KP.str, cur: 1 }], t, { hot: .5 }); g.restore(); }); }
  if (red > .02) {                                               // red at the edges, breathing with the beat; hazard stripes
    const a = red * (.26 + .14 * kick(t, 1, .3)), rg = g.createRadialGradient(540, 900, 520, 540, 900, 1250); rg.addColorStop(0, 'rgba(255,40,70,0)'); rg.addColorStop(1, `rgba(255,40,70,${a})`); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    for (const y of [222, 1470]) { g.save(); g.globalAlpha = red * .75; g.beginPath(); g.rect(0, y, W, 34); g.clip(); g.fillStyle = '#1a0408'; g.fillRect(0, y, W, 34); g.fillStyle = C.red; const o = (t * 120) % 80; for (let x = -80; x < W + 80; x += 80) { g.beginPath(); g.moveTo(x + o, y + 34); g.lineTo(x + o + 34, y); g.lineTo(x + o + 64, y); g.lineTo(x + o + 30, y + 34); g.fill(); } g.restore(); }
  }
  for (const [tw, f] of [[T('L16', 1), wipe1], [T('L16', 3), wipe2]]) {   // the sweeps
    const u = (t - tw + .08) / .62; if (u < 0 || u > 1) continue; const x = f(t), k = Math.sin(Math.PI * u);
    add(g, () => { const lg = g.createLinearGradient(x - 300, 0, x + 300, 0); lg.addColorStop(0, 'rgba(144,70,255,0)'); lg.addColorStop(.5, rgba(C.lilac, .5 * k)); lg.addColorStop(1, 'rgba(144,70,255,0)'); g.fillStyle = lg; g.fillRect(x - 300, 0, 600, H); });
  }
  const tIn = T('L16', 0) - .45, tG = T('L16', 4), gone = io3((t - tG + .05) / .55);
  if (gone > 0) {
    const s = lerp(40, 1300, gone);
    withA(g, gone, () => { g.fillStyle = 'rgba(6,2,16,.9)'; g.fillRect(0, 0, W, H); });
    g.save(); g.beginPath(); g.roundRect(540 - s, 900 - s, 2 * s, 2 * s, s * .43); g.clip(); g.fillStyle = '#05020c'; g.fillRect(0, 0, W, H);
    tunnel(g, t, { cx: 540, cy: 900, travel: t < 67.9 ? 0 : 2.9 * (t - 67.9) ** 2, a: 1, cols: [C.purple, C.magenta, C.cyan], twist: .5, speed: 1 + 4 * sstep(68, 69.6, t), streaks: 110, core: C.pink }); g.restore();
    add(g, () => { g.strokeStyle = rgba(C.lav, .9 * (1 - sstep(.8, 1, gone))); g.lineWidth = 10; g.beginPath(); g.roundRect(540 - s, 900 - s, 2 * s, 2 * s, s * .43); g.stroke(); });
  }
  if (t > tIn) {
    const u = io3((t - tIn) / .5), gr = groove(t, { amp: .7, hop: 14, seed: 12 }), wv = t > T('L16', 0) ? Math.max(0, Math.sin(Math.PI * (t - T('L16', 0)) / (SPB * .5))) : 0;
    let x = lerp(1300, 770, u), y = 1470, h = 270;
    if (t > T('L16', 1) + .3) { const v = io3((t - T('L16', 1) - .3) / .5); x = lerp(770, 540, v); }
    let fa = 1; if (gone > 0) { const v = io3((t - tG + .1) / 1.4), away = E.in3((t - 68.75) / .75); y = lerp(1470, 1010, v) - 110 * away; h = lerp(270, 210, v) * (1 - .97 * away); fa = 1 - sstep(.75, 1, away); }
    drawGhost(g, x + gr.dx * .3, y + gr.dy * .5, h, { ...gr.st, eyes: t < T('L16', 0) ? 'shock' : t < T('L16', 1) ? 'angry' : t < T('L16', 4) ? 'laugh' : 'wink', eph: t * 6, wave: gone > 0 ? Math.sin((t - tG) * TAU * 1.9) * .9 : wv * .9, glow: .6 + .6 * gone, flip: u < 1 ? -1 : 1, a: fa });
    for (const tr of [T('L16', 1), T('L16', 3)]) ring(g, t, tr, x, y - h * .5, 60, 1400, C.purple, .9, .6, 20);
  }
  return {};
}

// ---------- the bridge: vibe above, spec below; the doors open, the ghost floats up, five of it, a dance ----------
function vibe(g, t, a = 1, y0 = 0, y1 = 960) {
  g.fillStyle = vgrad(g, y0, y1, [[0, '#12052a'], [1, '#3a0c4e']]); g.fillRect(0, y0, W, y1 - y0);
  add(g, () => { for (let i = 0; i < 7; i++) {
    const yc = y0 + (y1 - y0) * (.15 + .7 * i / 6), A = 70 + 40 * Math.sin(i * 1.7), k = .004 + .0015 * i, w = .9 + .3 * Math.sin(i), ph = t * (1.2 + .2 * i) + i * 1.3, col = [C.magenta, C.purple, C.pink, C.lilac][i % 4];
    const yAt = x => yc + A * Math.sin(x * k + ph) + 30 * Math.sin(x * k * 2.3 - ph * .7) + 18 * kick(t - i * .04, 1, .2) * Math.sin(x * .01 + i);
    g.beginPath(); for (let x = -20; x <= W + 20; x += 20) { const y = yAt(x); x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } for (let x = W + 20; x >= -20; x -= 20) g.lineTo(x, yAt(x) + 46 * w); g.closePath();
    g.fillStyle = rgba(col, .16 * a); g.fill(); g.strokeStyle = rgba(col, .7 * a); g.lineWidth = 3; g.beginPath(); for (let x = -20; x <= W + 20; x += 20) { const y = yAt(x); x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  } });
}
function spec(g, t, a = 1, y0 = 960, y1 = H) {
  g.fillStyle = vgrad(g, y0, y1, [[0, '#06183a'], [1, '#040b1e']]); g.fillRect(0, y0, W, y1 - y0);
  g.save(); g.beginPath(); g.rect(0, y0, W, y1 - y0); g.clip(); g.lineWidth = 1.5;
  g.strokeStyle = rgba(C.cyan, .08 * a); g.beginPath(); for (let x = 0; x <= W; x += 40) { g.moveTo(x, y0); g.lineTo(x, y1); } for (let y = y0; y <= y1; y += 40) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
  g.strokeStyle = rgba(C.cyan, .22 * a); g.beginPath(); for (let x = 0; x <= W; x += 200) { g.moveTo(x, y0); g.lineTo(x, y1); } for (let y = y0; y <= y1; y += 200) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
  g.strokeStyle = rgba(C.cyan, .2 * a); g.lineWidth = 2; g.strokeRect(150, y0 + 130, 320, 190); g.strokeRect(620, y0 + 200, 300, 150); g.beginPath(); g.arc(540, y0 + 470, 130, 0, TAU); g.moveTo(410, y0 + 470); g.lineTo(670, y0 + 470); g.moveTo(540, y0 + 340); g.lineTo(540, y0 + 600); g.stroke();
  g.beginPath(); g.moveTo(150, y0 + 100); g.lineTo(470, y0 + 100); g.moveTo(150, y0 + 90); g.lineTo(150, y0 + 110); g.moveTo(470, y0 + 90); g.lineTo(470, y0 + 110); g.stroke(); txt(g, '320', 310, y0 + 82, 20, { f: FONT.mono, c: C.cyan, a: .55 * a, al: 'center' }); txt(g, 'R130', 690, y0 + 380, 20, { f: FONT.mono, c: C.cyan, a: .55 * a });
  const base = T('L22', 0); [[120, y0 + 600, 240, 120], [440, y0 + 600, 200, 120], [720, y0 + 600, 240, 120], [440, y0 + 800, 200, 100]].forEach(([x, y, w, h], i) => {
    const u = E.io2((t - base - i * SPB * .5) / .45); if (u <= 0) return; const per = 2 * (w + h);
    g.setLineDash([per * u, per]); g.strokeStyle = rgba(C.cyan, .8 * a); g.lineWidth = 3; g.strokeRect(x, y, w, h); g.setLineDash([]);
    if (i < 2) { g.beginPath(); g.moveTo(x + w, y + h / 2); g.lineTo(x + w + 80 * u, y + h / 2); g.stroke(); }
  });
  for (let x = 0; x < W; x += 20) { g.fillStyle = rgba(C.cyan, .5 * a); g.fillRect(x, y0 + 4, 2, x % 100 ? 10 : 22); }
  g.restore();
}
const FORM = {
  line: (k, t) => [540 + (k - 2) * 206, 1452, k === 2 ? 262 : 214, 0],
  vee: (k, t) => [540 + (k - 2) * 214, 1452 - Math.abs(k - 2) * 80, (k === 2 ? 286 : 220) * (1 - Math.abs(k - 2) * .07), -Math.abs(k - 2)],
  ring: (k, t) => { const th = TAU * k / 5 + TAU * (t - BAR(48)) / (4 * SPB) * .5; return [540 + 360 * Math.sin(th), 1390 + 80 * Math.cos(th), 236 * (.8 + .24 * Math.cos(th)), Math.cos(th)]; },
  huddle: (k, t) => [540 + (k - 2) * 156, 1452 - (k % 2) * 64, k === 2 ? 270 : 214, k % 2 ? -1 : 0],
  front: (k, t) => [540 + (k - 2) * 200, 1500, k === 2 ? 300 : 236, 0],                 // where the front row of the last chorus stands
};
function formAt(k, t) {
  const seq = [[BAR(46), 'line'], [BAR(47), 'vee'], [BAR(48), 'ring'], [BAR(49), 'huddle'], [BAR(50) - .3, 'front']];
  let i = 0; while (i + 1 < seq.length && t >= seq[i + 1][0] - .2) i++;
  const cur = FORM[seq[i][1]](k, t); if (i === 0) return cur;
  const u = io3((t - seq[i][0] + .2) / .42), prev = FORM[seq[i - 1][1]](k, t); return prev.map((v, j) => lerp(v, cur[j], u));
}
function sBridge(g, t) {
  const open = io3((t - 90.25) / .7), lift = bump(t - 86.2, .02, .6);
  // the stage behind the doors
  if (open > 0) {
    vibe(g, t, .55, 0, 1100); g.fillStyle = vgrad(g, 900, 1100, [[0, 'rgba(18,5,42,0)'], [1, '#12052a']]); g.fillRect(0, 900, W, 200);
    floor(g, { hy: 1100, lit: (i, j) => { const d = (Math.abs(i + .5) + j * .7 - beatF(t) * 2) % 6; return d > 0 && d < .9 ? [C.cyan, .3] : null; }, line: C.cyan, la: .3, haze: C.purple, far: '#0a1838', near: '#040a1c', scroll: t * .4 });
    const dance = t > BAR(46) - .3;
    if (dance) add(g, () => { for (let k = 0; k < 5; k++) { const [x, y] = formAt(k, t); beam(g, x * .6 + 216, -40, Math.atan2(x - (x * .6 + 216), y + 40), 1700, 8, 150, k % 2 ? C.cyan : C.magenta, .18 + .12 * kick(t - k * .05, 1, .25)); glow(g, x, y + 8, 160, k % 2 ? C.cyan : C.magenta, .35); } });
    const tF = T('L23', 0) - .15, fly = E.out3((t - tF) / 1.9), tS = T('L24', 0);
    if (t < tS + .1) {
      const h = lerp(30, 520, fly), y = lerp(1060, 1440, fly), gr = groove(t, { amp: fly, hop: 14, seed: 13 });
      hero(g, 540 + gr.dx * fly, y + gr.dy * fly, h, { ...gr.st, fl: 26, fph: t * 6, eyes: 'happy', glow: 1, a: clamp((t - tF) / .3) }, .15);
    } else {
      const order = [0, 1, 2, 3, 4].map(k => ({ k, p: formAt(k, t) })).sort((a, b) => a.p[3] - b.p[3]);
      for (const { k } of order) {
        let [x, y, h] = formAt(k, t); const split = io3((t - tS - Math.abs(k - 2) * .14) / .4);
        if (split < 1) { x = lerp(540, x, split); y = lerp(1440, y, split); h = lerp(k === 2 ? 520 : 300, h, Math.max(split, k === 2 ? sstep(tS, tS + 1.2, t) : 0)); }
        const bi = Math.floor(beatF(t)), inV = t > BAR(47) - .2 && t < BAR(48) - .2, hopOn = inV ? ((bi + k) % 2 === 0 ? 1.6 : .3) : 1;
        const gr = groove(t - (t < BAR(47) ? k * .06 : 0), { amp: hopOn, hop: 22, seed: 14 + k });
        let jy = 0, sq = 1;
        if (t > BAR(49) - .2) { const p = sinceBeat(t) / SPB; sq = 1 - .1 * (1 - p) * sstep(BAR(49), BAR(50) - .3, t) * (1 - sstep(BAR(50) - .4, BAR(50) - .2, t)); jy = jumpArc(t, BAR(50) + Math.abs(k - 2) * 200 / 2600 + Math.abs(k - 2) * .015, (k === 2 ? 300 : 236) * .42, .44); }
        const st = { ...gr.st, sy: gr.st.sy * sq, sx: gr.st.sx / Math.sqrt(sq), eyes: t < BAR(46) ? 'happy' : ['heart', 'wink', 'happy', 'star', 'laugh'][(k + Math.floor(beatF(t) / 4)) % 5], eph: t * 6 + k, glow: k === 2 ? .9 : .5, flip: t > BAR(48) - .2 && t < BAR(49) - .2 ? (Math.cos(TAU * k / 5 + TAU * (t - BAR(48)) / (4 * SPB) * .5) > 0 ? 1 : -1) : 1 };
        hero(g, x + gr.dx * .5, y + gr.dy + jy, h, st, .15);
        tag(g, x + gr.dx * .5, y + gr.dy + jy - h - 30, CREW_TAGS[k], k === 2 ? KP.p300 : KP.vari, sstep(tS + .3, tS + .8, t));
      }
    }
    if (t > tS + .2) {                                              // the crew: five agents, linked, and its name
      const a = sstep(tS + .2, tS + .8, t), P = [0, 1, 2, 3, 4].map(k => formAt(k, t));
      add(g, () => { for (let k = 0; k < 5; k++) if (k !== 2) { const p = P[k], q = P[2]; g.strokeStyle = rgba(KP.vari, (.2 + .2 * kick(t, 1, .3)) * a); g.lineWidth = 2; g.beginPath(); g.moveTo(q[0], q[1] - q[2] * .5); g.lineTo(p[0], p[1] - p[2] * .5); g.stroke(); const u = (t * .9 + k * .23) % 1; g.fillStyle = rgba('#ffffff', .9 * a); g.beginPath(); g.arc(lerp(q[0], p[0], u), lerp(q[1] - q[2] * .5, p[1] - p[2] * .5, u), 5, 0, TAU); g.fill(); } });
      const b = sstep(BAR(46) - .3, BAR(46) + .2, t) * (1 - sstep(BAR(49) - .3, BAR(49), t));
      if (b > 0) { g.save(); g.globalAlpha = b; g.fillStyle = 'rgba(9,9,11,.72)'; g.beginPath(); g.roundRect(220, 480, 640, 210, 24); g.fill(); g.font = `700 92px ${FONT.disp}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = KP.p500; g.shadowBlur = 40; g.fillStyle = paintFor(g, 'cream', 92); g.fillText('Kiro Crew', 540, 560); g.shadowBlur = 0; txt(g, 'remembers · learns · keeps working', 540, 650, 26, { f: FONT.code, al: 'center', c: KP.vari }); hudFrame(g, 220, 480, 640, 210, KP.p300, .8, 30, 3); g.restore(); }
    }
    for (let i = 0; i < 4; i++) {                                // 5 6 7 8
      const t0 = BAR(49) + i * SPB, a = t - t0; if (a < 0 || a > SPB) continue;
      const s = E.back(a / .18, 2.4) * (1 + .1 * a), al = 1 - sstep(.3, SPB, a);
      g.save(); g.globalAlpha = al; g.translate(540, 560); g.scale(s, s); g.font = `800 300px ${FONT.brico}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = DISCO[i]; g.shadowBlur = 60; g.fillStyle = paintFor(g, ['kiro', 'magenta', 'cyan', 'gold'][i], 300); g.fillText(String(5 + i), 0, 0); g.restore();
    }
  }
  // the doors: vibe above, spec below, sliding apart
  if (open < 1) {
    const d = 1100 * open;
    g.save(); g.translate(0, -d); vibe(g, t, 1); g.restore();
    g.save(); g.translate(0, d); spec(g, t, 1); g.restore();
    for (const [i, s, col, y] of [[0, 'Vibe', KP.ent, 880 - d], [1, 'Spec', KP.vari, 1004 + d]]) { const a = sstep(86.0, 86.5, t) * (1 - open); if (a <= 0) continue; g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(9,9,11,.75)'; g.beginPath(); g.roundRect(70, y - 26, 150, 52, 26); g.fill(); g.strokeStyle = col; g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 16; g.stroke(); g.shadowBlur = 0; txt(g, s, 145, y + 1, 28, { f: FONT.disp, w: 700, al: 'center', c: '#ffffff' }); txt(g, i ? '规划先行，再动手' : '先聊，再动手', 240, y + 1, 24, { c: col }); g.restore(); }
    add(g, () => { g.fillStyle = vgrad(g, 940 - d, 980 - d, [[0, 'rgba(255,255,255,0)'], [.5, rgba(C.lav, .9 * (1 - open))], [1, 'rgba(255,255,255,0)']]); g.fillRect(0, 940 - d, W, 40); g.fillStyle = vgrad(g, 940 + d, 980 + d, [[0, 'rgba(255,255,255,0)'], [.5, rgba(C.cyan, .9 * (1 - open))], [1, 'rgba(255,255,255,0)']]); g.fillRect(0, 940 + d, W, 40); glow(g, 540, 960, 420 + 300 * lift, C.lav, .25 + .4 * lift); });
    for (let i = 0; i < 12; i++) add(g, () => sparkle(g, (hash(i * 5 + Math.floor(t * 3)) * W), 960 + (hash(i * 9) - .5) * 30, 10 + 8 * kick(t, .5), C.lav, .7 * (1 - open)));
  }
  return {};
}

// ---------- the end: the light of the floor spirals into the icon; Create with Kiro ----------
const END = { cx: 540, cy: 820, size: 560 }, ICON_T = () => BAR(60);
const CWK = () => once('cwk', () => {
  const [, m] = buf('measure', 8, 8), parts = [['Create', 700, 92, 'cream'], [' with ', 700, 92, 'cream'], ['Kiro', 800, 112, 'kiro']], out = []; let w = 0;
  for (const [s, wt, size, fill] of parts) for (const ch of s) { m.font = `${wt} ${size}px ${FONT.brico}`; const a = m.measureText(ch).width; out.push({ ch, wt, size, fill, x: w + a / 2, w: a }); w += a; }
  out.forEach(q => { q.x += 540 - w / 2; }); return out;
});
const cwkT = i => { const b = BAR(60), e = SPB / 2; return i < 6 ? b + i * e : i < 12 ? BAR(61) : BAR(61) + 2 * SPB; };
function sEnd(g, t) {
  city(g, t, { a: .45 * (1 - sstep(ICON_T() - .3, ICON_T() + 1.2, t)) + .15, signA: .4, rainA: .1 });
  const tI = ICON_T(), u = clamp((t - 118.9) / (tI - 118.9)), k = kick(t, 1, .2);
  add(g, () => { g.save(); g.translate(END.cx, END.cy); g.rotate(t * .12); for (let i = 0; i < 16; i++) { g.rotate(TAU / 16); g.fillStyle = rgba(C.purple, .06 * sstep(tI - .3, tI + .6, t)); g.beginPath(); g.moveTo(0, 0); g.lineTo(1400, -70); g.lineTo(1400, 70); g.closePath(); g.fill(); } g.restore(); glow(g, END.cx, END.cy, lerp(220, 640, u), C.lilac, .2 + .35 * u * (t < tI ? 1 : .6)); });
  if (t < tI + .2) add(g, () => {                                // the vortex
    for (let i = 0; i < 420; i++) {
      const r0 = 120 + 1250 * hash(i * 3 + 1) ** .8, th0 = hash(i * 7 + 2) * TAU, col = DISCO[i % 6];
      const at = v => { const r = r0 * Math.pow(1 - E.in3(v), 1.3), th = th0 + 4.5 * E.in2(v) * (1 + 380 / r0); return [END.cx + Math.cos(th) * r, END.cy + Math.sin(th) * r * .82]; };
      const p = at(u), q = at(Math.max(0, u - .025)), a = (.35 + .65 * hash(i)) * (1 - sstep(.92, 1, u));
      g.strokeStyle = rgba(col, Math.min(1, a * 1.3)); g.lineWidth = 2.5 + 4 * hash(i * 5); g.lineCap = 'round'; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]); g.stroke();
    }
  });
  if (t < tI) for (let i = 0; i < 16; i++) { const v = clamp(u * (1 + i * .015)), r = (300 + 48 * i) * (1 - E.in3(v)), th = i * TAU / 16 + 4 * E.in2(v); drawGhost(g, END.cx + Math.cos(th) * r, END.cy + Math.sin(th) * r * .8 + 40, 92 * (1 - v * .7), { eyes: 'happy', a: sstep(119.35, 119.8, t) * (1 - sstep(.85, 1, v)), fl: 10, fph: t * 6, glow: .5 }); }
  const ia = t - tI + .05;
  if (ia > 0) {
    const s = E.back(ia / .42, 1.6) * (1 + .014 * k), gr = groove(t, { amp: .22, hop: 30, seed: 15 }), wave = t > BAR(62) && t < BAR(63) ? Math.sin((t - BAR(62)) * TAU * 1.9) * .9 : 0;
    const eyes = t > BAR(65) + 2 * SPB && t < BAR(65) + 3.2 * SPB ? 'wink' : t > BAR(66) ? 'happy' : 'oval';
    add(g, () => glow(g, END.cx, END.cy, 520, C.purple, .4 + .2 * k));
    g.save(); g.translate(END.cx, END.cy); g.scale(s, s); g.translate(-END.cx, -END.cy);
    drawIcon(g, END.cx, END.cy, END.size, { glow: .8 + .3 * k, dy: ia > .5 ? gr.dy * .5 : 0, gs: { ...gr.st, rot: gr.st.rot * .5, fl: 6, wave, eyes, blink: eyes === 'oval' ? blinkAt(t, 3) : 0 } });
    g.restore();
    ring(g, t, tI, END.cx, END.cy, 200, 1100, C.lilac, 1, .8, 10);
    burst(g, t, tI, END.cx, END.cy, { n: 90, v: 1900, life: 2.6, seed: 140, spread: TAU });
    for (let n = 62; n <= 65; n++) ring(g, t, BAR(n), END.cx, END.cy, 330, 980, C.purple, .55, 1.3, 5);
    ring(g, t, BAR(66), END.cx, END.cy, 300, 1300, C.lav, 1, .9, 12);
  }
  const Q = CWK();                                               // Create with Kiro, typed on the beat
  Q.forEach((q, i) => {
    const a = t - (cwkT(i) - LEAD); if (a < 0 || q.ch === ' ') return;
    const s = 1 + (i >= 12 ? .9 : .4) * (1 - E.out3(a / (i >= 12 ? .16 : .13))), gl = bump(a - .05, .02, .5);
    g.save(); g.translate(q.x, 1268); g.scale(s, s); g.font = `${q.wt} ${q.size}px ${FONT.brico}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = rgba(C.purple, .5 + .5 * gl); g.shadowBlur = 24 + 40 * gl; g.fillStyle = paintFor(g, q.fill, q.size); g.fillText(q.ch, 0, 0); g.restore();
  });
  const la = sstep(126.8, 127.8, t); if (la > 0) txt(g, 'kiro.dev', 540, 1380, 34, { f: FONT.code, al: 'center', c: KP.p300, a: .85 * la });
  for (const [i, s] of [[0, 'IDE'], [1, 'CLI'], [2, 'Crew']]) {          // the family, orbiting in and joining the icon
    const a0 = 119.2 + i * SPB, u = clamp((t - a0) / (ICON_T() - a0)), an = -Math.PI / 2 + i * TAU / 3 + 3 * E.in2(u), r = 520 * (1 - E.in3(u)), al = sstep(a0, a0 + .3, t) * (1 - sstep(.9, 1, u));
    if (al > 0) { g.save(); g.globalAlpha = al; const x = END.cx + Math.cos(an) * r, y = END.cy + Math.sin(an) * r * .8; panel(g, x - 110, y - 46, 220, 92, 46, { shadow: false, top: 'rgba(30,18,60,.8)', bot: 'rgba(14,9,30,.9)', edge: rgba(NEON[i + 1], .9), hot: .6, hotC: NEON[i + 1] }); txt(g, 'Kiro ' + s, x, y + 2, 34, { f: FONT.disp, w: 700, al: 'center', c: '#ffffff' }); g.restore(); }
  }
  return {};
}
