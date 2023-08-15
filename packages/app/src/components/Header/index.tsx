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
          {/* TODO: need real links */}
          <Link href="/">Changelog</Link>
          <Link href="/">Help Center</Link>
          <Link href="/download">Download Neuron</Link>
        </div>

        <div className={styles.right}>
          <IconGithub />
          <IconMenu />
        </div>
      </div>
    </div>
  )
}
