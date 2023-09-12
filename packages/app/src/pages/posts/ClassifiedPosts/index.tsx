import { FC } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import Link from 'next/link'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Post, TopLevelMenu, getPostURL } from '../../../utils'
import IconArrow from './arrow.svg'
import styles from './index.module.scss'

export const ClassifiedPosts: FC<
  Omit<Accordion.AccordionSingleProps, 'type'> & {
    menuWithPosts: TopLevelMenu
    viewingPost: Post
    categoryClass?: string
    triggerClass?: string
    triggerArrowClass?: string
    postsClass?: string
    postClass?: string
  }
> = props => {
  const { t } = useTranslation('posts')
  const {
    menuWithPosts,
    viewingPost,
    categoryClass,
    triggerClass,
    triggerArrowClass,
    postsClass,
    postClass,
    ...rootProps
  } = props

  return (
    <Accordion.Root
      collapsible
      {...rootProps}
      className={clsx(styles.accordionRoot, rootProps.className)}
      type="single"
    >
      {/* TODO: Menus above the second level are not supported for the time being */}
      {menuWithPosts.children?.map(menu => (
        <Accordion.Item key={menu.name} className={clsx(styles.accordionItem, categoryClass)} value={menu.name}>
          <Accordion.Header className={styles.accordionHeader}>
            <Accordion.Trigger className={clsx(styles.accordionTrigger, triggerClass)}>
              {t(menu.name)}
              <IconArrow className={clsx(styles.arrow, triggerArrowClass)} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className={clsx(styles.accordionContent, postsClass)}>
            {menu.posts?.map(post => (
              <Link
                key={post.number}
                data-selected={post.source === viewingPost.source && post.number === viewingPost.number}
                className={clsx(styles.post, postClass)}
                href={getPostURL(post)}
              >
                {post.title}
              </Link>
            ))}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
