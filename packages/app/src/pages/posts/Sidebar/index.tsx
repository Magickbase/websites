import { ComponentProps, FC, forwardRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import Link from 'next/link'
import clsx from 'clsx'
import { Post, TopLevelMenu, getPostURL } from '../../../utils'
import IconArrow from './arrow.svg'
import styles from './index.module.scss'

export const Sidebar: FC<ComponentProps<'div'> & { menuWithPosts: TopLevelMenu; viewingPost: Post }> = props => {
  const { menuWithPosts, viewingPost, ...divProps } = props

  return (
    <div {...divProps} className={clsx(styles.sidebar, divProps.className)}>
      <Accordion.Root
        className={styles.accordionRoot}
        type="single"
        defaultValue={menuWithPosts.children?.[0]?.name}
        collapsible
      >
        {/* TODO: Menus above the second level are not supported for the time being */}
        {menuWithPosts.children?.map(menu => (
          <Accordion.Item key={menu.name} className={styles.accordionItem} value={menu.name}>
            <AccordionTrigger>{menu.name}</AccordionTrigger>
            <AccordionContent>
              {menu.posts?.map(post => (
                <Link
                  key={post.number}
                  className={clsx(styles.post, {
                    [styles.selected ?? '']: post.source === viewingPost.source && post.number === viewingPost.number,
                  })}
                  href={getPostURL(post)}
                >
                  - {post.title}
                </Link>
              ))}
            </AccordionContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}

const AccordionTrigger = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className={styles.accordionHeader}>
      <Accordion.Trigger className={clsx(styles.accordionTrigger, className)} {...props} ref={forwardedRef}>
        {children}
        <IconArrow className={styles.accordionChevron} aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  ),
)
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content className={clsx(styles.accordionContent, className)} {...props} ref={forwardedRef}>
      {children}
    </Accordion.Content>
  ),
)
AccordionContent.displayName = 'AccordionContent'
