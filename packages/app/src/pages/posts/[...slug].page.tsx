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
import { TOCContextProvider, TOCItem } from '../../components/TableOfContents'
import {
  Post,
  getMenuWithPosts,
  getPost,
  getPosts,
  getPostTopMenu,
  isPostSource,
  TopLevelMenu,
} from '../../utils/posts'
import { HelpDocHeader } from '../../components/HelpDocHeader'
import styles from './index.module.scss'
import { Sidebar } from './Sidebar'
import { TOC } from './TOC'

interface PageProps {
  post: Post
  menuWithPosts: TopLevelMenu
}

const PostPage: NextPage<PageProps> = ({ post, menuWithPosts }) => {
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

  return (
    <div className={styles.page}>
      <HelpDocHeader className={styles.header} />

      <Sidebar className={styles.sidebar} menuWithPosts={menuWithPosts} viewingPost={post} />

      <div className={styles.main}>
        <div className={styles.navbar}>
          {/* TODO: feature needs to be implemented */}
          <Link href="/">Home</Link>
          <Link href="/">{`Beginner's Guide`}</Link>
          <Link href="/">FAQ</Link>
          <Link href="/">Announcement</Link>
        </div>

        <TOCContextProvider>
          {({ scrollContainerRef }) => (
            <div className={styles.content}>
              <div className={styles.breadcrumbs}>
                {/* TODO: feature needs to be implemented */}
                <div className={styles.item}>{menuWithPosts.name}</div>
                <div className={styles.item}>
                  {
                    menuWithPosts.children?.find(menu =>
                      menu.posts?.find(_post => post.source === _post.source && post.number === _post.number),
                    )?.name
                  }
                </div>
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
  const menuWithPosts = await getMenuWithPosts(menu)
  if (!menuWithPosts[0]) return { notFound: true }

  const lng = await serverSideTranslations(locale ?? 'en', ['common', 'posts'])

  const props: PageProps = {
    ...lng,
    post,
    menuWithPosts: menuWithPosts[0],
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