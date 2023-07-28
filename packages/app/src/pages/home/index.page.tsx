import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import algoliasearch from 'algoliasearch/lite'
import { BaseItem } from '@algolia/autocomplete-core'
import { autocomplete, getAlgoliaResults, AutocompleteOptions } from '@algolia/autocomplete-js'
import { useRef, useEffect, createElement, Fragment } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import { Menu, PostIndexRecord, getMenuWithPosts } from '../../utils'
import '@algolia/autocomplete-theme-classic'

const APPID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const searchClient = algoliasearch(APPID ?? '', SEARCH_KEY ?? '')

function Autocomplete(props: Omit<AutocompleteOptions<BaseItem & PostIndexRecord>, 'container' | 'renderer'>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const panelRootRef = useRef<Root | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const search = autocomplete({
      container: containerRef.current,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root

          panelRootRef.current?.unmount()
          panelRootRef.current = createRoot(root)
        }

        panelRootRef.current.render(children)
      },
      ...props,
    })

    return () => {
      search.destroy()
    }
  }, [props])

  return <div ref={containerRef} style={{ width: 720 }} />
}

interface PageProps {
  menuWithPosts: Menu[]
}

const Home: NextPage<PageProps> = ({ menuWithPosts }) => {
  const { t } = useTranslation('home')

  return (
    <Page>
      <div className={styles.search}>
        <div>Neuron online help</div>
        <Autocomplete
          openOnFocus={true}
          defaultActiveItemId={0}
          getSources={({ query }) => [
            {
              sourceId: 'products',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: 'posts',
                      query,
                    },
                  ],
                })
              },
              getItemUrl({ item }) {
                return `/posts/${item.source}/${item.number}`
              },
              templates: {
                item({ item, components }) {
                  return (
                    <a className="aa-ItemLink" href={`/posts/${item.source}/${item.number}`}>
                      <div className="aa-ItemContent">
                        <div className="aa-ItemContentBody">
                          <div className="aa-ItemContentTitle">
                            <components.Highlight hit={item} attribute={'content'} />
                          </div>
                        </div>
                      </div>
                    </a>
                  )
                },
              },
            },
          ]}
        />
      </div>

      <div className={styles.postMenus}>
        {menuWithPosts.map(menu => (
          <div key={menu.name} className={styles.postMenu}>
            <div className={styles.title}>
              <div className={styles.name}>{menu.name}</div>
              <div>More</div>
            </div>

            <div className={styles.posts}>
              {menu.posts?.map(post => (
                <Link key={post.number} className={styles.post} href={`/posts/${post.source}/${post.number}`}>
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const menuWithPosts = await getMenuWithPosts()
  const lng = await serverSideTranslations(locale, ['common', 'home'])

  const props: PageProps = {
    menuWithPosts,
    ...lng,
  }

  return { props }
}

export default Home
