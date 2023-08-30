import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import { Post, TopLevelMenu } from '../../../utils'
import styles from './index.module.scss'
import { Contacts } from '../../../components/Contacts'
import { ClassifiedPosts } from '../ClassifiedPosts'

export const Sidebar: FC<ComponentProps<'div'> & { menuWithPosts: TopLevelMenu; viewingPost: Post }> = props => {
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

        <div className={styles.copyright}>© 2023 by Magickbase.</div>
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
