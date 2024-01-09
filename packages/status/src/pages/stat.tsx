import { Footer, Header } from '@magickbase-website/shared'
import { StatCard } from '@/components/StatCard'
import { api } from '../utils/api'

export default function Stat() {
  const aggregateStateQuery = api.uptime.aggregateState.useQuery()

  return (
    <>
      <Header
        githubLink=""
        navMenus={[
          { name: 'Home', link: '/' },
          { name: 'Index', link: '/stat' },
        ]}
      />
      <div className="container mx-auto mb-20 flex flex-col gap-8">
        <div>
          <div className="mb-8 text-xl text-[600]">CKB Explorer · Mainnet</div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            <StatCard title="Tip Block Time">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=19"
                className="w-full h-full"
              />
            </StatCard>
            <StatCard title="Block Height">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=10"
                className="w-full h-full"
              />
            </StatCard>
            <StatCard title="RPC&API Status">
              <iframe
                className="w-full h-full"
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=20"
              />
            </StatCard>
          </div>
        </div>

        <div>
          <div className="mb-8 text-xl text-[600]">CKB Explorer · Testnet</div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            {' '}
            <StatCard title="Tip Block Time">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=18"
                className="w-full h-full"
              />
            </StatCard>
            <StatCard title="Block Height">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=16"
                className="w-full h-full"
              />
            </StatCard>
            <StatCard title="RPC&API Status">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=17"
                className="w-full h-full"
              />
            </StatCard>
          </div>
        </div>

        <div>
          <div className="mb-8 text-xl text-[600]">Godwoken Explorer</div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <StatCard title="Mainnet Block Height">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=23"
                className="w-full h-full"
              />
            </StatCard>
            <StatCard title="Testnet Block Height">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=24"
                className="w-full h-full"
              />
            </StatCard>
          </div>
        </div>
      </div>
      <Footer className="snap-always snap-center" serviceState={aggregateStateQuery.data} serviceLink="/status" />
    </>
  )
}
