/** Character-set presets — must match MediaToAscii.Server.Conversion.AsciiCharsets. */
export const AsciiCharsets = {
  Classic: '@%#*+=-:. ',
  Detailed:
    '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  Blocks: '█▓▒░ ',
} as const;

export type AsciiCharsetName = keyof typeof AsciiCharsets;

export interface ConvertOptions {
  width: number;
  invert: boolean;
  charset: string;
}

export const DEFAULT_CONVERT_OPTIONS: ConvertOptions = {
  width: 100,
  invert: false,
  charset: AsciiCharsets.Classic,
};
