// Small, dependency-free checks for this design artifact; not an app test suite.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const css = fs.readFileSync(path.join(__dirname, 'tokens.css'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, 'preview.html'), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
function resolve(name, trail = []) {
  assert(tokens[name], `Missing token: ${name}`);
  assert(!trail.includes(name), `Circular token: ${[...trail, name].join(' → ')}`);
  return tokens[name].replace(/var\((--[\w-]+)\)/g, (_, ref) => resolve(ref, [...trail, name]));
}
Object.keys(tokens).forEach(name => resolve(name));
for (const match of (css + html).matchAll(/var\((--[\w-]+)\)/g)) assert(tokens[match[1]], `Unresolved usage: ${match[1]}`);
function rgb(name) {
  const value = resolve(name);
  const match = /^hsl\(([\d.]+) ([\d.]+)% ([\d.]+)%\)$/.exec(value);
  assert(match, `Expected opaque HSL: ${name} = ${value}`);
  const h = Number(match[1]) / 360, s = Number(match[2]) / 100, l = Number(match[3]) / 100;
  const a = s * Math.min(l, 1 - l);
  return [0, 8, 4].map(n => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  });
}
function luminance(name) {
  const linear = rgb(name).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
const pairs = [
  ['text', 'page'], ['text', 'surface'], ['text-muted', 'surface'], ['text-muted', 'page'],
  ['text-muted', 'surface-soft'], ['text-muted', 'info-bg'],
  ['on-primary', 'primary'], ['on-primary', 'primary-hover'], ['on-primary', 'primary-active'],
  ['on-primary', 'whatsapp'], ['on-primary', 'whatsapp-hover'],
  ['on-primary', 'danger-action'], ['on-primary', 'danger-hover'],
  ['success-text', 'success-bg'], ['info-text', 'info-bg'],
  ['warning-text', 'warning-bg'], ['danger-text', 'danger-bg'],
  ['disabled-text', 'disabled-bg'], ['text', 'info-bg'], ['primary', 'surface-soft'],
  ['focus', 'surface', 3], ['focus', 'page', 3], ['control-border', 'surface', 3]
];
const measurements = pairs.map(([fg, bg, target = 4.5]) => {
  const a = luminance(`--color-${fg}`), b = luminance(`--color-${bg}`);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  assert(ratio >= target, `Contrast failed: ${fg}/${bg}: ${ratio} < ${target}`);
  return `${fg}/${bg}: ${ratio.toFixed(2)}:1`;
});
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML id');
for (const match of html.matchAll(/(?:aria-controls|aria-labelledby|aria-describedby|for)="([^"]+)"/g)) {
  for (const id of match[1].split(/\s+/)) assert(ids.includes(id), `Missing target id: ${id}`);
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Broken fragment: ${match[1]}`);
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1], {filename: 'preview.html'});
assert(html.includes('lang="id"') && html.includes('name="viewport"') && html.includes('noindex, nofollow'));
assert(!/<(?:script|link|img)[^>]+(?:src|href)="https?:/i.test(html), 'Preview should not require external resources');
console.log(`PASS: ${Object.keys(tokens).length} tokens, ${pairs.length} contrast pairs, ${ids.length} unique HTML IDs, JS syntax.`);
console.log(measurements.join('\n'));
console.log('Not checked: browser rendering, keyboard interaction, screen reader, backend integrations.');
