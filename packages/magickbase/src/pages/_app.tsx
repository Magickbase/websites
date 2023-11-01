import './globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation, useTranslation } from 'next-i18next'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default appWithTranslation(App)
