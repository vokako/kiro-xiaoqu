'use strict';
// Kiro 小曲 MV · shots 1-4: the title, 02:00, one sentence, the spec (cards, tea, the boss, 别慌, into the tunnel).
// Each shot draws the whole picture at t into g (lyrics are drawn later, on top); it may return { blur: [vx, vy] }, the
// camera's travel during the shutter, for the frame to be smeared along.
const ONCE = new Map();
const once = (k, f) => { if (!ONCE.has(k)) ONCE.set(k, f()); return ONCE.get(k); };
const SHUT = .75 / 60;                                           // shutter (270 degrees at 60 fps)
const camVel = (f, t, h = .004) => (f(t + h) - f(t - h)) / (2 * h) * SHUT;

// ---------- title: the CLI prompt in the rain at 02:00, then the name typed on the beat ----------
const titleLayout = () => once('title', () => {
  const [, m] = buf('measure', 8, 8), out = [];
  const row = (s, fam, wt, size, y) => { m.font = `${wt} ${size}px ${fam}`; const ws = [...s].map(c => m.measureText(c).width), w = ws.reduce((a, b) => a + b, 0); let x = 540 - w / 2; [...s].forEach((c, i) => { out.push({ ch: c, x: x + ws[i] / 2, y, size, fam, wt, w: ws[i] }); x += ws[i]; }); return 540 - w / 2; };
  const x0 = row('Kiro', FONT.disp, 700, 280, 800); row('小曲', FONT.cjk, 900, 250, 1086);
  return { gl: out, x0 };
});
const titleTimes = () => { const b = BAR(1), e = SPB / 2; return [b, b + e, b + 2 * e, b + 3 * e, b + 4 * e, b + 5 * e]; };
function titleCursor(t) {
  const L = titleLayout(), tk = titleTimes(), n = tk.filter(x => t >= x - LEAD).length;
  if (!n) return [L.x0 - 4, 800, 290];
  const q = L.gl[n - 1]; return [q.x + q.w / 2 + 26, q.y, q.size];
}
function sTitle(g, t) {
  city(g, t, { a: .75, signA: .6, rainA: .2 });
  { const s = 'kiro-cli chat', n = clamp(Math.floor((t - B0) / (SPB / 2) * 1.6) + 1, 0, s.length), a = 1 - sstep(BAR(1) - .1, BAR(1) + .3, t);
    if (a > 0) { panel(g, 150, 560, 780, 96, 26, { a, top: 'rgba(14,12,20,.85)', bot: 'rgba(9,9,11,.9)', edge: rgba(KP.p400, .6) }); g.save(); g.globalAlpha = a; g.font = `700 40px ${FONT.code}`; g.textBaseline = 'middle'; g.fillStyle = KP.p400; g.fillText('❯', 186, 610); g.fillStyle = KP.str; g.fillText(s.slice(0, n), 236, 610); g.restore(); } }
  const tk = titleTimes(), L = titleLayout(), k = kick(t) * (t < BAR(1) ? .45 : 1);
  add(g, () => { glow(g, 540, 930, 820, C.purple, .1 + .12 * k + .1 * sstep(2, 2.3, t)); });
  const [T1, tg] = buf('ttl');
  for (let i = 0; i < 6; i++) {
    const a = t - (tk[i] - LEAD); if (a < 0) continue;
    const q = L.gl[i], s = 1 + .42 * (1 - E.out3(a / .15)), gl = bump(a - .05, .02, .45);
    tg.save(); tg.translate(q.x, q.y + (i < 4 ? 14 : 0)); tg.scale(s, s); tg.font = `${q.wt} ${q.size}px ${q.fam}`; tg.textAlign = 'center'; tg.textBaseline = 'middle';
    tg.shadowColor = rgba(C.purple, .6 + .4 * gl); tg.shadowBlur = 40 + 60 * gl; tg.fillStyle = paintFor(tg, i < 4 ? 'kiro' : 'cream', q.size); tg.fillText(q.ch, 0, 0); tg.restore();
  }
  const sw = (t - (BAR(1) + 3 * SPB)) / .5;                     // a light sweeps over the name on the fourth beat
  if (sw > 0 && sw < 1) { tg.save(); tg.globalCompositeOperation = 'source-atop'; const x = lerp(-300, 1380, E.io2(sw)), lg = tg.createLinearGradient(x - 160, 0, x + 160, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, 'rgba(255,255,255,.85)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); tg.fillStyle = lg; tg.fillRect(0, 0, W, H); tg.restore(); }
  g.drawImage(T1, 0, 0);
  const [cx, cy, cs] = titleCursor(t), typing = t > tk[0] - .05 && t < tk[5] + .12, on = typing || sinceBeat(t, .5) < SPB * .28;
  add(g, () => glow(g, cx, cy, 260 + 120 * kick(t), C.purple, .18 + .22 * kick(t, 1, .25)));
  if (t < BAR(1)) for (let k = 0; k < 4; k++) ring(g, t, BEAT(k), cx, cy, 30, 520, C.lilac, .5, 1.1, 3);
  if (on) { g.save(); g.shadowColor = C.purple; g.shadowBlur = 30; g.fillStyle = C.lav; g.fillRect(cx - 8, cy - cs * .36, 17, cs * .72); g.restore(); add(g, () => glow(g, cx, cy, 140, C.purple, .35)); }
}

// ---------- 02:00: the ghost asleep on the clock; 灵感 lights the bulb ----------
const NIGHT_C = [540, 860];
const nightCam = t => 1 + .045 * sstep(4, 8.3, t) + .025 * E.out3((t - T('L01', 4)) / .7) * (t > T('L01', 4) ? 1 : 0);
const NIGHT_BULB = [612, 452];
const nightBulb = t => { const s = nightCam(t); return [NIGHT_C[0] + (NIGHT_BULB[0] - NIGHT_C[0]) * s, NIGHT_C[1] + (NIGHT_BULB[1] - NIGHT_C[1]) * s]; };
function sNight(g, t) {
  city(g, t, { a: .9, rainA: .24 });
  const s = nightCam(t), tL = T('L01', 4), lit = t < tL - .02 ? 0 : clamp((t - tL + .02) / .07) * (.92 + .08 * kick(t));
  g.save(); g.translate(NIGHT_C[0], NIGHT_C[1]); g.scale(s, s); g.translate(-NIGHT_C[0], -NIGHT_C[1]);
  g.fillStyle = vgrad(g, 1130, 1500, [[0, 'rgba(60,30,120,.35)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 1130, W, 400);
  g.fillStyle = 'rgba(190,150,255,.35)'; g.fillRect(0, 1130, W, 2);
  const colon = sinceBeat(t) < SPB * .5 ? 1 : .12;
  add(g, () => glow(g, 540, 980, 620, C.purple, .16 + .1 * kick(t)));
  hudClock(g, colon > .5 ? '02:00' : '02 00', 540, 980, 260, { col: KP.p400, hot: lit * .4, label: 'LOCAL TIME · 凌晨' });
  // the ghost: asleep on top of the clock, then up when the idea comes
  const ju = (t - tL) / .44, gr = groove(t, { amp: .55, hop: 18, seed: 2 });
  let gx = 618, gy = 834, st;
  if (t < tL) st = { sy: 1 + .03 * Math.sin(t * 2.4), sx: 1 - .02 * Math.sin(t * 2.4), rot: -.06, eyes: 'sleep', fl: 6, fph: t * 2.4, blush: .5 };
  else if (ju < 1) { gy -= 120 * Math.sin(Math.PI * ju); st = { sy: 1 + .12 * Math.sin(Math.PI * ju) - .12 * bump(ju - 1, .05, .06), eyes: 'shock', look: [0, -18], fl: 18, fph: t * 7 }; }
  else { gx += gr.dx * .5; gy += gr.dy; st = { ...gr.st, eyes: t < tL + 1.1 ? 'star' : 'big', eph: t * 6, look: [0, -16] }; }
  drawGhost(g, gx, gy, 240, { ...st, glow: .5 });
  if (t < tL + .3) for (let i = 0; i < 4; i++) {                // z z z
    const t0 = 4.1 + i * SPB * 2 - .6, a = (t - t0) / 1.7; if (a < 0 || a > 1) continue;
    txt(g, i % 2 ? 'Z' : 'z', 700 + 120 * a + 16 * Math.sin(a * 6), 610 - 230 * a, 40 + 50 * a, { f: FONT.brico, w: 800, c: C.lav, al: 'center', a: Math.sin(Math.PI * a) * (1 - sstep(tL, tL + .3, t)) });
  }
  if (t > tL - .06) {
    const pop = E.back((t - tL + .06) / .3, 2.4), [bx, by] = NIGHT_BULB;
    add(g, () => { g.save(); g.translate(bx, by); g.rotate(t * .25); for (let i = 0; i < 12; i++) { g.rotate(TAU / 12); g.fillStyle = rgba(C.gold, .09 * lit); g.beginPath(); g.moveTo(0, 0); g.lineTo(520, -26); g.lineTo(520, 26); g.closePath(); g.fill(); } g.restore(); });
    g.save(); g.translate(bx, by); g.scale(pop, pop); bulb(g, 0, 0, 54, lit, t); g.restore();
    add(g, () => { for (let i = 0; i < 6; i++) { const an = t * 1.6 + i * TAU / 6, r = 118 + 10 * Math.sin(t * 3 + i); sparkle(g, bx + Math.cos(an) * r, by + Math.sin(an) * r * .8, 10 + 6 * kick(t, 1, .2), C.gold, .8 * lit); } });
  }
  g.restore();
}

// ---------- 一句话: the chat; the request typed in, the ghost answers, three files come back ----------
const CHAT = { x: 80, y: 300, w: 880, h: 1120 };
const CHIP_Y = [1070, 1170, 1270], CHIP_N = ['requirements.md', 'design.md', 'tasks.md'], chipT = k => BEAT(21 + k * .5);
function chip(g, k, x, y, w, h, a, hot = 0) {
  panel(g, x, y, w, h, 22, { a, shadow: false, top: 'rgba(90,52,180,.7)', bot: 'rgba(48,24,100,.8)', edge: rgba(C.lilac, .5 + .4 * hot), hot: hot * .8 });
  withA(g, a, () => {
    g.fillStyle = C.lilac; g.beginPath(); g.roundRect(x + 26, y + h / 2 - 20, 30, 40, 5); g.fill(); g.fillStyle = C.deep; g.fillRect(x + 32, y + h / 2 - 8, 18, 3); g.fillRect(x + 32, y + h / 2, 18, 3);
    txt(g, CHIP_N[k], x + 78, y + h / 2, 30, { f: FONT.mono, w: 600, c: C.lav });
    txt(g, ['需求', '设计', '任务'][k], x + w - 30, y + h / 2, 26, { al: 'right', c: C.lilac, a: .8 });
  });
}
function sChat(g, t) {
  city(g, t, { a: .55, signA: .5, rainA: .14 });
  const P = CHAT; panel(g, P.x, P.y, P.w, P.h, 48, { top: 'rgba(46,24,96,.7)', bot: 'rgba(18,9,42,.85)' });
  drawGhost(g, 146, 398, 64, { ...groove(t, { amp: .3, hop: 4, seed: 4 }).st, glow: .3 });
  txt(g, 'Kiro', 200, 352, 42, { f: FONT.brico, w: 700 }); g.fillStyle = C.green; g.beginPath(); g.arc(208, 398, 8, 0, TAU); g.fill();
  txt(g, '在线', 226, 399, 24, { c: C.lav, a: .6 }); g.fillStyle = 'rgba(200,170,255,.18)'; g.fillRect(P.x + 30, 440, P.w - 60, 2);
  { const sp = sstep(9.2, 9.4, t); for (const [i, s] of [[0, 'Vibe'], [1, 'Spec']]) { const x = 640 + i * 150, on = i ? sp : 1 - sp; g.fillStyle = rgba(KP.p500, .15 + .65 * on); g.beginPath(); g.roundRect(x, 342, 136, 52, 26); g.fill(); g.strokeStyle = rgba(KP.p300, .5 + .4 * on); g.lineWidth = 2; g.stroke(); txt(g, s, x + 68, 369, 26, { f: FONT.disp, w: 700, al: 'center', c: on > .5 ? '#ffffff' : KP.g400 }); } }
  panel(g, P.x + 30, 1300, P.w - 60, 90, 30, { shadow: false, top: 'rgba(9,9,11,.6)', bot: 'rgba(9,9,11,.7)', edge: rgba(KP.p400, .4) }); txt(g, 'Ask Kiro anything…', P.x + 64, 1346, 26, { f: FONT.ui, c: KP.g400 });
  const L = LAY.L02, r0 = L.rows[0], r1 = L.rows[1], t0 = T('L02', 0), t4 = T('L02', 4), t7 = T('L02', 7);
  if (t > t0 - .08) { const s = E.back((t - t0 + .08) / .22, 1.8), x0 = r0.x0 - 40, x1 = r0.x1 + 40; g.save(); g.translate(x1, 560 + 75); g.scale(s, s); g.translate(-x1, -(560 + 75)); g.beginPath(); g.roundRect(x0, 485, x1 - x0, 150, 44); g.fillStyle = vgrad(g, 485, 635, [[0, '#9b5cff'], [1, '#7436e2']]); g.shadowColor = rgba(C.purple, .6); g.shadowBlur = 40; g.fill(); g.restore(); }
  if (t > T('L02', 3) + .04 && t < t4 + .02) { panel(g, 226, 737, 180, 150, 44, { shadow: false }); for (let i = 0; i < 3; i++) { const y = 812 - 14 * Math.max(0, Math.sin((t * 7 - i * .7) * Math.PI)); g.fillStyle = C.lav; g.beginPath(); g.arc(276 + i * 40, y, 11, 0, TAU); g.fill(); } }
  if (t > t4 - .07) { const s = E.back((t - t4 + .07) / .24, 1.8), x0 = r1.x0 - 40, x1 = r1.x1 + 40; g.save(); g.translate(x0, 887); g.scale(s, s); g.translate(-x0, -887); panel(g, x0, 737, x1 - x0, 150, 44, { top: 'rgba(110,76,190,.6)', bot: 'rgba(60,34,120,.75)', edge: rgba(C.lav, .55) }); g.restore(); }
  drawGhost(g, 164, 912, 82, { ...groove(t, { amp: .5, hop: 8, seed: 5 }).st, eyes: t > t7 ? 'happy' : 'oval', glow: .4 });
  if (t > t7 + .06) { const u = t - t7 - .06, x = r1.x1 + 96, s = E.back(u / .22, 2.6); g.save(); g.translate(x, 812); g.scale(s, s); g.fillStyle = C.purple; g.shadowColor = C.purple; g.shadowBlur = 30; g.beginPath(); g.arc(0, 0, 36, 0, TAU); g.fill(); g.restore(); tick(g, x, 812, 44, E.out3((u - .08) / .2), '#fff', 9); ring(g, u, .05, x, 812, 30, 140, C.purple, .9, .5, 6); }
  const ls = sstep(10.45, 10.65, t); if (ls > 0) txt(g, '.kiro/specs/login/  已生成 3 个文件', 140, 994, 28, { f: FONT.code, c: KP.vari, a: ls * .9 });
  for (let k = 0; k < 3; k++) { const a = t - chipT(k) + .04; if (a < 0) continue; const s = E.back(a / .22, 2), y = CHIP_Y[k]; g.save(); g.translate(540, y + 40); g.scale(s, s); g.translate(-540, -(y + 40)); chip(g, k, 140, y, 800, 80, clamp(a / .06), bump(a, .01, .3)); g.restore(); }
  const pk = groove(t, { amp: .6, hop: 10, seed: 6 });
  drawGhost(g, 852 + pk.dx * .3, 304, 176, { ...pk.st, sy: pk.st.sy, rot: pk.st.rot * .6, eyes: t > t7 ? 'happy' : 'oval', look: [-14, 10], glow: .5 });
}

// ---------- the spec: one long take down the three cards to the tea; then the boss, 别慌, into the tunnel ----------
const CARD = { x: 110, w: 820, h: 640, y0: 1000, gap: 1100 }, TEA_Y = 4400;
const specCam = t => keyed(t, [[11.9, 1000], [12.95, 1036], [13.32, 2100], [16.12, 2150], [16.48, 3200], [17.2, 3228], [17.62, TEA_Y], [20.4, TEA_Y + 30]])[0];
const REQ = [['用户故事', '用手机号一键登录'], ['WHEN', '用户输入手机号并点登录'], ['THE SYSTEM SHALL', '发送验证码'], ['WHEN', '验证码正确'], ['THE SYSTEM SHALL', '进入首页']];
const TASKS = ['建用户表', '写登录接口', '做登录页面', '补单元测试'];
const NOTE = [['老板', '进度怎么样了？'], ['老板', '今天能上线吗？'], ['产品', '需求改一下'], ['老板', '@所有人 加个班'], ['产品', '按钮再大一点'], ['产品', '颜色换个紫的'], ['老板', '在吗？在吗？'], ['产品', '还是改回去吧']];
const noteT = k => (k ? BEAT(40 + k) : T('L05', 0));
function card(g, k, x, y, w, h, t, a) {
  const on = [[12.0, 13.2], [13.2, 16.3], [16.3, 17.5]][k], hot = win(t, on[0], on[1], .15, .3);
  panel(g, x, y, w, h, 40, { a: a * (.5 + .5 * hot), hot: .7 * hot, edge: rgba(C.lilac, .4 + .4 * hot) });
  withA(g, a * (.4 + .6 * hot), () => {
    g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.roundRect(x, y, w, 86, [40, 40, 0, 0]); g.fill();
    for (let i = 0; i < 3; i++) { g.fillStyle = ['#ff6b81', '#ffd35c', '#3cf29c'][i]; g.beginPath(); g.arc(x + 44 + i * 30, y + 43, 9, 0, TAU); g.fill(); }
    txt(g, '.kiro › specs › login › ', x + 150, y + 44, 24, { f: FONT.code, c: KP.g400 }); txt(g, CHIP_N[k], x + 150 + twidth(g, '.kiro › specs › login › ', 24, FONT.code, 400), y + 44, 24, { f: FONT.code, c: KP.vari });
    const cx = x + 50, cy = y + 140;
    if (k === 0) REQ.forEach(([kw, s], i) => {
      const t0 = T('L03', 0) + i * SPB * .5, u = E.out3((t - t0) / .3); if (u <= 0) return;
      g.save(); g.beginPath(); g.rect(cx - 10, cy + i * 96 - 40, (w - 80) * u + 20, 90); g.clip();
      txt(g, kw, cx, cy + i * 96, 26, { f: FONT.mono, w: 700, c: i ? C.purple : C.gold }); txt(g, s, cx, cy + i * 96 + 38, 32, { w: 500, c: '#f3ecff' }); g.restore();
    });
    if (k === 1) {
      const B = [[cx + 10, cy + 10, 200, 100, '登录页'], [cx + 280, cy + 10, 200, 100, 'Auth API'], [cx + 550, cy + 10, 170, 100, '数据库'], [cx + 280, cy + 230, 200, 100, '短信服务'], [cx + 550, cy + 230, 170, 100, 'Token']];
      const A = [[0, 1], [1, 2], [1, 3], [1, 4]], base = T('L03', 4);
      B.forEach(([bx, by, bw, bh, s], i) => {
        const u = E.io2((t - base - i * SPB * .5) / .4); if (u <= 0) return; const per = 2 * (bw + bh);
        g.save(); g.setLineDash([per * u, per]); g.strokeStyle = C.cyan; g.lineWidth = 4; g.shadowColor = C.cyan; g.shadowBlur = 14; g.beginPath(); g.roundRect(bx, by, bw, bh, 14); g.stroke(); g.restore();
        txt(g, s, bx + bw / 2, by + bh / 2, 30, { al: 'center', w: 600, f: /^[A-Z]/.test(s) ? FONT.mono : FONT.sans, a: sstep(.5, 1, u) });
      });
      A.forEach(([i, j], n) => {
        const u = E.io2((t - base - (n + 1.5) * SPB * .5) / .35); if (u <= 0) return; const a1 = B[i], b1 = B[j];
        const p = j === 3 || j === 4 ? [[a1[0] + a1[2] / 2 + (j === 4 ? 60 : 0), a1[1] + a1[3]], [b1[0] + b1[2] / 2, b1[1]]] : [[a1[0] + a1[2], a1[1] + a1[3] / 2], [b1[0], b1[1] + b1[3] / 2]];
        if (j === 4) p[0] = [a1[0] + a1[2], a1[1] + a1[3] * .8], p[1] = [b1[0], b1[1] + 20];
        const ex = lerp(p[0][0], p[1][0], u), ey = lerp(p[0][1], p[1][1], u); g.strokeStyle = C.lilac; g.lineWidth = 4; g.beginPath(); g.moveTo(p[0][0], p[0][1]); g.lineTo(ex, ey); g.stroke();
        if (u > .95) { const an = Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]); g.fillStyle = C.lilac; g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - 18 * Math.cos(an - .45), ey - 18 * Math.sin(an - .45)); g.lineTo(ex - 18 * Math.cos(an + .45), ey - 18 * Math.sin(an + .45)); g.fill(); }
      });
      const pulse = (t - base) % 1.6 / 1.6; if (t > base + 1.4) add(g, () => glow(g, lerp(cx + 110, cx + 630, pulse), cy + 60, 40, C.cyan, .7));
    }
    if (k === 2) TASKS.forEach((s, i) => {
      const t0 = T('L04', i), u = E.out3((t - t0 + .05) / .25); if (u <= 0) return; const yy = cy + 10 + i * 110;
      g.save(); g.globalAlpha *= u; g.translate(60 * (1 - u), 0);
      g.strokeStyle = C.lilac; g.lineWidth = 4; g.beginPath(); g.roundRect(cx, yy - 26, 52, 52, 12); g.stroke();
      tick(g, cx + 27, yy, 40, E.out3((t - t0 - .14) / .2), C.green, 8);
      txt(g, `${i + 1}. ${s}`, cx + 86, yy, 38, { w: 700, c: t > t0 + .2 ? '#ffffff' : C.lav }); txt(g, t > t0 + .2 ? '✓ Task completed' : '▶ Start task', cx + 86, yy - 40, 20, { f: FONT.code, c: t > t0 + .2 ? KP.str : KP.p300, a: .9 }); g.restore();
    });
  });
}
function teacup(g, x, y, s, t, steam) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(0, 150, 250, 40, 0, 0, TAU); g.fill();
  g.fillStyle = vgrad(g, 110, 170, [[0, '#f2eaff'], [1, '#b9a2e6']]); g.beginPath(); g.ellipse(0, 132, 240, 44, 0, 0, TAU); g.fill();
  g.strokeStyle = '#efe6ff'; g.lineWidth = 26; g.beginPath(); g.arc(178, 10, 62, -1.2, 1.3); g.stroke();
  const body = new Path2D(); body.moveTo(-170, -70); body.lineTo(170, -70); body.bezierCurveTo(170, 60, 110, 128, 0, 128); body.bezierCurveTo(-110, 128, -170, 60, -170, -70); body.closePath();
  g.fillStyle = vgrad(g, -70, 128, [[0, '#ffffff'], [1, '#d8c8f6']]); g.fill(body);
  g.save(); g.clip(body); g.fillStyle = rgba(C.purple, .9); g.fillRect(-180, -20, 360, 22); g.fillStyle = rgba(C.lilac, .7); g.fillRect(-180, 14, 360, 8); g.restore();
  g.fillStyle = '#c88a3a'; g.beginPath(); g.ellipse(0, -70, 170, 30, 0, 0, TAU); g.fill(); g.fillStyle = '#e8b064'; g.beginPath(); g.ellipse(0, -66, 150, 22, 0, 0, TAU); g.fill();
  if (steam > .01) add(g, () => { g.lineCap = 'round'; for (let i = 0; i < 3; i++) { g.strokeStyle = rgba('#ffffff', .22 * steam); g.lineWidth = 16 - i * 3; g.beginPath(); for (let j = 0; j <= 24; j++) { const u = j / 24, yy = -110 - u * 380, xx = (i - 1) * 70 + 34 * Math.sin(u * 7 - t * 2.4 + i * 2) * u; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } });
  g.restore();
}
function note(g, k, x, y, w, s, a, red) {
  if (a <= .01) return; const [who, msg] = NOTE[k], h = 124;
  g.save(); g.translate(x + w / 2, y + h / 2); g.scale(s, s); g.translate(-(x + w / 2), -(y + h / 2));
  panel(g, x, y, w, h, 30, { a, top: rgba(mix('#3a1f6e', '#5a1530', red), .86), bot: rgba(mix('#1e0f40', '#2a0a18', red), .92), edge: rgba(mix(C.lilac, C.red, red), .6), shadow: true });
  withA(g, a, () => {
    g.fillStyle = mix(C.purple, who === '老板' ? '#ff3b55' : '#ff8a3b', red); g.beginPath(); g.arc(x + 62, y + h / 2, 36, 0, TAU); g.fill();
    txt(g, who[0], x + 62, y + h / 2 + 2, 34, { al: 'center', w: 800 });
    txt(g, `${who} · 刚刚`, x + 118, y + 40, 24, { c: C.lav, a: .75 }); txt(g, msg, x + 118, y + 84, 36, { w: 700 });
    g.fillStyle = mix(C.purple, C.red, red); g.beginPath(); g.arc(x + w - 40, y + 40, 15, 0, TAU); g.fill();
  });
  g.restore();
}
const portalAt = t => E.io2((t - T('L06', 4) + .05) / .55);
const travelAt = t => (t < 26.9 ? 0 : 2.4 * (t - 26.9) ** 2);
function sSpec(g, t) {
  const red = sstep(20.2, 23.8, t) * (1 - sstep(25.5, 26.3, t));
  city(g, t, { red, a: .6, signA: .6, rainA: .16 });
  const cy = specCam(t), Y = wy => wy - cy + 900, morph = io3((t - 11.6) / .45);
  if (t < 12.1) {                                                // the three files from the chat grow into the cards
    for (let k = 2; k >= 0; k--) {
      const y0 = CHIP_Y[k], x = lerp(140, CARD.x, morph), w = lerp(800, CARD.w, morph), h = lerp(80, CARD.h, morph), yc = lerp(y0 + 40, Y(CARD.y0 + k * CARD.gap), morph);
      if (morph < .55) chip(g, k, x, yc - h / 2, w, h, 1, 0); else card(g, k, x, yc - h / 2, w, h, t, 1);
    }
  } else {
    for (let k = 0; k < 3; k++) { const yc = Y(CARD.y0 + k * CARD.gap); if (yc < -500 || yc > H + 500) continue; card(g, k, CARD.x, yc - CARD.h / 2, CARD.w, CARD.h, t, 1); }
  }
  const ty = Y(TEA_Y), gone = portalAt(t);
  if (ty < H + 400) withA(g, 1 - gone, () => teacup(g, 540, ty - 40, .95, t, (1 - sstep(20.2, 22, t)) * sstep(17.3, 17.9, t)));
  for (let k = 0; k < NOTE.length; k++) {                        // the boss and the product manager
    const a0 = t - noteT(k); if (a0 < 0) continue;
    let p = 0; for (let j = k + 1; j < NOTE.length; j++) p += io3((t - noteT(j)) / .22);
    const clr = noteClear(k, p), fade = 1 - clamp((t - clr) / .14);
    if (fade <= 0) { burst(g, t, clr, 540, 360 + p * 92, { n: 22, v: 900, life: .9, kind: 'spark', size: 6, seed: k + 3, cols: [C.lilac, C.purple, C.lav] }); continue; }
    const drop = E.back(a0 / .3, 1.4), y = 300 + p * 92 - 160 * (1 - drop), sc = Math.pow(.95, p);
    note(g, k, 120, y, 820, sc, Math.min(clamp(a0 / .08), Math.pow(.86, p)) * fade, red);
  }
  if (t > 20.15 && t < 26.4) { const n = NOTE.filter((_, k) => t >= noteT(k)).length, a = 1 - sstep(25.9, 26.2, t); if (n) { g.save(); g.globalAlpha = a; g.fillStyle = C.red; g.shadowColor = C.red; g.shadowBlur = 24; const s = 1 + .25 * bump(t - noteT(n - 1), .01, .15); g.translate(930, 258); g.scale(s, s); g.beginPath(); g.arc(0, 0, 40, 0, TAU); g.fill(); g.restore(); txt(g, n > 7 ? '99+' : String(n * 12), 930, 260, n > 7 ? 28 : 34, { al: 'center', w: 800, f: FONT.brico, a }); } }
  // the ghost: writing the cards from the side, then by the tea, then 别慌, then away into the light
  const gr = groove(t, { amp: .55, hop: 12, seed: 3 }), tB = T('L06', 0), r1 = T('L06', 1), r2 = T('L06', 3), tG = T('L06', 4);
  let [gx, gy, gh] = keyed(t, [[11.55, [852, 304, 176]], [12.35, [902, 1300, 190]]]), st = { ...gr.st, flip: t < 11.9 ? 1 : -1, look: [-10, 8], glow: .45 };
  const tea = sstep(17.3, 17.9, t); gx = lerp(gx, 846, tea); gy = lerp(gy, 1240, tea); gh = lerp(gh, 230, tea);
  if (t < 17.5) st = { ...st, eyes: t < 12.0 ? 'happy' : 'half' };
  if (t > 17.5) st = { ...st, eyes: t < 20.4 ? 'heart' : t < 22.3 ? 'shock' : 'cry', eph: t * 6, flip: 1, look: t < 20.4 ? [0, 0] : [-12, -14], wave: t < 20.2 ? .6 * Math.max(0, Math.sin(Math.PI * beatF(t))) : 0 };
  if (t > tB - .2) { const u = io3((t - tB + .2) / .4); gx = lerp(gx, 540, u); gy = lerp(gy, 1260, u); gh = lerp(gh, 300, u); st = { ...st, eyes: t < r1 ? 'angry' : t < r2 ? 'wink' : 'laugh', look: [0, 0], wave: Math.max(0, Math.sin(Math.PI * (t - tB) / (SPB * .5))) * .9 }; }
  if (t > tG - .1) { const u = io3((t - tG + .1) / 1.4), away = E.in3((t - 27.75) / .75); gy = lerp(1260, 1010, u) - 110 * away; gh = lerp(300, 200, u) * (1 - .97 * away); st = { ...st, eyes: 'wink', wave: Math.sin((t - tG) * TAU * 1.9) * .9, glow: 1, a: 1 - sstep(.75, 1, away) }; }
  for (const [tr, n] of [[r1, 0], [r2, 1]]) ring(g, t, tr, gx, gy - gh * .5, 60, 1500, C.purple, 1, .65, 26 - n * 6);
  if (gone > 0) {                                               // 跟我来: a portal shaped like the icon opens behind it
    const s = lerp(40, 1300, gone);
    withA(g, gone, () => { g.fillStyle = 'rgba(6,2,16,.9)'; g.fillRect(0, 0, W, H); });
    g.save(); g.beginPath(); g.roundRect(540 - s, 900 - s, 2 * s, 2 * s, s * .43); g.clip();
    g.fillStyle = '#05020c'; g.fillRect(0, 0, W, H); tunnel(g, t, { cx: 540, cy: 900, travel: travelAt(t), a: 1, cols: [C.purple, C.magenta, C.lilac], speed: 1 + 3 * sstep(27, 28.7, t) }); g.restore();
    add(g, () => { g.strokeStyle = rgba(C.lav, .9 * (1 - sstep(.8, 1, gone))); g.lineWidth = 10; g.beginPath(); g.roundRect(540 - s, 900 - s, 2 * s, 2 * s, s * .43); g.stroke(); });
  }
  drawGhost(g, gx + (t > tB ? 0 : gr.dx * .4), gy + gr.dy * (t > tG ? .3 : 1), gh, st);
  return { blur: [0, -camVel(specCam, t)] };
}
// notifications cleared by the two rings of 别慌: the lower ones by the first, the rest by the second
function noteClear(k, p) { const r = p >= 3 ? T('L06', 1) : T('L06', 3), d = Math.abs(1260 - (360 + p * 92)) / 2400; return r + d; }
