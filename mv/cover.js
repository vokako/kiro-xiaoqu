'use strict';
// Kiro 小曲 · cover. One subject (the ghost, dancing, star-eyed), one contrast (its hook in a bubble), one big title.
// ?fmt=34 1080x1440 (Douyin / Xiaohongshu; nothing in the bottom 110 px) · ?fmt=169 1920x1080 (everything that matters in
// the centre 1440x1080, so the middle crop is the 4:3) · ?fmt=916 1080x1920 (vertical video cover). Drawn at device
// pixels: render with --scale 1 and --scale 2 separately.
const once = (() => { const M = new Map(); return (k, f) => { if (!M.has(k)) M.set(k, f()); return M.get(k); }; })();
const q = new URLSearchParams(location.search), FMT = q.get('fmt') || '34', GUIDE = q.get('guide') === '1';
const [CW, CH] = { 34: [1080, 1440], 169: [1920, 1080], 916: [1080, 1920] }[FMT];
// where things go, per format (CSS px): ghost foot and height, bubble centre, title lines, small line
const LAYOUT = {
  34: { gx: 540, gy: 1010, gh: 560, bub: [540, 250, 66], title: [['Kiro 小曲', 540, 1170, 190]], small: [540, 1282, 40] },
  169: { gx: 650, gy: 930, gh: 640, bub: [700, 150, 58], title: [['Kiro', 1250, 470, 230], ['小曲', 1250, 700, 230]], small: [1250, 860, 44] },
  916: { gx: 540, gy: 1180, gh: 640, bub: [540, 330, 70], title: [['Kiro 小曲', 540, 1370, 196]], small: [540, 1490, 42] },
}[FMT];
window.DEMO = { width: CW, height: CH, fps: 30, duration: 1 };
window.renderAt = async () => {};
function skyline(g, K, seed, n, hMin, hMax, body, winA) {
  let x = -40 * K;
  for (let i = 0; i < n && x < CW * K; i++) {
    const w = (70 + 150 * hash(seed + i * 3)) * K, h = (hMin + (hMax - hMin) * hash(seed + i * 7 + 1) ** 1.3) * K, y = CH * K - h;
    g.fillStyle = body; g.fillRect(x, y, w, h);
    for (let wy = y + 14 * K; wy < CH * K - 8 * K; wy += 16 * K) for (let wx = x + 8 * K; wx < x + w - 8 * K; wx += 12 * K) {
      const r = h2((wx / K * 7) | 0, (wy / K * 3 + seed) | 0); if (r > winA) continue;
      g.fillStyle = r < winA * .15 ? rgba(KP.vari, .55) : r < winA * .3 ? rgba(KP.ent, .45) : rgba(KP.p300, .3); g.fillRect(wx, wy, 5 * K, 7 * K);
    }
    if (hash(seed + i * 11) > .55) { g.fillStyle = rgba(NEON[i % 6], .5); g.fillRect(x, y, w, 3 * K); }
    x += w + (6 + 26 * hash(seed + i * 13)) * K;
  }
}
function sign(g, K, x, y, s, col) {
  g.save(); g.fillStyle = 'rgba(8,6,12,.85)'; g.fillRect((x - 30) * K, (y - 30) * K, 60 * K, (s.length * 56 + 14) * K);
  g.strokeStyle = rgba(col, .9); g.lineWidth = 3 * K; g.shadowColor = col; g.shadowBlur = 18 * K; g.strokeRect((x - 30) * K, (y - 30) * K, 60 * K, (s.length * 56 + 14) * K);
  g.font = `900 ${46 * K}px ${FONT.cjk}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = mix(col, '#ffffff', .55);
  [...s].forEach((ch, k) => g.fillText(ch, x * K, (y + k * 56 + 5) * K)); g.restore();
}
function beamK(g, K, x, y, ang, len, col, a) {
  const ex = x + Math.sin(ang) * len, ey = y + Math.cos(ang) * len;
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (const [lw, al, c] of [[20, .16, col], [4.5, .7, col], [1.6, .85, '#ffffff']]) { g.strokeStyle = rgba(c, a * al); g.lineWidth = lw * K; g.beginPath(); g.moveTo(x * K, y * K); g.lineTo(ex * K, ey * K); g.stroke(); }
  g.restore();
}
(async () => {
  try {
    const fonts = [['700 100px KDisp', 'Kiro'], ['400 100px KDisp', 'Kiro'], ['900 100px Rounded', '小曲遇事不决一下'], ['400 30px KMono', 'Kiro']];
    await Promise.all(fonts.map(([f, s]) => document.fonts.load(f, s)));
    for (const [f, s] of fonts) if (!document.fonts.check(f, s)) throw new Error('font not loaded: ' + f);
    GB = await fetch('ghost_geom.json').then(r => r.json());
    const K = window.devicePixelRatio || 1, cv = document.getElementById('c'), g = cv.getContext('2d');
    cv.width = Math.round(CW * K); cv.height = Math.round(CH * K); cv.style.width = CW + 'px'; cv.style.height = CH + 'px';
    const L = LAYOUT, Wd = CW * K, Hd = CH * K;
    // the night: sky, haze, two layers of towers, neon signs, lasers, rain
    g.fillStyle = vgrad(g, 0, Hd, [[0, KP.bg], [.5, '#150f22'], [.82, '#2a1250'], [1, '#120a1e']]); g.fillRect(0, 0, Wd, Hd);
    add(g, () => { glow(g, L.gx * K, (L.gy - L.gh * .45) * K, L.gh * 1.6 * K, KP.p600, .45); glow(g, CW * .15 * K, CH * .25 * K, CH * .5 * K, KP.p800, .25); glow(g, CW * .85 * K, CH * .6 * K, CH * .5 * K, KP.ent, .12); });
    skyline(g, K, 3, 40, CH * .3, CH * .62, '#0f0c16', .17);
    skyline(g, K, 9, 22, CH * .42, CH * .8, '#0a0810', .1);
    const SG = [['代码', KP.vari], ['上线', KP.ent], ['KIRO', KP.p300], ['测试', KP.str], ['夜宵', KP.fn], ['灵感', KP.rx]];
    const sx = FMT === '169' ? [120, 300, 1600, 1790] : [70, 1010, 190, 890], sy = FMT === '169' ? [380, 520, 430, 560] : [CH * .42, CH * .38, CH * .58, CH * .55];
    sx.forEach((x, i) => sign(g, K, x, sy[i], SG[i][0], SG[i][1]));
    for (let i = 0; i < 6; i++) { const side = i % 2 ? 1 : -1; beamK(g, K, side > 0 ? CW + 20 : -20, CH * (.18 + .12 * (i >> 1)), side * -(1.05 + .35 * Math.sin(i * 1.7)), CW * 2.4, NEON[i], .75); }
    beamK(g, K, L.gx, -20, -.42, CH * 2, KP.vari, .5); beamK(g, K, L.gx, -20, .42, CH * 2, KP.ent, .5);
    g.save(); g.strokeStyle = rgba('#cfc6ff', .2); g.lineWidth = 1.6 * K; g.beginPath();
    for (let i = 0; i < 240; i++) { const x = hash(i * 7) * (CW + 300) * K, y = hash(i * 11) * CH * K, l = (26 + 40 * hash(i * 5)) * K; g.moveTo(x, y); g.lineTo(x - l * .18, y + l); }
    g.stroke(); g.restore();
    // the ground: wet, the pad of rings under the ghost, its reflection
    const gy = L.gy, py = gy + 6;
    g.fillStyle = vgrad(g, py * K, Hd, [[0, 'rgba(18,13,28,.92)'], [1, 'rgba(6,5,9,1)']]); g.fillRect(0, py * K, Wd, Hd - py * K);
    add(g, () => { for (let i = 0; i < 3; i++) { const r = (L.gh * .38 + i * L.gh * .3) * K; g.strokeStyle = rgba(i % 2 ? KP.vari : KP.p400, .75 - i * .2); g.lineWidth = (5 - i) * K; g.beginPath(); g.ellipse(L.gx * K, py * K, r, r * .22, 0, 0, TAU); g.stroke(); } glow(g, L.gx * K, py * K, L.gh * .7 * K, KP.p500, .55); });
    g.save(); g.translate(0, 2 * py * K); g.scale(1, -1); g.globalAlpha = .18; drawGhost(g, L.gx * K, gy * K, L.gh * K, { rot: -.08, eyes: 'none' }); g.restore();
    // the subject
    add(g, () => glow(g, L.gx * K, (gy - L.gh * .5) * K, L.gh * K, KP.p500, .5));
    drawGhost(g, L.gx * K, gy * K, L.gh * K, { rot: -.08, sy: 1.02, sx: .99, wave: .9, fl: 12, fph: 1.3, eyes: 'star', eph: 0, blush: .5, glow: 1.6 * K, gc: KP.p500 });
    for (const [dx, dy, r, c] of [[-.62, -.95, 22, KP.vari], [.6, -1.05, 16, KP.ent], [.72, -.55, 12, KP.rx], [-.7, -.4, 10, KP.p300]]) add(g, () => sparkle(g, (L.gx + dx * L.gh) * K, (gy + dy * L.gh) * K, r * K * 1.6, c, .95));
    // the bubble: its hook
    const [bx, by, bs] = L.bub, parts = [['遇事不决 ', FONT.cjk, 900, 'cream'], ['Kiro', FONT.disp, 700, 'kiro'], [' 一下', FONT.cjk, 900, 'cream']];
    g.save(); g.scale(K, K); g.textBaseline = 'middle';
    const ws = parts.map(([s, f, w]) => { g.font = `${w} ${bs}px ${f}`; return g.measureText(s).width; }), tw = ws.reduce((a, b) => a + b, 0), padX = bs * .7, bw = tw + padX * 2, bh = bs * 1.9, x0 = bx - bw / 2, y0 = by - bh / 2;
    g.fillStyle = 'rgba(14,10,24,.88)'; g.beginPath(); g.roundRect(x0, y0, bw, bh, bh * .36); g.fill();
    g.beginPath(); g.moveTo(bx - bs * .3, y0 + bh - 2); g.lineTo(bx + bs * .55 * (FMT === '169' ? -1 : 1) + (FMT === '169' ? -40 : 0), y0 + bh + bs * .7); g.lineTo(bx + bs * .5, y0 + bh - 2); g.closePath(); g.fill();
    g.strokeStyle = KP.p400; g.lineWidth = 4; g.shadowColor = KP.p500; g.shadowBlur = 24 * K; g.beginPath(); g.roundRect(x0, y0, bw, bh, bh * .36); g.stroke(); g.shadowBlur = 0;
    let xx = x0 + padX; parts.forEach(([s, f, w, fill], i) => { g.font = `${w} ${bs}px ${f}`; g.fillStyle = paintFor(g, fill, bs); g.save(); g.translate(0, by); g.fillStyle = (() => { const lg = g.createLinearGradient(0, -bs * .5, 0, bs * .5); const F = FILL[fill]; lg.addColorStop(0, F[0]); lg.addColorStop(.45, F[1]); lg.addColorStop(1, F[2]); return lg; })(); g.shadowColor = FILL[fill][3]; g.shadowBlur = (i === 1 ? 26 : 10) * K; g.fillText(s, xx, f === FONT.disp ? bs * .04 : 0); g.restore(); xx += ws[i]; });
    // the title, and one small line
    for (const [s, x, y, size] of L.title) {
      const segs = s.split(/(Kiro)/).filter(Boolean); g.font = `900 ${size}px ${FONT.cjk}`;
      const sw = segs.map(t => { g.font = t === 'Kiro' ? `700 ${size}px ${FONT.disp}` : `900 ${size}px ${FONT.cjk}`; return g.measureText(t).width; }), total = sw.reduce((a, b) => a + b, 0);
      let tx = x - total / 2;
      segs.forEach((t, i) => {
        const kiro = t === 'Kiro'; g.font = kiro ? `700 ${size}px ${FONT.disp}` : `900 ${size}px ${FONT.cjk}`;
        g.save(); g.translate(tx, y); g.lineJoin = 'round'; g.lineWidth = size * .09; g.strokeStyle = 'rgba(12,6,26,.85)'; g.strokeText(t, 0, kiro ? size * .04 : 0);
        const lg = g.createLinearGradient(0, -size * .5, 0, size * .5), F = FILL[kiro ? 'kiro' : 'cream']; lg.addColorStop(0, F[0]); lg.addColorStop(.45, F[1]); lg.addColorStop(1, F[2]);
        g.shadowColor = KP.p500; g.shadowBlur = size * .35 * K; g.fillStyle = lg; g.fillText(t, 0, kiro ? size * .04 : 0); g.restore(); tx += sw[i];
      });
    }
    { const [x, y, s] = L.small; g.font = `400 ${s}px ${FONT.disp}`; g.textAlign = 'center'; g.fillStyle = KP.g200; g.shadowColor = KP.p500; g.shadowBlur = 14 * K; g.fillText('Create with Kiro', x, y); g.shadowBlur = 0; g.textAlign = 'left'; }
    if (GUIDE && FMT === '169') { g.strokeStyle = 'rgba(0,255,120,.8)'; g.lineWidth = 3; g.strokeRect(240, 0, 1440, 1080); }
    if (GUIDE && FMT === '34') { g.fillStyle = 'rgba(255,0,80,.25)'; g.fillRect(0, CH - 110, CW, 110); }
    g.restore();
    window.__ready = true;
  } catch (e) { document.title = 'ERR ' + e.message; console.error(e); }
})();
