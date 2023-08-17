import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image, { StaticImageData } from 'next/image'
import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
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

interface PageProps {
  locale: string
}

const Home: NextPage<PageProps> = ({ locale }) => {
  const { t } = useTranslation('home')

  const ImgNeuronOverview = getNeuronOverviewImg(locale)

  return (
    <Page className={styles.page} contentWrapper={{ className: styles.contentWrapper }}>
      <TopShadow className={styles.topShadow} />

      <div className={styles.text1}>
        Securely Manage Your{' '}
        <span className={styles.emphasis}>
          CKB Assets
          <IconOval />
        </span>{' '}
        with Ease
      </div>

      <div className={styles.text2}>
        Designed specifically for the Nervos CKB blockchain, allowing users to securely store and manage their CKB
        assets, participate in Nervos Network governance, and create and manage CKB standard or lock scripts.
      </div>

      <div className={styles.neuronOverview}>
        <Image src={ImgNeuronOverview} alt="Neuron Overview" width={1276} height={630} />
      </div>

      <div className={styles.actions}>
        <DownloadButton />

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
            <div className={styles.title}>Easy to use</div>
            <div className={styles.description}>
              A friendly and clean user interface, complete with features designed to help you easily participate in
              Nervos network activities using your wallet.
            </div>
          </div>
        </div>

        <div className={styles.feature}>
          <Image src={ImgPrivate} width={400} height={400} alt="Shields with a sci-fi feel" />
          <div className={styles.textWrapper}>
            <div className={styles.title}>Private and Secure</div>
            <div className={styles.description}>
              The code is completely open source, no registration and login is required, only you can access your
              wallet, we do not collect any personal data.
            </div>
          </div>
        </div>

        <div className={styles.feature}>
          <Image src={ImgReliable} width={400} height={400} alt="Frosted Glass Textured Statistical Statements" />
          <div className={styles.textWrapper}>
            <div className={styles.title}>Reliable Support</div>
            <div className={styles.description}>
              Powered by the Nervos Foundation, it works closely with the Nervos CKB blockchain and is deeply involved
              in building the community and getting a head start on supporting new features.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.getNeuron}>
        <BottomShadow className={styles.bottomShadow} />
        <Image src={ImgNeuronLogo} alt="Neuron Logo" width={88} height={88} />
        <div className={styles.text3}>Get Neuron Now</div>
        <div className={styles.text4}>Secure and reliable, you can navigate the world of Nervos CKB</div>
        <DownloadButton className={styles.download} />
      </div>
    </Page>
  )
}

const DownloadButton: FC<Partial<ComponentProps<typeof Link>>> = props => {
  // TODO: auto detect system and auto provide download link
  return (
    <Link href="/download" target="_blank" rel="noopener noreferrer" {...props}>
      <button className={clsx(styles.btn, styles.btnDownload)}>
        <span>Download Neuron</span>
        <span className={styles.secondary}>(Windows x64-EXE)</span>
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
  const lng = await serverSideTranslations(locale, ['common', 'home'])

  return { props: { ...lng } }
}

export default Home
