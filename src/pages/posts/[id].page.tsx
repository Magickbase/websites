import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { Post, getMenuWithPosts, getPost, getPosts, getPostTopMenu, Menu } from '../../utils/posts'
import { Page } from '../../components/Page'
import styles from './index.module.scss'

interface PageProps {
  post: Post
  menuWithPosts: Menu[]
}

const PostPage: NextPage<PageProps> = ({ post, menuWithPosts }) => {
  return (
    <Page>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {menuWithPosts[0]?.children?.map(menu => (
            <div key={menu.name}>
              <div>{menu.name}</div>
              {menu.posts?.map(post => (
                <Link key={post.number} className={styles.post} href={`/posts/${post.number}`}>
                  - {post.title}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.content}>
          <div>{post.title}</div>
          <div>{post.body}</div>
        </div>
      </div>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const id = params?.id?.toString()
  if (!id) return { notFound: true }

  const post = await getPost(Number(id))
  if (!post) return { notFound: true }
  const menu = getPostTopMenu(post)
  if (!menu) return { notFound: true }
  const menuWithPosts = await getMenuWithPosts(menu)

  const lng = await serverSideTranslations(locale ?? 'en', ['common', 'knowledge-base'])

  const props: PageProps = {
    ...lng,
    post,
    menuWithPosts,
  }

  return { props, revalidate: 60 * 60 }
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const posts = await getPosts()

  const pageParams = posts.map(post => ({ id: post.number.toString() }))

  return {
    paths: (locales ?? ['en']).map(locale => pageParams.map(params => ({ params, locale }))).flat(),
    // This will allow access to the newest post
    fallback: 'blocking',
  }
}

export default PostPage
