/** Character-set presets — must match MediaToAscii.Server.Conversion.AsciiCharsets. */
export const AsciiCharsets = {
  Classic: '@%#*+=-:. ',
  Detailed:
    '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  Blocks: '█▓▒░ ',
} as const;

export type AsciiCharsetName = keyof typeof AsciiCharsets;
