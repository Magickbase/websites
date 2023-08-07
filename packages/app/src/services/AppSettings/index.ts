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

  darkMode$ = new BehaviorSubject(this.persistenceService.get<boolean>('darkMode', false))
  setDarkMode(value: boolean) {
    this.darkMode$.next(value)
  }
}

export const appSettings = new AppSettings(persistenceService)
