import { useEffect } from 'react'
import { type AppType } from 'next/app'
import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import localFont from 'next/font/local'
import { api } from '../utils/api'
import '../styles/globals.scss'
import { TooltipProvider } from '../components/Tooltip'

const fontProximaNova = localFont({
  src: [
    { path: '../styles/fonts/ProximaNova-Regular.otf', weight: '400' },
    { path: '../styles/fonts/ProximaNova-Semibold.otf', weight: '600' },
    { path: '../styles/fonts/ProximaNova-Bold.otf', weight: '700' },
  ],
  preload: true,
})

const App: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    document.body.classList.add(fontProximaNova.className)
    return () => document.body.classList.remove(fontProximaNova.className)
  }, [])

  return (
    <TooltipProvider>
      <Head>
        <title>Neuron Troubleshooting</title>
        <link rel="icon" type="image/svg" href="/favicon.svg" />
        <meta property="og:type" content="website" />
      </Head>
      <main
        // Here as redundancy in server-side rendering.
        className={fontProximaNova.className}
      >
        <Component {...pageProps} />
      </main>
    </TooltipProvider>
  )
}

export default api.withTRPC(appWithTranslation(App))
