declare module 'chunk-text' {
  export default function chunkText(
    text: string,
    chunkSize: number,
    options?: {
      charLengthMask?: number
      charLengthType?: 'length' | 'TextEncoder'
      textEncoder?: Pick<TextEncoder, 'encode'>
    },
  ): string[]
}
