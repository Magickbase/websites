import { api } from '@/utils/api'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { TailwindToaster } from '@/components/Toaster'
import { StatusResource } from '@/components/StatusResource'
import { Layout } from '@/components/Layout'
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

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
})

export default function Home() {
  const { t } = useTranslation('common')
  const resourceQuery = api.uptime.listStatusPageResources.useQuery()
  const sectionQuery = api.uptime.listStatusPageSections.useQuery()

  return (
    <Layout>
      <div className="container pt-10 pb-[88px]">
        <div className="flex flex-col md:flex-row md:items-center mb-14">
          <span className="mr-4 text-4xl font-bold">{t('service_monitor')}</span>
          <iframe
            src="https://status.magickbase.com/badge?theme=dark"
            width="250"
            height="30"
            frameBorder="0"
            scrolling="no"
          />
        </div>
        <div className="flex flex-col gap-12">
          {resourceQuery.isLoading && [
            <div key="1">
              <div className="text-xl mb-6 skeleton w-40 h-[28px]" />
              <div className="w-full h-80 skeleton rounded-3xl" />
            </div>,
            <div key="2">
              <div className="text-xl mb-6 skeleton w-40 h-[28px]" />
              <div className="w-full h-80 skeleton rounded-3xl" />
            </div>,
          ]}
          {sectionQuery.data?.map(section => (
            <div key={section.id}>
              <div className="text-xl mb-6">{section.attributes.name}</div>

              <div
                className={classNames(
                  'border border-[#FFFFFF33] border-solid rounded-3xl p-6 flex flex-col gap-8',
                  'bg-gradient-to-b from-[#36363666] to-[rgba(29,29,29,0.2)]',
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
    </Layout>
  )
}
