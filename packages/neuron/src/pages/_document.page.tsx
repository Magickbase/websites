import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { KEY_DARK_MODE } from '../services/AppSettings'

export default class CustomDocument<P> extends Document<P> {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <Script
            id={prepareColorSchemaClasses.name}
            dangerouslySetInnerHTML={{
              __html: `(${prepareColorSchemaClasses.toString()})(...${JSON.stringify([
                KEY_DARK_MODE,
                'themeLight',
                'themeDark',
              ])})`,
            }}
            strategy="beforeInteractive"
          />
        </body>
      </Html>
    )
  }
}

// Note that this function should not use any external code dependencies in its implementation.
// Refs: https://github.com/donavon/use-dark-mode/issues/55
function prepareColorSchemaClasses(key: string, lightModeClassName: string, darkModeClassName: string) {
  //
  // Preparing code dependencies
  //

  class PersistenceService {
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

  const persistenceService = new PersistenceService()

  function getBrowserDarkMode() {
    return typeof globalThis.window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  //
  // Logic code
  //

  // Currently only the posts page supports color schema.
  if (!location.pathname.startsWith('/posts/')) {
    document.documentElement.classList.add(darkModeClassName)
    return
  }

  const darkMode = persistenceService.get(key, getBrowserDarkMode())
  document.documentElement.classList.add(darkMode ? darkModeClassName : lightModeClassName)
}
