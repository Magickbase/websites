import { Footer, Header } from '@magickbase-website/shared'
import styles from './page.module.css'
import { api } from '../utils/api'
import type { StatusResourceResponse, StatusSection } from '@/types'
import { TailwindToaster } from '@/components/Toaster'
import { StatusResource } from '@/components/StatusResource'
import classNames from 'classnames'

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
          <div className="flex gap-4">
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704739896992&to=1704740196992&refresh=5s&panelId=19"
                width="360"
                height="200"
                frameBorder="0"
              />
            </div>
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704739976569&to=1704740276569&refresh=5s&panelId=10"
                width="360"
                height="200"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704740010681&to=1704740310681&refresh=5s&panelId=20"
                width="360"
                height="200"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8 text-xl text-[600]">CKB Explorer · Testnet</div>
          <div className="flex gap-4">
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704740194724&to=1704740494724&refresh=5s&panelId=18"
                width="360"
                height="200"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704740213280&to=1704740513280&refresh=5s&panelId=16"
                width="360"
                height="200"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704740233268&to=1704740533268&refresh=5s&panelId=17"
                width="360"
                height="200"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8 text-xl text-[600]">Godwoken Explorer</div>
          <div className="flex gap-4">
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704740386887&to=1704740686887&refresh=5s&panelId=23"
                width="560"
                height="200"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-2 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
              <iframe
                src="https://grafana.layerview.io/d-solo/gEWc1Gq4k/ckb-dashboard?orgId=1&from=1704740437599&to=1704740737599&refresh=5s&panelId=24"
                width="560"
                height="200"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer className="snap-always snap-center" serviceState={aggregateStateQuery.data} serviceLink="/status" />
    </>
  )
}
