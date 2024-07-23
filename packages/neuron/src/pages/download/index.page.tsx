import { GetStaticProps, type NextPage } from 'next'
import { useTranslation, Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useMemo } from 'react'
import { useIsMobile } from '@magickbase-website/shared'
import {
  CompatibleData,
  Release,
  NodeInfo,
  getAssetsFromNeuronRelease,
  getLatestRelease,
  getNeuronCompatibleData,
  getNodeInfo,
} from '../../utils'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import ImgNeuronLogo from './neuron-logo.png'
import ImgDownloadWallet from './download-wallet.png'
import { Assets } from './Assets'
import { CompatibleTable } from './CompatibleTable'

interface PageProps {
  release: Release | null
  compatibleData: CompatibleData | null
  nodeInfo: NodeInfo | null
}

const Download: NextPage<PageProps> = ({ release, compatibleData, nodeInfo }) => {
  const { t } = useTranslation('download')
  const isMobile = useIsMobile()

  const assets = useMemo(() => (release ? getAssetsFromNeuronRelease(release) : []), [release])

  const versionComp = (
    <div className={styles.version}>
      {t('Current Version')} {release?.tag_name}
    </div>
  )

  return (
    <Page className={styles.page} contentWrapper={{ className: styles.contentWrapper }}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.neuron}>
            <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
            <span className={styles.name}>Neuron</span>
          </div>

          <div className={styles.text1}>{t('Download Neuron')}</div>

          {!isMobile && versionComp}
        </div>

        <div className={styles.right}>
          <Image className={styles.imgDownload} src={ImgDownloadWallet} alt="Help" width={200} height={168} />
        </div>
      </div>

      {isMobile && versionComp}

      {nodeInfo && (
        <div className={styles.alert} style={{ marginTop: isMobile ? 24 : 32 }}>
          {t('Download Note')}:
          <br />
          <ol>
            <li>
              <Trans
                t={t}
                i18nKey="node_info_alert"
                values={{
                  size: nodeInfo.data_size_g.toFixed(2),
                }}
                components={{
                  tag1: <strong />,
                }}
              />
            </li>
            <li>
              <Trans
                t={t}
                i18nKey="c_plus_plus_redistributable"
                components={[
                  <a
                    target="_blank"
                    href={'https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist?view=msvc-170'}
                    key="c++"
                  />,
                ]}
              />
            </li>
          </ol>
        </div>
      )}

      <Assets className={styles.assets} assets={assets} />

      {compatibleData && (
        <>
          <div className={styles.ckbNodeCompatible}>CKB Node Compatibility</div>
          <CompatibleTable wrapperClass={styles.compatibleTable} compatibleData={compatibleData} />
        </>
      )}
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const release = await getLatestRelease()
  const compatibleData = await getNeuronCompatibleData()
  const nodeInfo = await getNodeInfo()
  const lng = await serverSideTranslations(locale, ['common', 'download'])

  const props: PageProps = {
    release,
    compatibleData,
    nodeInfo,
    ...lng,
  }

  return { props }
}

export default Download
