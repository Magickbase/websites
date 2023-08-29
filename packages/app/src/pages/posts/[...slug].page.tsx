import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactMarkdown from 'react-markdown'
import clsx from 'clsx'
import Link from 'next/link'
import { FC, useMemo } from 'react'
import { useObservableState } from 'observable-hooks'
import { TOCContextProvider, TOCItem } from '../../components/TableOfContents'
import {
  Post,
  getMenusWithPosts,
  getPost,
  getPosts,
  getPostTopMenu,
  isPostSource,
  TopLevelMenu,
  getPostURL,
} from '../../utils'
import { HelpDocHeader } from './HelpDocHeader'
import styles from './index.module.scss'
import presets from '../../styles/presets.module.scss'
import { Sidebar } from './Sidebar'
import { TOC } from './TOC'
import { appSettings } from '../../services/AppSettings'
import { useBodyClass, useFullHeightCSSValue, useIsMobile, useMarkdownProps } from '../../hooks'
import { Contacts } from '../../components/Contacts'

interface PageProps {
  post: Post
  menusWithPosts: TopLevelMenu[]
  menuWithPosts: TopLevelMenu
}

const PostPage: NextPage<PageProps> = props => {
  const isMobile = useIsMobile()
  const darkMode = useObservableState(appSettings.darkMode$)
  const bodyClass = useMemo(() => (darkMode ? [presets.themeDark ?? ''] : [presets.themeLight ?? '']), [darkMode])
  useBodyClass(bodyClass)

  return isMobile ? <PostPage$Mobile {...props} /> : <PostPage$Desktop {...props} />
}

export const PostPage$Desktop: FC<PageProps> = ({ post, menusWithPosts, menuWithPosts }) => {
  const height = useFullHeightCSSValue()
  const mdProps = useMarkdownProps({ imgClass: styles.img })
  const submenuName = menuWithPosts.children?.find(menu =>
    menu.posts?.find(_post => post.source === _post.source && post.number === _post.number),
  )?.name

  return (
    <div className={styles.page} style={{ height }}>
      <HelpDocHeader className={styles.header} menuWithPosts={menuWithPosts} viewingPost={post} />

      <Sidebar className={styles.sidebar} menuWithPosts={menuWithPosts} viewingPost={post} />

      <div className={styles.main}>
        <div className={styles.navbar}>
          <Link href="/">Home</Link>
          {menusWithPosts.map(
            menu =>
              menu.posts?.[0] && (
                <Link
                  key={menu.name}
                  className={clsx({ [styles.selected ?? '']: menu.name === menuWithPosts.name })}
                  href={getPostURL(menu.posts[0])}
                >
                  {menu.name}
                </Link>
              ),
          )}
        </div>

        <TOCContextProvider>
          {({ scrollContainerRef }) => (
            <div className={styles.content}>
              <div className={styles.breadcrumbs}>
                {/* TODO: feature needs to be implemented */}
                <div className={styles.item}>{menuWithPosts.name}</div>
                {submenuName && <div className={styles.item}>{submenuName}</div>}
                <div className={styles.item}>{post.title}</div>
              </div>

              <div ref={scrollContainerRef} className={styles.postContent}>
                <TOCItem id={post.title} titleInTOC={post.title}>
                  <h1 className={styles.title}>{post.title}</h1>
                </TOCItem>

                <ReactMarkdown {...mdProps}>{post.body ?? ''}</ReactMarkdown>
              </div>

              <TOC className={styles.toc} />
            </div>
          )}
        </TOCContextProvider>
      </div>
    </div>
  )
}

export const PostPage$Mobile: FC<PageProps> = ({ post, menuWithPosts }) => {
  const height = useFullHeightCSSValue()
  const mdProps = useMarkdownProps({ imgClass: styles.img })
  const submenuName = menuWithPosts.children?.find(menu =>
    menu.posts?.find(_post => post.source === _post.source && post.number === _post.number),
  )?.name

  return (
    <div className={styles.pageMobile} style={{ height }}>
      <HelpDocHeader className={styles.header} menuWithPosts={menuWithPosts} viewingPost={post} />

      <div className={styles.otherThenHeader}>
        <div className={styles.breadcrumbs}>
          {/* TODO: feature needs to be implemented */}
          <div className={styles.item}>{menuWithPosts.name}</div>
          {submenuName && <div className={styles.item}>{submenuName}</div>}
          <div className={styles.item}>{post.title}</div>
        </div>

        <TOCContextProvider>
          <div className={styles.postContent}>
            <TOCItem id={post.title} titleInTOC={post.title}>
              <h1 className={styles.title}>{post.title}</h1>
            </TOCItem>

            <ReactMarkdown {...mdProps}>{post.body ?? ''}</ReactMarkdown>
          </div>
        </TOCContextProvider>

        <div className={styles.footer}>
          <Contacts className={styles.contacts} />
          <div className={styles.copyright}>© 2023 by Magickbase.</div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps<PageProps, { slug?: string[] }> = async ({ locale, params }) => {
  const [source, number] = params?.slug ?? []
  if (!isPostSource(source) || !number) return { notFound: true }

  const post = await getPost(source, Number(number))
  if (!post) return { notFound: true }
  const menu = getPostTopMenu(post)
  if (!menu) return { notFound: true }
  const menusWithPosts = await getMenusWithPosts()
  const menuWithPosts = menusWithPosts.find(({ name }) => name === menu.name)
  if (!menuWithPosts) return { notFound: true }

  const lng = await serverSideTranslations(locale ?? 'en', ['common', 'posts'])

  const props: PageProps = {
    ...lng,
    post,
    menusWithPosts,
    menuWithPosts,
  }

  return { props }
}

export const getStaticPaths: GetStaticPaths<{ slug?: string[] }> = async ({ locales }) => {
  const posts = await getPosts()

  const pageParams = posts.map(post => ({ slug: [post.source, post.number.toString()] }))

  return {
    paths: (locales ?? ['en']).map(locale => pageParams.map(params => ({ params, locale }))).flat(),
    fallback: false,
  }
}

export default PostPage
