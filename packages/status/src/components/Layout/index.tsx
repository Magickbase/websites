import { Footer, Header } from '@magickbase-website/shared'
import { api } from '@/utils/api'
import { PropsWithChildren } from 'react'

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const aggregateStateQuery = api.uptime.aggregateState.useQuery()

  return (
    <>
      <Header
        navMenuGroupName='Status'
        navMenus={[
          { name: 'Home', link: '/' },
          { name: 'Index', link: '/stat' },
          { name: 'History Events', link: '/events' },
        ]}
      />
      {children}
      <Footer className="snap-always snap-center" serviceState={aggregateStateQuery.data} serviceLink="/status" />
    </>
  )
}
