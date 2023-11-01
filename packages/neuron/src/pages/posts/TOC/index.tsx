import { ComponentProps, FC, useContext } from 'react'
import clsx from 'clsx'
import { TOCContext } from '../../../components/TableOfContents'
import styles from './index.module.scss'

export const TOC: FC<ComponentProps<'nav'>> = props => {
  const { tocItems } = useContext(TOCContext)

  return (
    <nav aria-label="Table of contents" {...props} className={clsx(styles.toc, props.className)}>
      {tocItems.map(tocItem => (
        <div key={tocItem.id} className={clsx(styles.tocItem, { [styles.active ?? '']: tocItem.isActive })}>
          <a className={styles.tocAnchor} href={`#${tocItem.id}`}>
            {tocItem.title}
          </a>
        </div>
      ))}
    </nav>
  )
}
