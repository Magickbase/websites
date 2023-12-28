export function isClient() {
  return typeof window !== 'undefined'
}

export * from './api'
export * from './github'
export * from './posts'
export * from './algolia'
export * from './route'
export * from './env'
export * from './const'
