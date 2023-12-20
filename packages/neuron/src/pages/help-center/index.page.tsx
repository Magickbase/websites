import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import { DocSearch } from '@docsearch/react'
import '@docsearch/css'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import { APPID, Menu, SEARCH_KEY, getMenusWithPosts, getPostURL, removeURLOrigin } from '../../utils'
import ImgNeuronLogo from './neuron-logo.png'
import ImgHelp from './help.png'
import IconMore from './more.svg'
import { LinkWithEffect, UpsideDownEffect } from '../../components/UpsideDownEffect'

interface PageProps {
  menusWithPosts: Menu[]
}

const HelpCenter: NextPage<PageProps> = ({ menusWithPosts }) => {
  const { t } = useTranslation('help_center')

  return (
    <Page className={styles.page}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.neuron}>
            <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
            <span className={styles.name}>Neuron</span>
          </div>

          <div className={styles.text1}>{t('Help Center')}</div>

          <div className={styles.search}>
            <DocSearch
              appId={APPID ?? ''}
              indexName="neuron-magickbase"
              apiKey={SEARCH_KEY ?? ''}
              translations={{ button: { buttonText: t('Please enter keywords') ?? '' } }}
              // This is experience optimization in a development environment
              hitComponent={({ hit, children }) => <a href={removeURLOrigin(hit.url)}>{children}</a>}
            />
          </div>
        </div>

        <div className={styles.right}>
          <Image src={ImgHelp} alt="Help" width={200} height={168} />
        </div>
      </div>

      <div className={styles.postMenus}>
        {menusWithPosts.map(menu => {
          const firstPostInMenu = menu.posts?.[0]
          return (
            <div key={menu.name} className={styles.postMenu}>
              <div className={styles.title}>
                <div className={styles.name}>{t(menu.name)}</div>
                {firstPostInMenu && (
                  <UpsideDownEffect content={t('More')}>
                    {(hoverableContainerClass, contentWithEffect) => (
                      <Link
                        className={hoverableContainerClass}
                        href={getPostURL(firstPostInMenu)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className={styles.more}>
                          {contentWithEffect} <IconMore />
                        </div>
                      </Link>
                    )}
                  </UpsideDownEffect>
                )}
              </div>

              <div className={styles.posts}>
                {menu.posts?.map(post => (
                  <LinkWithEffect
                    key={post.key}
                    className={styles.post}
                    href={getPostURL(post)}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    {post.title}
                  </LinkWithEffect>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const menuWithPosts = await getMenusWithPosts()
  const lng = await serverSideTranslations(locale, ['common', 'help_center'])

  const props: PageProps = {
    menusWithPosts: menuWithPosts.map(menu => ({
      ...menu,
      posts: menu.posts?.slice(0, 4),
    })),
    ...lng,
  }

  return { props }
}

export default HelpCenter
