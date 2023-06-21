import { randomInt } from './number'

export function sample<T>(arr: T[]): T | undefined {
  return arr[randomInt(0, arr.length - 1)]
}

export const BooleanT =
  <T>() =>
  (a: T | '' | 0 | 0n | false | null | undefined | void): a is T => {
    return Boolean(a)
  }
