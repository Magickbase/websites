import { GetStaticProps, type NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image, { StaticImageData } from 'next/image'
import { ComponentProps, FC, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { UAParser } from 'ua-parser-js'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import TopShadow from './top-shadow.svg'
import BottomShadow from './bottom-shadow.svg'
import IconOval from './oval.svg'
import IconGithub from './github.svg'
import ImgNeuronOverviewEN from './neuron-overview-en.png'
import ImgNeuronOverviewZH from './neuron-overview-zh.png'
import ImgEasy from './easy.png'
import ImgPrivate from './private.png'
import ImgReliable from './reliable.png'
import ImgNeuronLogo from './neuron-logo.png'
import { ParsedAsset, Release, getAssetsFromNeuronRelease, getLatestRelease } from '../../utils'

interface PageProps {
  locale: string
  release: Release
}

const Home: NextPage<PageProps> = ({ locale, release }) => {
  const { t } = useTranslation('home')

  const ImgNeuronOverview = getNeuronOverviewImg(locale)

  return (
    <Page className={styles.page} contentWrapper={{ className: styles.contentWrapper }}>
      <TopShadow className={styles.topShadow} />

      <div className={styles.text1}>
        <Trans
          ns="home"
          i18nKey="Securely Manage Your <tag1>CKB Assets</tag1> with Ease"
          components={{
            tag1: <Emphasis />,
          }}
        />
      </div>

      <div className={styles.text2}>
        {t(
          'Designed specifically for the Nervos CKB blockchain, allowing users to securely store and manage their CKB assets, participate in Nervos Network governance, and create and manage CKB standard or lock scripts.',
        )}
      </div>

      <div className={styles.neuronOverview}>
        <Image src={ImgNeuronOverview} alt="Neuron Overview" width={1276} height={630} />
      </div>

      <div className={styles.actions}>
        <DownloadButton release={release} />

        <Link href="https://github.com/nervosnetwork/neuron" target="_blank" rel="noopener noreferrer">
          <button className={clsx(styles.btn, styles.btnGithub)}>
            <IconGithub />
            GitHub
          </button>
        </Link>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <Image src={ImgEasy} width={400} height={400} alt="Easy CKB wallet concept map" />
          <div className={styles.textWrapper}>
            <div className={styles.title}>{t('Easy to use')}</div>
            <div className={styles.description}>
              {t(
                'A friendly and clean user interface, complete with features designed to help you easily participate in Nervos network activities using your wallet.',
              )}
            </div>
          </div>
        </div>

        <div className={styles.feature}>
          <Image src={ImgPrivate} width={400} height={400} alt="Shields with a sci-fi feel" />
          <div className={styles.textWrapper}>
            <div className={styles.title}>{t('Private and Secure')}</div>
            <div className={styles.description}>
              {t(
                'The code is completely open source, no registration and login is required, only you can access your wallet, we do not collect any personal data.',
              )}
            </div>
          </div>
        </div>

        <div className={styles.feature}>
          <Image src={ImgReliable} width={400} height={400} alt="Frosted Glass Textured Statistical Statements" />
          <div className={styles.textWrapper}>
            <div className={styles.title}>{t('Reliable Support')}</div>
            <div className={styles.description}>
              {t(
                'Powered by the Nervos Foundation, it works closely with the Nervos CKB blockchain and is deeply involved in building the community and getting a head start on supporting new features.',
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.getNeuron}>
        <BottomShadow className={styles.bottomShadow} />
        <Image src={ImgNeuronLogo} alt="Neuron Logo" width={88} height={88} />
        <div className={styles.text3}>{t('Get Neuron Now')}</div>
        <div className={styles.text4}>{t('Secure and reliable, you can navigate the world of Nervos CKB')}</div>
        <DownloadButton className={styles.download} release={release} />
      </div>
    </Page>
  )
}

const Emphasis: FC<PropsWithChildren> = ({ children }) => (
  <span className={styles.emphasis}>
    {children}
    <IconOval />
  </span>
)

const DownloadButton: FC<Partial<ComponentProps<typeof Link>> & { release: Release }> = ({ release, ...linkProps }) => {
  const { t } = useTranslation('home')
  const assets = useMemo(() => getAssetsFromNeuronRelease(release), [release])
  const [asset, setAsset] = useState<ParsedAsset>()

  useEffect(() => {
    const ua = UAParser(navigator.userAgent)
    if (ua.cpu.architecture === 'amd64') ua.cpu.architecture = 'x64'

    let matchedAssets = assets.filter(asset => ua.os.name?.toLowerCase().replaceAll(' ', '') === asset.os.toLowerCase())
    if (matchedAssets.length === 0) return
    setAsset(matchedAssets[0])

    matchedAssets = matchedAssets.filter(asset => ['exe', 'dmg', 'appimage'].includes(asset.packageType.toLowerCase()))
    if (matchedAssets.length === 0) return
    setAsset(matchedAssets[0])

    matchedAssets = matchedAssets.filter(asset => ua.cpu.architecture?.toLowerCase() === asset.arch.toLowerCase())
    if (matchedAssets.length === 0) return
    setAsset(matchedAssets[0])
  }, [assets])

  return (
    <Link href={asset?.packageLink ?? '/download'} {...linkProps}>
      <button className={clsx(styles.btn, styles.btnDownload)}>
        <span>{t('Download Neuron')}</span>
        {asset && (
          <span className={styles.secondary}>
            ({asset.os} {asset.arch}-{asset.packageType})
          </span>
        )}
      </button>
    </Link>
  )
}

function getNeuronOverviewImg(locale: PageProps['locale']): StaticImageData {
  switch (locale) {
    case 'zh':
      return ImgNeuronOverviewZH
    default:
      return ImgNeuronOverviewEN
  }
}

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
