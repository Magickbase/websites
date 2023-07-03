import { type AppType } from 'next/app'
import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import { api } from '../utils/api'
import '../styles/globals.scss'

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Neuron Troubleshooting</title>
        <link rel="icon" type="image/svg" href="/favicon.svg" />
        <meta property="og:type" content="website" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default api.withTRPC(appWithTranslation(App))
