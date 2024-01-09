import { Footer, Header } from '@magickbase-website/shared'
import styles from './page.module.css'
import { api } from '../utils/api'
import type { StatusResourceResponse, StatusSection } from '@/types'
import { TailwindToaster } from '@/components/Toaster'
import { StatusResource } from '@/components/StatusResource'
import classNames from 'classnames'

const LinkMap: Record<string, string> = {
  ['CKB Public Node:Mainnet']: 'https://mainnet.ckb.dev/rpc',
  ['CKB Public Node:Testnet']: 'https://testnet.ckb.dev/rpc',
  ['CKB Explorer:Mainnet']: 'https://explorer.nervos.org',
  ['CKB Explorer:Testnet']: 'https://pudge.explorer.nervos.org',
  ['Godwoken Explorer:Godwoken Explorer Mainnet']: 'https://v1.gwscan.com',
  ['Godwoken Explorer:Godwoken Explorer Testnet']: 'https://v1.testnet.gwscan.com',
  ['Faucet:Faucet']: 'https://faucet.nervos.org',
}

export default function Home() {
  const aggregateStateQuery = api.uptime.aggregateState.useQuery()
  const resourceQuery = api.uptime.listStatusPageResources.useQuery()
  const sectionQuery = api.uptime.listStatusPageSections.useQuery()

  return (
    <>
      <Header
        githubLink=''
        navMenus={[
          { name: 'Home', link: '/' },
          { name: 'Index', link: '/stat' },
        ]}
      />
      <div className="container mx-auto mb-20">
        <div className="flex items-center mb-12">
          <span className="mr-4 text-4xl font-bold">Service Monitor</span>
          <iframe
            src="https://status.magickbase.com/badge?theme=dark"
            width="250"
            height="30"
            frameBorder="0"
            scrolling="no"
          />
        </div>
        <div className="flex flex-col gap-12">
          {sectionQuery.data?.map(section => (
            <div key={section.attributes.status_page_id}>
              <div className="text-xl mb-6">{section.attributes.name}</div>

              <div
                className={classNames(
                  'border border-[#FFFFFF33] border-solid rounded-3xl p-6 flex flex-col gap-8',
                  'bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]',
                )}
              >
                {resourceQuery.data
                  ?.filter(resource => resource.attributes.status_page_section_id.toString() === section.id)
                  .map(resource => (
                    <StatusResource
                      key={resource.id}
                      link={LinkMap[`${section.attributes.name}:${resource.attributes.public_name}`]}
                      resource={resource}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <TailwindToaster />
      <Footer className="snap-always snap-center" serviceState={aggregateStateQuery.data} serviceLink="/status" />
    </>
  )
}
