import { ComponentProps, FC, ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { isMobile } from 'react-device-detect'
import styles from './index.module.scss'

interface UpsideDownEffectProps {
  content?: ReactNode | null
  children?: ReactNode | ((hoverableContainerClass: string, contentWithEffect: ReactNode) => ReactNode)
  fullWidth?: boolean
  fullHeight?: boolean
  nodeClass?: string
}

export const UpsideDownEffect: FC<Omit<ComponentProps<'span'>, 'children' | 'content'> & UpsideDownEffectProps> = ({
  children,
  content,
  fullWidth,
  fullHeight,
  nodeClass,
  ...outerProps
}) => {
  const computedContent = content ?? (typeof children === 'function' ? '' : children)

  if (typeof children === 'function') {
    return children(
      styles.hoverableContainer ?? '',
      <span
        {...outerProps}
        className={clsx(
          styles.upsideDownEffect,
          { [styles.fullWidth ?? '']: fullWidth, [styles.fullHeight ?? '']: fullHeight },
          outerProps.className,
        )}
      >
        <span className={styles.nodes}>
          <span className={clsx(styles.content, nodeClass)}>{computedContent}</span>
          <span className={clsx(styles.cloned, nodeClass)} aria-hidden>
            {computedContent}
          </span>
        </span>
      </span>,
    )
  }

  return (
    <span
      {...outerProps}
      className={clsx(
        styles.upsideDownEffect,
        { [styles.fullWidth ?? '']: fullWidth, [styles.fullHeight ?? '']: fullHeight },
        outerProps.className,
      )}
    >
      <span className={styles.nodes}>
        <span className={clsx(styles.content, nodeClass)}>{computedContent}</span>
        <span className={clsx(styles.cloned, nodeClass)} aria-hidden>
          {computedContent}
        </span>
      </span>
    </span>
  )
}

export const LinkWithEffect: FC<ComponentProps<typeof Link> & UpsideDownEffectProps> = ({
  children,
  content,
  fullWidth,
  fullHeight,
  nodeClass,
  ...linkProps
}) => {
  if (isMobile) return <Link {...linkProps}>{children}</Link>

  if (typeof children === 'function') throw new Error('LinkWithEffect not support children as function')

  return (
    <UpsideDownEffect {...{ content: content ?? children, fullWidth, fullHeight, nodeClass }}>
      {(hoverableContainerClass, contentWithEffect) => (
        <Link {...linkProps} className={clsx(hoverableContainerClass, linkProps.className)}>
          {contentWithEffect}
        </Link>
      )}
    </UpsideDownEffect>
  )
}
