export type SeedInput = string | number;

function stringToHash(str: string): number {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

/** Gera um HEX estável a partir de um seed (nome/id) */
export function seedHex(seed: SeedInput, opts?: { s?: number; l?: number }) {
  const h = stringToHash(String(seed));
  const hue = h % 360; // 0–359
  const sat = clamp(((h >>> 10) % 50) + 50, 50, 80); // 50–80
  const lig = clamp(((h >>> 20) % 25) + 45, 45, 70); // 45–70
  return hslToHex(hue, opts?.s ?? sat, opts?.l ?? lig);
}

/** Dois tons correlatos para gradiente (ex.: cards de livro) */
export function seedGradient(seed: SeedInput) {
  const base = stringToHash(String(seed));
  const h1 = base % 360;
  const h2 = (h1 + 28) % 360; // desloca o matiz para dar contraste suave
  const c1 = hslToHex(h1, 68, 56);
  const c2 = hslToHex(h2, 72, 52);
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}
