import { GetStaticProps, type NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { FC, PropsWithChildren } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useIsMobile } from '@magickbase-website/shared'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import TopShadow from './top-shadow.svg'
import IconTitleShadow from './title-shadow.svg'
import IconGithub from './github.svg'
import ImgOverview from './overview.png'
import ImgDataOverview from './data-overview.png'
import ImgSummary from './summary.png'
import ImgAnalysis from './analysis.png'
import ImgExperience from './experience.png'
import ImgOverviewMb from './overviewMb.png'
import ImgExperienceMb from './experienceMb.png'
import ImgAnalysisMb from './analysisMb.png'
import ImgAnalysisMb2 from './analysisMb2.png'
import ImgSummaryMb3 from './summaryMb3.png'
import ImgSummaryMb2 from './summaryMb2.png'
import ImgSummaryMb1 from './summaryMb1.png'
import ImgDataMb from './dataMb.png'

import { Release, getLatestRelease } from '../../utils'
import { Button } from '../../components/Button'

interface PageProps {
  locale: string
  release: Release | null
}

const Home: NextPage<PageProps> = ({ locale, release }) => {
  const { t } = useTranslation('home')
  const isMobile = useIsMobile()

  return (
    <Page className={styles.page} contentWrapper={{ className: styles.contentWrapper }}>
      <TopShadow className={styles.topShadow} />

      <div className={styles.text1}>
        <Trans
          ns="home"
          i18nKey="Unlocking the Potential of the <tag1>Nervos Blockchain</tag1>"
          components={{
            tag1: <Emphasis />,
          }}
        />
      </div>

      <div className={styles.text2}>
        {t(
          'CKB Explorer is a blockchain explorer that provides users with a real-time view of the Nervos CKB blockchain. It allows users to search for specific transactions, blocks, and addresses, and provides detailed information on each transaction and block, including the status, timestamp, and fees.',
        )}
      </div>

      <div className={styles.overview}>
        <Image src={isMobile ? ImgOverviewMb : ImgOverview} alt="CKB Explorer Overview" />
      </div>

      <div className={styles.actions}>
        <Link href="https://explorer.nervos.org/" target="_blank" rel="noopener noreferrer" style={{ zIndex: 2 }}>
          <Button className={clsx(styles.btn, styles.btnPrimary)}>
            <span>{t('Go to CKB Explorer')}</span>
          </Button>
        </Link>

        <Link
          href="https://github.com/nervosnetwork/ckb-explorer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ zIndex: 2 }}
        >
          <Button variant="outlined" theme="blackwhite" className={clsx(styles.btn, styles.btnGithub)}>
            <IconGithub />
            GitHub
          </Button>
        </Link>
      </div>

      <div
        className={clsx(styles.card, styles.verticalContentCard, { [styles.textCenter || '']: isMobile })}
        style={{ marginTop: isMobile ? 64 : 256 }}
      >
        <div className={styles.cardTitle}>{t('Real-time parsing of data on the chain')}</div>
        <div className={styles.cardText}>
          {t(
            `Main chain information, block information, transaction information, contract information and address information all in one place to help you keep track of what's happening on the chain.`,
          )}
        </div>
        {isMobile ? (
          <img src={ImgDataMb.src} style={{ width: '100%' }} alt="CKB Explorer Data Overview" />
        ) : (
          <img src={ImgDataOverview.src} style={{ width: 'calc(100% + 24px)' }} alt="CKB Explorer Data Overview" />
        )}
      </div>

      <div className={styles.col} style={{ marginTop: 24 }}>
        <div className={clsx(styles.card, styles.verticalContentCard, { [styles.textCenter || '']: isMobile })}>
          <div className={styles.cardTitle}>{t('Chain assets summary display')}</div>
          <div className={styles.cardText}>
            {t(
              `Nervos DAO, Tokens, and NFT collection assets at a glance to help you understand the status of your on-chain projects right away.`,
            )}
          </div>
          {isMobile ? (
            <>
              <img src={ImgSummaryMb1.src} style={{ maxWidth: '100%' }} alt="assets summary" />
              <img src={ImgSummaryMb2.src} style={{ maxWidth: '100%' }} alt="assets summary" />
              <img src={ImgSummaryMb3.src} style={{ maxWidth: '100%' }} alt="assets summary" />
            </>
          ) : (
            <img src={ImgSummary.src} style={{ maxWidth: '100%' }} alt="assets summary" />
          )}
        </div>

        <div className={clsx(styles.card, styles.verticalContentCard, { [styles.textCenter || '']: isMobile })}>
          <div className={styles.cardTitle}>{t('Multidimensional analysis of data charts')}</div>
          <div className={styles.cardText}>
            {t(
              `Provide multi-dimensional, multi-type data chart display, is a good helper for you to analyze data and make decisions.`,
            )}
          </div>
          {isMobile ? (
            <>
              <img src={ImgAnalysisMb.src} style={{ maxWidth: '100%' }} alt="analysis" />
              <img src={ImgAnalysisMb2.src} style={{ maxWidth: '100%' }} alt="analysis" />
            </>
          ) : (
            <img src={ImgAnalysis.src} style={{ maxWidth: '100%' }} alt="analysis" />
          )}
        </div>
      </div>

      <div className={clsx(styles.card, styles.verticalContentCard)} style={{ marginTop: 24, marginBottom: 256 }}>
        <div className={clsx(styles.cardTitle, styles.textCenter)}>{t('Experience CKB Explorer Now')}</div>
        <div className={clsx(styles.cardText, styles.textCenter)}>
          {t(`Easy to grasp information on the chain to help you start your journey to the world of CKB`)}
        </div>

        <div className={clsx(styles.relative)}>
          {isMobile ? (
            <img src={ImgExperienceMb.src} style={{ width: '100%' }} alt="experience" />
          ) : (
            <Image src={ImgExperience} style={{ maxWidth: '100%' }} alt="experience" />
          )}

          <div className={styles.centering}>
            <Link href="https://explorer.nervos.org/" target="_blank" rel="noopener noreferrer" style={{ zIndex: 2 }}>
              <Button className={clsx(styles.btn, styles.btnPrimary)}>
                <span>{t('Go to CKB Explorer')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Page>
  )
}

const Emphasis: FC<PropsWithChildren> = ({ children }) => (
  <span className={styles.emphasis}>
    {children}
    <IconTitleShadow />
  </span>
)

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const release = await getLatestRelease()
  const lng = await serverSideTranslations(locale, ['common', 'home'])

  const props: PageProps = {
    locale,
    release,
    ...lng,
  }

  return { props }
}

export default Home
