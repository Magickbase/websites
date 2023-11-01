export class PersistenceService {
  get<T = unknown>(key: string, defaultValue: T): T
  get<T = unknown>(key: string, defaultValue?: T): T | undefined {
    // in SSR mode
    if (typeof localStorage === 'undefined') return defaultValue
    const jsonStr = localStorage.getItem(key)
    if (!jsonStr) return defaultValue
    return JSON.parse(jsonStr) as T
  }

  set<T = unknown>(key: string, value: T): T {
    // in SSR mode
    if (typeof localStorage === 'undefined') return value
    localStorage.setItem(key, JSON.stringify(value))
    return value
  }
}

export const persistenceService = new PersistenceService()
