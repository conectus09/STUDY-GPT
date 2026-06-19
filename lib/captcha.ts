const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const NUMBERS = "23456789";
const ALL_CHARS = LETTERS + NUMBERS;

function randomChar(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generatePair(length = 4) {
  const chars = [
    randomChar(LETTERS),
    randomChar(NUMBERS),
    randomChar(ALL_CHARS),
    randomChar(ALL_CHARS),
  ];

  return shuffle(chars).slice(0, length).join("");
}

export function generateCaptcha() {
  const pair1 = generatePair(4);
  const pair2 = generatePair(4);
  return `${pair1}-${pair2}`;
}

export function normalizeCaptcha(value: string) {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export function formatCaptchaInput(value: string) {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);

  if (cleaned.length <= 4) return cleaned;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
}

export function isCaptchaMatch(input: string, code: string) {
  return normalizeCaptcha(input) === normalizeCaptcha(code);
}

export function splitCaptchaPairs(code: string) {
  const normalized = normalizeCaptcha(code);
  return [normalized.slice(0, 4), normalized.slice(4, 8)] as const;
}

export function isCaptchaChar(value: string) {
  return /^[A-Z0-9]$/.test(value);
}