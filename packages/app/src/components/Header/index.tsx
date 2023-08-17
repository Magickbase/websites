import clsx from 'clsx'
import { ComponentProps, FC } from 'react'
import Link from 'next/link'
import styles from './index.module.scss'
import IconLogo from './logo.svg'
import IconGithub from './github.svg'
import IconMenu from './menu.svg'

export type HeaderProps = ComponentProps<'div'>

export const Header: FC<HeaderProps> = props => {
  return (
    <div {...props} className={clsx(styles.header, props.className)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link href="/">
            <IconLogo />
          </Link>
          <Link href="/changelog">Changelog</Link>
          {/* TODO: need real links */}
          <Link href="/">Help Center</Link>
          <Link href="/download">Download Neuron</Link>
        </div>

        <div className={styles.right}>
          <Link href="https://github.com/nervosnetwork/neuron" target="_blank" rel="noopener noreferrer">
            <IconGithub />
          </Link>
          <IconMenu />
        </div>
      </div>
    </div>
  )
}
