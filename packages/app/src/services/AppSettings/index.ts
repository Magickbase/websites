import { BehaviorSubject, tap } from 'rxjs'
import { PersistenceService, persistenceService } from '../PersistenceService'

export class AppSettings {
  constructor(private persistenceService: PersistenceService) {
    this.darkMode$
      .pipe(
        tap(value => {
          this.persistenceService.set<boolean>('darkMode', value)
          return value
        }),
      )
      .subscribe()
  }

  darkMode$ = new BehaviorSubject(this.persistenceService.get<boolean>('darkMode', getBrowserDarkMode()))
  setDarkMode(value: boolean) {
    this.darkMode$.next(value)
  }
}

function getBrowserDarkMode() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const appSettings = new AppSettings(persistenceService)
