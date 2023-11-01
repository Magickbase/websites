export function clampNumber(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}

export function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * Example: range(0, 5) // [0, 1, 2, 3, 4]
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => i + start)
}
