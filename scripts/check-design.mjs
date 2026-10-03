import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8");
const colors = Object.fromEntries([...css.matchAll(/--(color-[\w-]+):\s*(#[0-9a-f]{6});/gi)].map(match => [match[1], match[2]]));
function luminance(hex) {
  return hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
}
for (const [foreground, background] of [
  ["ink", "canvas"], ["body", "canvas"], ["muted", "canvas"], ["muted", "soft"],
  ["muted", "strong"], ["muted", "brand-soft"], ["on-primary", "primary"],
  ["on-primary", "primary-hover"], ["error", "error-soft"],
]) {
  const values = [foreground, background].map(name => luminance(colors[`color-${name}`])).sort((a, b) => b - a);
  const ratio = (values[0] + .05) / (values[1] + .05);
  if (ratio < 4.5) throw new Error(`Kontras ${foreground}/${background} gagal: ${ratio.toFixed(2)}`);
  console.log(`PASS ${foreground}/${background}: ${ratio.toFixed(2)}:1`);
}
