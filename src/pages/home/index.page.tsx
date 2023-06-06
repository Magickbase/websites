import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import { Menu, getMenuWithPosts } from '../../utils/posts'

interface PageProps {
  menuWithPosts: Menu[]
}

const Home: NextPage<PageProps> = ({ menuWithPosts }) => {
  const { t } = useTranslation('home')

  return (
    <Page>
      <div className={styles.search}>
        <div>Neuron online help</div>
        <input placeholder="search" />
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
                <Link key={post.number} className={styles.post} href={`/posts/${post.number}`}>
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

  return { props, revalidate: 60 * 60 }
}

export default Home
