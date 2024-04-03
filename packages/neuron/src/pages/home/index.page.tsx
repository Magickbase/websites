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
import IconClose from './close.svg'
import ImgNeuronOverviewEN from './neuron-overview-en.png'
import ImgNeuronOverviewZH from './neuron-overview-zh.png'
import ImgEasy from './easy.png'
import ImgPrivate from './private.png'
import ImgReliable from './reliable.png'
import ImgNeuronLogo from './neuron-logo.png'
import { ParsedAsset, Release, NodeInfo, getAssetsFromNeuronRelease, getLatestRelease, getNodeInfo } from '../../utils'
import { Button } from '../../components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/Dialog'

interface PageProps {
  locale: string
  release: Release | null
  nodeInfo: NodeInfo | null
}

const Home: NextPage<PageProps> = ({ locale, release, nodeInfo }) => {
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
        <Image src={ImgNeuronOverview} alt="Neuron Overview" />
      </div>

      <div className={styles.actions}>
        <DownloadButton release={release} nodeInfo={nodeInfo} />

        <Link href="https://github.com/nervosnetwork/neuron" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" theme="blackwhite" className={clsx(styles.btn, styles.btnGithub)}>
            <IconGithub />
            GitHub
          </Button>
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
        <DownloadButton className={styles.download} release={release} nodeInfo={nodeInfo} />
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

const DownloadButton: FC<
  Partial<ComponentProps<typeof Link>> & {
    release: Release | null
    nodeInfo: NodeInfo | null
  }
> = ({ release, nodeInfo, ...linkProps }) => {
  const { t } = useTranslation(['download', 'home'])
  const assets = useMemo(() => (release ? getAssetsFromNeuronRelease(release) : []), [release])
  const [asset, setAsset] = useState<ParsedAsset>()

  useEffect(() => {
    void (async () => {
      const ua = await UAParser(navigator.userAgent).withClientHints()

      let matchedAssets = assets.filter(
        asset => ua.os.name?.toLowerCase().replaceAll(' ', '') === asset.os.toLowerCase(),
      )
      if (matchedAssets.length === 0) return
      setAsset(matchedAssets[0])

      matchedAssets = matchedAssets.filter(asset =>
        ['exe', 'dmg', 'appimage'].includes(asset.packageType.toLowerCase()),
      )
      if (matchedAssets.length === 0) return
      setAsset(matchedAssets[0])

      matchedAssets = matchedAssets.filter(asset => {
        const arch = asset.arch === 'x64' ? 'amd64' : asset.arch
        return ua.cpu.architecture?.toLowerCase() === arch.toLowerCase()
      })
      if (matchedAssets.length === 0) return
      setAsset(matchedAssets[0])
    })()
  }, [assets])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={clsx(styles.btn, styles.btnDownload)}>
          <span>{t('Download Neuron')}</span>
          {asset && (
            <span className={styles.secondary}>
              ({asset.os} {asset.arch}-{asset.packageType})
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            {t('Download Note')}

            <DialogClose asChild>
              <IconClose className={styles.dialogClose} />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div style={{ lineHeight: '36px' }}>
          <Trans
            t={t}
            i18nKey="node_info_alert"
            values={{
              size: nodeInfo?.data_size_g.toFixed(2),
            }}
            components={{
              tag1: <strong />,
            }}
          />
        </div>
        <DialogFooter style={{ gap: 24 }}>
          <a style={{ flex: 1, display: 'flex' }}>
            <DialogClose asChild>
              <Button className={styles.cancelBtn} style={{ width: '100%' }} variant="outlined" theme="blackwhite">
                {t('Cancel')}
              </Button>
            </DialogClose>
          </a>
          <DialogClose asChild>
            <Link href={asset?.packageLink ?? '/download'} {...linkProps} style={{ flex: 1, display: 'flex' }}>
              <Button style={{ width: '100%' }}>{t('Continue')}</Button>
            </Link>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const nodeInfo = await getNodeInfo()
  const lng = await serverSideTranslations(locale, ['common', 'home', 'download'])

  const props: PageProps = {
    locale,
    release,
    nodeInfo,
    ...lng,
  }

  return { props }
}

export default Home
