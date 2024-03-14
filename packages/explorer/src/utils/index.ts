export function isClient() {
  return typeof window !== 'undefined'
}

export * from './api'
export * from './github'
export * from './env'
