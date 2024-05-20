import { Layout } from '@/components/Layout'
import { StatCard } from '@/components/StatCard'

export default function Stat() {
  return (
    <Layout>
      <div className="container pt-10 pb-[88px] flex flex-col gap-8">
        <div>
          <div className="mb-6 text-xl text-[600]">CKB Explorer · Mainnet</div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            <StatCard title="Tip Block Time">
              <iframe
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=19"
                className="w-full h-full skeleton"
              />
            </StatCard>
            <StatCard title="Block Height">
              <iframe
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=10"
                className="w-full h-full skeleton"
              />
            </StatCard>
            <StatCard title="RPC&API Status">
              <iframe
                className="w-full h-full skeleton"
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=20"
              />
            </StatCard>
          </div>
        </div>

        <div>
          <div className="mb-6 text-xl text-[600]">CKB Explorer · Testnet</div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            <StatCard title="Tip Block Time">
              <iframe
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=18"
                className="w-full h-full skeleton"
              />
            </StatCard>
            <StatCard title="Block Height">
              <iframe
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=16"
                className="w-full h-full skeleton"
              />
            </StatCard>
            <StatCard title="RPC&API Status">
              <iframe
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=17"
                className="w-full h-full skeleton"
              />
            </StatCard>
          </div>
        </div>

        <div>
          <div className="mb-6 text-xl text-[600]">Godwoken Explorer</div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <StatCard title="Mainnet Block Height">
              <iframe
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=23"
                className="w-full h-full skeleton"
              />
            </StatCard>
            <StatCard title="Testnet Block Height">
              <iframe
                src="https://grafana.magickbase.com/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&refresh=5s&panelId=24"
                className="w-full h-full skeleton"
              />
            </StatCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}
