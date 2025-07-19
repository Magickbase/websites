import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Contacts } from '@magickbase-website/shared'
import { Post, TopLevelMenu } from '../../../utils'
import styles from './index.module.scss'
import { ClassifiedPosts } from '../ClassifiedPosts'

export const Sidebar: FC<ComponentProps<'div'> & { menuWithPosts: TopLevelMenu; viewingPost: Post }> = props => {
  const { t } = useTranslation('posts')
  const { menuWithPosts, viewingPost, ...divProps } = props

  return (
    <div {...divProps} className={clsx(styles.sidebar, divProps.className)}>
      <SidebarClassifiedPosts
        menuWithPosts={menuWithPosts}
        viewingPost={viewingPost}
        defaultValue={menuWithPosts.children?.[0]?.name}
      />

      <div className={styles.bottom}>
        <Contacts />

        <div className={styles.copyright}>{t('© 2025 by Magickbase.')}</div>
      </div>
    </div>
  )
}

const SidebarClassifiedPosts: FC<ComponentProps<typeof ClassifiedPosts>> = props => {
  return (
    <ClassifiedPosts
      className={styles.sidebarClassifiedPosts}
      categoryClass={styles.category}
      triggerClass={styles.trigger}
      triggerArrowClass={styles.arrow}
      postsClass={styles.posts}
      postClass={styles.post}
      {...props}
    />
  )
}
