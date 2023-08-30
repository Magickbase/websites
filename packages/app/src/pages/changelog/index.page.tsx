import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import { Release, getReleases } from '../../utils'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import ImgNeuronLogo from './neuron-logo.png'
import { useMarkdownProps } from '../../hooks'

interface PageProps {
  releases: Release[]
}

const Changelog: NextPage<PageProps> = ({ releases }) => {
  const { t } = useTranslation('changelog')

  const mdProps = useMarkdownProps({ supportToc: false, imgClass: styles.img })

  return (
    <Page className={styles.page}>
      <div className={styles.top}>
        <div className={styles.neuron}>
          <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
          <span className={styles.name}>Neuron</span>
        </div>

        <div className={styles.text1}>{t('changelog')}</div>

        <div className={styles.text2}>
          Neuron wallet new features and updates summary, join{' '}
          <Link href="https://github.com/nervosnetwork/neuron" target="_blank" rel="noopener noreferrer">
            Github
          </Link>{' '}
          to learn more about the project progress.
        </div>
      </div>

      <div className={styles.releases}>
        {/* TODO: If we were to manually parse the required content from the release here, it would be too complex and not robust,
        so let's implement a simple solution for now and have the neuron team provide a file specifically for reading later. */}
        {releases.map(release => (
          <div key={release.id} className={styles.release}>
            <div className={styles.left}>
              {`${release.tag_name.replace('v', '')} (${release.published_at?.split('T')[0] ?? ''})`}
            </div>
            <div className={styles.right}>
              <ReactMarkdown {...mdProps}>{release.body?.replace(/^#[^#]*?\(.*?\)\s+/, '') ?? ''}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const releases = await getReleases(10)
  const lng = await serverSideTranslations(locale, ['common', 'changelog'])

  const props: PageProps = {
    releases,
    ...lng,
  }

  return { props }
}

export default Changelog
