// TODO: The two files need to be merged later.
import './globals.css'
import '../styles/globals.scss'
import 'overlayscrollbars/overlayscrollbars.css'
import type { AppProps } from 'next/app'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { api } from '../utils/api'
import { TooltipProvider } from '../components/Tooltip'

function App({ Component, pageProps }: AppProps) {
  const { ready } = useTranslation('app')

  console.log('app ready', ready)

  return (
    <TooltipProvider>
      <Component {...pageProps} />
    </TooltipProvider>
  )
}

export default api.withTRPC(appWithTranslation(App))
