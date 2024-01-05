export function isClient() {
  return typeof window !== 'undefined'
}

export * from './env'
