export function isClient() {
  return typeof window !== 'undefined'
}

export const deepClone = <T>(object: unknown): T => JSON.parse(JSON.stringify(object)) as T

export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const newObj: Partial<Pick<T, K>> = {}
  keys.forEach(key => {
    if (!(key in obj)) return
    newObj[key] = obj[key]
  })
  return newObj as Pick<T, K>
}

export function omitNullValue<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: T[K] extends null | undefined ? never : T[K] } {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null)) as {
    [K in keyof T]: T[K] extends null | undefined ? never : T[K]
  }
}

export * from './api'
export * from './number'
export * from './time'
export * from './github'
export * from './posts'
export * from './algolia'
export * from './route'
export * from './array'
export * from './env'
export * from './const'
