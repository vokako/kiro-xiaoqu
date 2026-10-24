'use strict';
// Kiro 小曲 MV · the cyberpunk kit in Kiro's own design tokens (kiro.dev CSS): near-black and purple greys, the
// purple scale, and the code-highlight colours as the neon. A rainy night city, a wet street, lasers, a holographic
// core over the dance floor, HUD readouts for the clocks.
const KP = { p300: '#C59EFF', p400: '#9E61FF', p500: '#9046FF', p600: '#8728E6', p700: '#610ECD', p800: '#5E17AB', p900: '#471D86',
  g900: '#19161D', g800: '#211D25', g750: '#28242E', g700: '#352F3C', g600: '#4A454E', g400: '#928D9A', g300: '#C1BDC6', g200: '#DBD9DD', g100: '#F2F1F4', bg: '#09090B',
  kw: '#C2A0FD', fn: '#8DC8FB', str: '#80FFB5', ent: '#FF80B5', num: '#FFAFD1', vari: '#80F4FF', rx: '#FFF2B3' };
Object.assign(C, { ink: KP.bg, deep: KP.g900, night: KP.g800, wall: KP.g750, violet: KP.p600, lilac: KP.p300, lav: '#ECE6F7', magenta: KP.ent, pink: KP.num, cyan: KP.vari, gold: KP.rx, green: KP.str, blue: KP.fn });
const NEON = [KP.p500, KP.vari, KP.ent, KP.fn, KP.str, KP.p300];
DISCO.splice(0, DISCO.length, ...NEON);
// fonts: Kiro's display face (AWS Diatype Rounded Semi-Mono), its UI face (AWS Diatype), its code face (Fragment Mono);
// Chinese in Resource Han Rounded (the rounded Source Han, to sit with the rounded display face), code-Chinese in Maple Mono CN
Object.assign(FONT, { brico: 'KDisp, Rounded', disp: 'KDisp, Rounded', ui: 'KSans, "Sans SC"', sans: 'KSans, "Sans SC"', mono: 'KMono, MapleCN', code: 'KMono, MapleCN', cjk: 'Rounded', cjkCode: 'MapleCN, KMono', smiley: 'Rounded' });

// ---------- the city: two layers of towers drawn once, neon signs and rain drawn every frame ----------
const SIGNS = ['代码', '测试', '部署', '灵感', '加班', '需求', '上线', '摸鱼', 'KIRO', '夜宵'];
function cityLayer(name, seed, n, hMin, hMax, body, winA) {
  return once(name, () => {
    const c = document.createElement('canvas'); c.width = W + 400; c.height = H; const g = c.getContext('2d');
    let x = -40;
    for (let i = 0; i < n && x < c.width; i++) {
      const w = 90 + 170 * hash(seed + i * 3), h = hMin + (hMax - hMin) * hash(seed + i * 7 + 1) ** 1.3, y = H - h;
      g.fillStyle = body; g.fillRect(x, y, w, h);
      g.fillStyle = 'rgba(255,255,255,.035)'; g.fillRect(x, y, 3, h);
      for (let wy = y + 16; wy < H - 10; wy += 18) for (let wx = x + 10; wx < x + w - 10; wx += 14) {
        const r = h2((wx * 7) | 0, (wy * 3 + seed) | 0); if (r > winA) continue;
        g.fillStyle = r < winA * .15 ? rgba(KP.vari, .55) : r < winA * .3 ? rgba(KP.ent, .45) : rgba(KP.p300, .32); g.fillRect(wx, wy, 6, 8);
      }
      if (hash(seed + i * 11) > .55) { g.fillStyle = rgba(NEON[i % 6], .5); g.fillRect(x, y, w, 3); }
      x += w + 6 + 30 * hash(seed + i * 13);
    }
    return c;
  });
}
function city(g, t, o = {}) {
  const sh = o.shift || 0, red = o.red || 0;
  g.fillStyle = vgrad(g, 0, H, [[0, KP.bg], [.45, mix(KP.g900, '#2a0c14', red)], [.8, mix('#24113f', '#4a0c1c', red)], [1, mix('#120a1e', '#1c050a', red)]]); g.fillRect(0, 0, W, H);
  add(g, () => { glow(g, 540, H * .78, 1100, mix(KP.p700, C.red, red), .32); glow(g, 200, H * .3, 700, mix(KP.p800, C.red, red), .18); });
  const far = cityLayer('cityFar', 3, 26, 500, 1150, '#0f0c16', .16), mid = cityLayer('cityMid', 9, 14, 700, 1500, '#0a0810', .1);
  const fx = -200 + 60 * Math.sin(t * .05) - (o.px || 0) * .3, mx = -200 + 120 * Math.sin(t * .05 + 1) - (o.px || 0) * .6;
  g.globalAlpha = o.a ?? 1; g.drawImage(far, fx, sh * .3 + (o.lift || 0) * .3); g.drawImage(mid, mx, sh * .6 + (o.lift || 0) * .6); g.globalAlpha = 1;
  if (o.signs !== false) for (let i = 0; i < 6; i++) {                           // vertical neon signs on the near towers
    const x = ((i * 197 + 80 + mx * .2) % (W + 100) + W + 100) % (W + 100) - 50, y = 520 + 260 * hash(i * 5) + sh * .6 + (o.lift || 0) * .6, s = SIGNS[(i * 3 + (o.seed || 0)) % SIGNS.length], col = NEON[(i + 1) % 6];
    const fl = hash(Math.floor(t * 12) + i * 31) > .06 ? 1 : .35, a = (o.signA ?? .8) * fl * (o.a ?? 1);
    g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(8,6,12,.85)'; g.fillRect(x - 34, y - 34, 68, s.length * 64 + 16);
    g.strokeStyle = rgba(col, .9); g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 18; g.strokeRect(x - 34, y - 34, 68, s.length * 64 + 16);
    g.font = `900 52px ${/^[A-Z]/.test(s) ? FONT.disp : FONT.cjk}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = mix(col, '#ffffff', .55);
    [...s].forEach((ch, k) => g.fillText(ch, x, y + k * 64 + 6)); g.restore();
  }
  if (o.rain !== false) rain(g, t, o.rainA ?? .22);
}
function rain(g, t, a = .22, n = 150) {
  g.save(); g.strokeStyle = rgba('#cfc6ff', a); g.lineWidth = 1.6; g.beginPath();
  for (let i = 0; i < n; i++) { const x0 = hash(i * 7) * (W + 300), sp = 1500 + 900 * hash(i * 3), y = ((hash(i * 11) * (H + 200) + t * sp) % (H + 200)) - 100, x = x0 - (y + 100) * .18, l = 28 + 40 * hash(i * 5); g.moveTo(x, y); g.lineTo(x - l * .18, y + l); }
  g.stroke(); g.restore();
}
// HUD corner brackets round a box
function hudFrame(g, x, y, w, h, col, a = 1, len = 26, lw = 3) {
  g.save(); g.strokeStyle = rgba(col, a); g.lineWidth = lw; g.shadowColor = col; g.shadowBlur = 12; g.beginPath();
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { g.moveTo(cx + sx * len, cy); g.lineTo(cx, cy); g.lineTo(cx, cy + sy * len); }
  g.stroke(); g.restore();
}
// a HUD time readout in the display face, framed, with a label
function hudClock(g, str, cx, cy, h, o = {}) {
  const col = o.col || KP.p400, hot = o.hot || 0, a = o.a ?? 1;
  g.save(); g.globalAlpha *= a; g.font = `700 ${h}px ${FONT.disp}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const w = g.measureText(str).width;
  g.fillStyle = 'rgba(9,9,11,.55)'; g.fillRect(cx - w / 2 - 40, cy - h * .62, w + 80, h * 1.24);
  hudFrame(g, cx - w / 2 - 40, cy - h * .62, w + 80, h * 1.24, col, .9, h * .22, 4);
  if (o.label) { g.font = `400 ${o.ls || Math.max(18, h * .14)}px ${FONT.code}`; g.textAlign = 'left'; g.fillStyle = rgba(col, .85); g.fillText(o.label, cx - w / 2 - 30, cy - h * .74); g.textAlign = 'center'; g.font = `700 ${h}px ${FONT.disp}`; }
  g.shadowColor = col; g.shadowBlur = h * (.25 + .3 * hot); g.fillStyle = mix(col, '#ffffff', .35 + .4 * hot); g.fillText(str, cx, cy + h * .04);
  g.shadowBlur = 0; g.globalAlpha *= .12; g.fillStyle = '#000'; for (let y = cy - h * .6; y < cy + h * .6; y += 6) g.fillRect(cx - w / 2 - 40, y, w + 80, 2);
  g.restore();
}
// a laser: a thin hard line with a soft halo
function laser(g, x, y, ang, len, col, a) {
  if (a <= .01) return; const ex = x + Math.sin(ang) * len, ey = y + Math.cos(ang) * len;
  add(g, () => { g.lineCap = 'round'; g.strokeStyle = rgba(col, .18 * a); g.lineWidth = 18; g.beginPath(); g.moveTo(x, y); g.lineTo(ex, ey); g.stroke(); g.strokeStyle = rgba(col, .7 * a); g.lineWidth = 4; g.stroke(); g.strokeStyle = rgba('#ffffff', .8 * a); g.lineWidth = 1.5; g.stroke(); glow(g, x, y, 40, col, a); });
}
function lasers(g, t, lv, cy = -20) {
  const n = lv === 1 ? 4 : lv === 2 ? 8 : 14, k = kick(t, 2, .35);
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1, x = side > 0 ? W + 20 : -20, y = cy + 120 + (i >> 1) * (lv > 2 ? 90 : 160), sw = Math.sin(t * (1.1 + .13 * i) + i * 1.3);
    laser(g, x, y, side * -(1.0 + .5 * sw), 2400, NEON[i % NEON.length], .55 + .3 * k);
  }
  if (lv > 1) for (let i = 0; i < (lv > 2 ? 6 : 3); i++) { const an = Math.sin(t * .9 + i * 2.1) * .5 + (i - (lv > 2 ? 2.5 : 1)) * .22; laser(g, 540, cy, an, 2400, NEON[(i + 2) % 6], .45 + .25 * kick(t - i * SPB * .5, 1, .25)); }
}
// the holographic core that replaces the mirror ball: a wire sphere, three orbits and the ghost inside
function holoCore(g, cx, cy, R, t, o = {}) {
  const a = o.a ?? 1, rot = t * .8 + (o.spin || 0), k = kick(t, 1, .25);
  g.save(); g.globalAlpha *= a;
  add(g, () => {
    glow(g, cx, cy, R * 1.8, KP.p500, .35 + .15 * k);
    g.lineWidth = 2;
    for (let i = 0; i < 8; i++) { const ph = rot + i * Math.PI / 8, rx = R * Math.abs(Math.cos(ph)); g.strokeStyle = rgba(i % 2 ? KP.vari : KP.p300, .35 + .25 * Math.abs(Math.sin(ph))); g.beginPath(); g.ellipse(cx, cy, Math.max(1, rx), R, 0, 0, TAU); g.stroke(); }
    for (let j = -3; j <= 3; j++) { const yy = cy + R * j / 4, rr = R * Math.sqrt(1 - (j / 4) ** 2); g.strokeStyle = rgba(KP.p300, .35); g.beginPath(); g.ellipse(cx, yy, rr, rr * .18, 0, 0, TAU); g.stroke(); }
    for (let i = 0; i < 3; i++) {
      const tilt = -.5 + i * .5, rr = R * (1.35 + .18 * i), sp = t * (1.2 + .4 * i) + i;
      g.save(); g.translate(cx, cy); g.rotate(tilt); g.strokeStyle = rgba(NEON[i + 1], .6); g.lineWidth = 3; g.beginPath(); g.ellipse(0, 0, rr, rr * .28, 0, 0, TAU); g.stroke();
      for (let d = 0; d < 3; d++) { const an = sp + d * TAU / 3; g.fillStyle = rgba('#ffffff', .9); g.beginPath(); g.arc(Math.cos(an) * rr, Math.sin(an) * rr * .28, 6, 0, TAU); g.fill(); }
      g.restore();
    }
  });
  drawGhost(g, cx, cy + R * .48, R * .95, { body: rgba(KP.vari, .5), eyes: o.eyes || 'happy', ink: rgba('#ffffff', .9), fl: 10, fph: t * 4, glow: .8, gc: KP.vari });
  g.globalAlpha *= .25; g.fillStyle = '#000'; for (let y = cy - R; y < cy + R; y += 5) g.fillRect(cx - R, y, 2 * R, 2);
  g.restore();
}
// the street under the dancers: wet asphalt, neon smeared in the puddles, light running along the lanes, a pad of rings
function street(g, t, lv, o = {}) {
  const hy = o.hy ?? HY;
  g.fillStyle = vgrad(g, hy, H, [[0, '#120d1c'], [1, '#060509']]); g.fillRect(0, hy, W, H - hy);
  add(g, () => {
    for (let i = 0; i < 9; i++) { const x = 60 + i * 120 + 30 * Math.sin(t * .7 + i), col = NEON[i % 6]; const lg = g.createLinearGradient(0, hy, 0, H); lg.addColorStop(0, rgba(col, .22)); lg.addColorStop(1, rgba(col, 0)); g.fillStyle = lg; g.fillRect(x - 14 - 10 * hash(i), hy, 28 + 20 * hash(i * 3), H - hy); }
    const P = (X, Z) => [540 + 1000 * X / Z, hy + 900 / Z];
    g.strokeStyle = rgba(lv > 2 ? KP.ent : KP.p400, .3); g.lineWidth = 2; g.beginPath();
    for (let i = -8; i <= 8; i++) { const a = P(i * .55, .5), b = P(i * .55, 14); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } g.stroke();
    const sp = 2.2 + lv * .8;                                                     // light running toward the camera along the lanes
    for (let i = 0; i < 6 + lv * 4; i++) {
      const lane = (i % 9) - 4, z = 14 - ((t * sp + hash(i * 7) * 14) % 13.4), z2 = z + .9; if (z < .6) continue;
      const a = P(lane * .55 + .275, z), b = P(lane * .55 + .275, z2); g.strokeStyle = rgba(NEON[i % 6], .8 * clamp((14 - z) / 3)); g.lineWidth = Math.max(2, 14 / z); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
  });
  const cx = o.cx ?? 540, py = o.py ?? 1352;                                      // the dance pad: rings sent out on every beat
  add(g, () => {
    for (let k = 0; k < 3; k++) { const s = sinceBeat(t) + k * SPB, u = s / (3 * SPB); if (u > 1) continue; const r = 120 + 520 * E.out2(u); g.strokeStyle = rgba(k % 2 ? KP.vari : KP.p400, .7 * (1 - u)); g.lineWidth = 5 * (1 - u) + 1; g.beginPath(); g.ellipse(cx, py, r, r * .22, 0, 0, TAU); g.stroke(); }
    g.strokeStyle = rgba(KP.p300, .55); g.lineWidth = 3; g.beginPath(); g.ellipse(cx, py, 170, 38, 0, 0, TAU); g.stroke();
    glow(g, cx, py, 260, KP.p500, .35 + .2 * kick(t));
  });
}
// a terminal window in Kiro CLI's style: rounded box, prompt ❯, lines typed in on their times
function terminal(g, x, y, w, h, lines, t, o = {}) {
  panel(g, x, y, w, h, 22, { top: 'rgba(14,12,20,.92)', bot: 'rgba(9,9,11,.95)', edge: rgba(o.edge || KP.p400, .6), hot: o.hot || 0 });
  g.fillStyle = 'rgba(255,255,255,.05)'; g.beginPath(); g.roundRect(x, y, w, 52, [22, 22, 0, 0]); g.fill();
  for (let i = 0; i < 3; i++) { g.fillStyle = ['#ff6b81', '#ffd35c', '#3cf29c'][i]; g.beginPath(); g.arc(x + 30 + i * 26, y + 26, 8, 0, TAU); g.fill(); }
  txt(g, o.title || 'kiro-cli — zsh', x + w / 2, y + 27, 22, { f: FONT.code, al: 'center', c: KP.g400 });
  let yy = y + 92;
  for (const L of lines) {
    const u = clamp((t - L.t) / (L.dur ?? .35)); if (u <= 0) break;
    const s = L.s.slice(0, Math.ceil(L.s.length * u)), size = L.size || 30;
    g.font = `${L.w || 400} ${size}px ${FONT.code}`; g.textAlign = 'left'; g.textBaseline = 'middle';
    let xx = x + 30;
    if (L.p) { g.fillStyle = KP.p400; g.fillText(L.p, xx, yy); xx += g.measureText(L.p + ' ').width; }
    g.fillStyle = L.c || '#ffffffcc'; g.fillText(s, xx, yy);
    if (u < 1 || (L.cur && sinceBeat(t, .5) < SPB * .3)) { const cw = g.measureText(s).width; g.fillStyle = KP.p300; g.fillRect(xx + cw + 4, yy - size * .45, size * .55, size * .9); }
    yy += L.gap || size * 1.55;
  }
}
