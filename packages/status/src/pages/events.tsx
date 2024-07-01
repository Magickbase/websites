import dayjs from 'dayjs'
import { FC, useState } from 'react'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import classnames from 'classnames'
import { api } from '@/utils/api'
import { Layout } from '@/components/Layout'
import NextIcon from './next.svg'
import PreviousIcon from './previous.svg'

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
})

const EventPage: FC<{ page?: number }> = ({ page = 1 }) => {
  const incidentsQuery = api.uptime.listStatusIncidents.useQuery({ page })
  const { t } = useTranslation('common')

  if (!incidentsQuery.data) {
    return new Array(10)
      .fill('')
      .map((_, index) => <div key={`skeleton-${index}`} className="skeleton h-[129px] md:h-[41px] w-full" />)
  }

  return incidentsQuery.data?.map(incident => {
    const intraday =
      dayjs(incident.attributes.started_at).format('YYYY-MM-DD') ===
      dayjs(incident.attributes.resolved_at).format('YYYY-MM-DD')

    return (
      <div
        key={incident.id}
        className="flex flex-col md:flex-row md:justify-between text-[#F5F5F5] pb-4 border-b border-[#FFFFFF33]"
      >
        <div className="text-nowrap truncate mb-2 md:mb-0">
          {dayjs(incident.attributes.started_at).format('YYYY-MM-DD hh:mm')} ~{' '}
          {dayjs(incident.attributes.resolved_at).format(intraday ? 'hh:mm' : 'YYYY-MM-DD hh:mm')}
        </div>
        <div className="md:text-nowrap md:truncate mb-2 md:mb-0 text-[#999999]">
          <Trans
            i18nKey="due_to"
            t={t}
            values={{
              service: incident.attributes.name,
              cause: incident.attributes.cause,
            }}
          />
        </div>

        <div className="flex">
          <div className="mr-2 md:hidden">{incident.attributes.name}</div>
          <div className="py-[2px] px-4 rounded-md bg-[#F62A2A] text-sm">{t('downtime')}</div>
        </div>
      </div>
    )
  })
}

export default function Event() {
  const [page, setPage] = useState(1)
  const [goto, setGoto] = useState('')
  const { t } = useTranslation('common')

  const incidentPages = api.uptime.countIncidentPages.useQuery()

  const btnClass = 'btn btn-outline hover:border-primary hover:bg-transparent hover:text-primary'

  return (
    <Layout>
      <div className="container pt-10 pb-[88px] flex flex-col">
        <div className="text-xl mb-6 text-[600]">{t('history_events')}</div>
        <div className="border border-[#FFFFFF33] border-solid rounded-3xl p-6 bg-gradient-to-b from-[#36363666] to-[#1D1D1D33]">
          <div className="flex flex-col gap-4 mb-8">
            <EventPage key={page} page={page} />
          </div>
          {incidentPages.data && incidentPages.data > 1 && (
            <div className="relative flex gap-2 justify-center">
              <button
                className={classnames(btnClass, 'hidden md:block')}
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                First
              </button>

              <button className={classnames(btnClass)} onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>
                <PreviousIcon />
              </button>

              <div
                className={classnames(
                  'flex items-center px-4 text-base-content border border-[currentColor] rounded-btn',
                )}
              >
                Page {page} of {incidentPages.data}
              </div>

              <button
                className={classnames(btnClass)}
                onClick={() => setPage(prev => prev + 1)}
                disabled={page === incidentPages.data}
              >
                <NextIcon />
              </button>

              <button
                className={classnames(btnClass, 'hidden md:block')}
                onClick={() => setPage(incidentPages.data)}
                disabled={page === incidentPages.data}
              >
                Last
              </button>

              <div className="absolute h-full hidden lg:flex right-0 items-center">
                <span className="mr-2 text-[#f5f5f580]">page</span>
                <input
                  className="input text-base-content border-[currentColor] focus:outline-none focus:border-[currentColor] mr-2 w-16"
                  value={goto}
                  onChange={e =>
                    setGoto(Number.isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value).toString())
                  }
                />
                <button
                  className={classnames(btnClass)}
                  onClick={() => {
                    setPage(Math.max(Math.min(parseInt(goto), incidentPages.data), 1))
                  }}
                >
                  Goto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
