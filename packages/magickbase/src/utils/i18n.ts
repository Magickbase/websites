import { Namespace, TFunction } from 'i18next'

export function createI18nKeyAdder<N extends Namespace, TKPrefix = undefined>(ns: N): TFunction<N, TKPrefix> {
  const addI18nKey = (key: string) => key
  return addI18nKey as TFunction<N, TKPrefix>
}
