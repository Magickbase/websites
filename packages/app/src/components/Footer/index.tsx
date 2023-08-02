import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import styles from './index.module.scss'
import IconFullLogo from './full-logo.svg'
import IconTwitter from './twitter.svg'
import IconDiscord from './discord.svg'
import IconGithub from './github.svg'

export type FooterProps = ComponentProps<'div'>

export const Footer: FC<FooterProps> = props => {
  return (
    <div {...props} className={clsx(styles.footer, props.className)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <IconFullLogo />

          <div className={styles.serversState}>
            {/* TODO: There is a need for API integration */}
            <div className={styles.dot} />
            All services are online
          </div>

          <div className={styles.contacts}>
            {/* TODO: need real links */}
            <IconTwitter />
            <IconDiscord />
            <IconGithub />
          </div>

          <div className={styles.copyright}>Copyright © 2023 Magickbase All Rights Reserved.</div>
        </div>

        <div className={styles.right}>
          <div className={styles.linkList}>
            <div className={styles.title}>Services</div>
            <div className={styles.linksContainer}>
              {/* TODO: need real links */}
              <Link href="/">Neuron Wallet</Link>
              <Link href="/">CKB Explorer</Link>
              <Link href="/">Godwoke Explorer</Link>
              <Link href="/">Axon Explorer</Link>
              <Link href="/">Kuai</Link>
              <Link href="/">Public Node</Link>
            </div>
          </div>

          <div className={styles.linkList}>
            <div className={styles.title}>Foundation</div>
            <div className={styles.linksContainer}>
              {/* TODO: need real links */}
              <Link href="/">Nervos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
