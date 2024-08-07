import { useTranslation } from 'next-i18next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { api } from '@/utils/api'
import { PropsWithChildren } from 'react'

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('common')
  const aggregateStateQuery = api.uptime.aggregateState.useQuery()

  return (
    <>
      <Header
        navMenuGroupName={t('Service Monitor')}
        navMenus={[
          { name: t('home'), link: '/' },
          { name: t('index'), link: '/stat' },
          { name: t('history_events'), link: '/events' },
        ]}
      />
      <div className='px-6'>
        {children}
      </div>
      <Footer className="snap-always snap-center" serviceState={aggregateStateQuery.data} serviceLink="/status" />
    </>
  )
}
