// TODO: The two files need to be merged later.
import './globals.css'
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { api } from '../utils/api'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default api.withTRPC(appWithTranslation(App))
