import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import ReactMarkdown from 'react-markdown'
import { HeadingProps } from 'react-markdown/lib/ast-to-react'
import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps, useMemo } from 'react'
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
import { HelpDocHeader } from '../../components/HelpDocHeader'
import styles from './index.module.scss'
import presets from '../../styles/presets.module.scss'
import { Sidebar } from './Sidebar'
import { TOC } from './TOC'
import { appSettings } from '../../services/AppSettings'
import { useBodyClass } from '../../hooks'

interface PageProps {
  post: Post
  menusWithPosts: TopLevelMenu[]
  menuWithPosts: TopLevelMenu
}

const PostPage: NextPage<PageProps> = ({ post, menusWithPosts, menuWithPosts }) => {
  const darkMode = useObservableState(appSettings.darkMode$)
  const bodyClass = useMemo(() => (darkMode ? [presets.themeDark ?? ''] : [presets.themeLight ?? '']), [darkMode])
  useBodyClass(bodyClass)

  const components: ComponentProps<typeof ReactMarkdown>['components'] = useMemo(
    () => ({
      h1: wrapHeadingWithTOCItem('h1'),
      h2: wrapHeadingWithTOCItem('h2'),
      h3: wrapHeadingWithTOCItem('h3'),
      h4: wrapHeadingWithTOCItem('h4'),
      h5: wrapHeadingWithTOCItem('h5'),
      h6: wrapHeadingWithTOCItem('h6'),
      // Expectedly, all the links are external (content from GitHub), so there is no need to use next/image.
      // eslint-disable-next-line @next/next/no-img-element
      img: props => <img {...props} alt={props.alt ?? 'image'} className={clsx(props.className, styles.img)} />,
    }),
    [],
  )

  const submenuName = menuWithPosts.children?.find(menu =>
    menu.posts?.find(_post => post.source === _post.source && post.number === _post.number),
  )?.name

  return (
    <div className={styles.page}>
      <HelpDocHeader className={styles.header} />

      <Sidebar className={styles.sidebar} menuWithPosts={menuWithPosts} viewingPost={post} />

      <div className={styles.main}>
        <div className={styles.navbar}>
          {/* TODO: feature needs to be implemented */}
          <Link href="/">Home</Link>
          {menusWithPosts.map(
            menu =>
              menu.posts?.[0] && (
                <Link key={menu.name} href={getPostURL(menu.posts[0])}>
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.title}</ReactMarkdown>
                <hr />
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={components}
                >
                  {post.body ?? ''}
                </ReactMarkdown>
              </div>

              <TOC className={styles.toc} />
            </div>
          )}
        </TOCContextProvider>
      </div>
    </div>
  )
}

function wrapHeadingWithTOCItem(HeadingTag: string) {
  return function tagWithTOCItem(props: HeadingProps) {
    const content = props.children[0]
    if (typeof content !== 'string') return <HeadingTag {...props} />

    return (
      <TOCItem id={content} titleInTOC={content}>
        <HeadingTag {...props} />
      </TOCItem>
    )
  }
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
