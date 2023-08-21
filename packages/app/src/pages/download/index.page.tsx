import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import clsx from 'clsx'
import { BooleanT, Release, getAssetsFromNeuronRelease, getLatestRelease } from '../../utils'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import ImgNeuronLogo from './neuron-logo.png'
import ImgDownloadWallet from './download-wallet.png'
import IconWindows from './windows.svg'
import IconMacOS from './macos.svg'
import IconLinux from './linux.svg'
import IconTips from './tips.svg'
import { Tooltip } from '../../components/Tooltip'

interface PageProps {
  release: Release
}

const HelpCenter: NextPage<PageProps> = ({ release }) => {
  const { t } = useTranslation('download')

  const assets = useMemo(() => getAssetsFromNeuronRelease(release), [release])

  return (
    <Page className={styles.page}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.neuron}>
            <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
            <span className={styles.name}>Neuron</span>
          </div>

          <div className={styles.text1}>{t('download_neuron')}</div>

          <div className={styles.version}>Current Version {release.tag_name}</div>
        </div>

        <div className={styles.right}>
          <Image src={ImgDownloadWallet} alt="Help" width={200} height={168} />
        </div>
      </div>

      <table className={styles.assets}>
        <thead>
          <tr className={clsx(styles.row, styles.head)}>
            <th>System</th>
            <th>Architecture</th>
            <th>Package Type</th>
            <th>
              <div className={styles.checksum}>
                Checksum
                <Tooltip content="After the download is complete, you can check the Checksum to ensure that the installation package has not been tampered with during the download process.">
                  <IconTips />
                </Tooltip>
              </div>
            </th>
            <th>Operation</th>
          </tr>
        </thead>

        <tbody>
          {assets.map(asset => (
            <tr key={asset.os + asset.arch + asset.packageType} className={styles.row}>
              <td>
                <div className={styles.os}>
                  {asset.os.toLowerCase() === 'windows' && <IconWindows />}
                  {asset.os.toLowerCase() === 'macos' && <IconMacOS />}
                  {asset.os.toLowerCase() === 'linux' && <IconLinux />}
                  {asset.os}
                </div>
              </td>
              <td>{asset.arch}</td>
              <td>{asset.packageType}</td>
              <td>{asset.checksum}</td>
              <td className={styles.operation}>
                <Link href={asset.packageLink} target="_blank" rel="noopener noreferrer">
                  Download
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const release = await getLatestRelease()
  const lng = await serverSideTranslations(locale, ['common', 'download'])

  const props: PageProps = {
    release,
    ...lng,
  }

  return { props }
}

export default HelpCenter
