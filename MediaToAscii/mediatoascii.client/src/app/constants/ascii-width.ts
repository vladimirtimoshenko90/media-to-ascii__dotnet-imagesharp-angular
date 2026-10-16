const MIN = 40;
const MAX = 200;

export const ASCII_WIDTH = {
  MIN,
  MAX,
  DEFAULT: Math.round((MIN + MAX) / 2),
} as const;
