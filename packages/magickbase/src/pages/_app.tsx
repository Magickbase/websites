// TODO: The two files need to be merged later.
import './globals.css'
import '../styles/globals.scss'
import 'overlayscrollbars/overlayscrollbars.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { useHighPrecisionScrollbarWidth } from '@magickbase-website/shared'
import { OverlayScrollbars } from 'overlayscrollbars'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { api } from '../utils/api'
import { TooltipProvider } from '../components/Tooltip'

function App({ Component, pageProps }: AppProps) {
  const { tester, scrollbarWidth } = useHighPrecisionScrollbarWidth()
  const [initBodyOverlayScrollbars, getBodyOverlayScrollbarsInstance] = useOverlayScrollbars()

  useEffect(() => {
    const env = OverlayScrollbars.env()
    env.setDefaultOptions({
      ...env.staticDefaultOptions,
      scrollbars: {
        ...env.staticDefaultOptions.scrollbars,
        autoHide: 'move',
      },
      // Only replace the scrollbar when it has a width (e.g., on Windows PC's Chrome browser).
      showNativeOverlaidScrollbars: scrollbarWidth === 0,
    })

    initBodyOverlayScrollbars(document.body)
    return () => getBodyOverlayScrollbarsInstance()?.destroy()
  }, [getBodyOverlayScrollbarsInstance, initBodyOverlayScrollbars, scrollbarWidth])

  return (
    <TooltipProvider>
      <Component {...pageProps} />
      {tester}
    </TooltipProvider>
  )
}

export default api.withTRPC(appWithTranslation(App))
