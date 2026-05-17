function lum(hex) {
  const h = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) / 255);
  const c = rgb.map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function ratio(fg, bg) {
  const l1 = lum(fg);
  const l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function mixSteel(pct) {
  const s = { r: 0, g: 37, b: 63 };
  const f = (c) => Math.round(s[c] * (pct / 100) + 255 * (1 - pct / 100));
  const hex = (n) => n.toString(16).padStart(2, '0');
  return `#${hex(f('r'))}${hex(f('g'))}${hex(f('b'))}`;
}

const pairs = [
  ['#ffffff', '#8a6b52', 'white on earth (updated)'],
  ['#ffffff', '#c24e32', 'white on warmth (updated)'],
  ['#ffffff', '#00253f', 'white on steel'],
  ['#c57639', '#ffffff', 'rust on white'],
  [mixSteel(75), '#ffffff', 'FAQ subheading on white (75% steel)'],
  [mixSteel(65), '#ffffff', 'compare price on white (65% steel)'],
];

const minNormal = 4.5;
let failed = 0;

console.log('WCAG 2.1 AA contrast audit (normal text >= 4.5:1)\n');
for (const [fg, bg, label] of pairs) {
  const r = ratio(fg, bg);
  const pass = r >= minNormal;
  if (!pass) failed += 1;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${r.toFixed(2)}:1 — ${label}`);
}

process.exit(failed > 0 ? 1 : 0);
