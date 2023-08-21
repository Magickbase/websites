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
            <Link href="https://twitter.com/magickbase">
              <IconTwitter />
            </Link>
            <Link href="https://discord.gg/GBYYgBA9s7">
              <IconDiscord />
            </Link>
            <Link href="https://github.com/Magickbase">
              <IconGithub />
            </Link>
          </div>

          <div className={styles.copyright}>Copyright © 2023 Magickbase All Rights Reserved.</div>
        </div>

        <div className={styles.right}>
          <div className={styles.linkList}>
            <div className={styles.title}>Services</div>
            <div className={styles.linksContainer}>
              <Link href="https://docs.nervos.org/docs/basics/guides/crypto%20wallets/neuron">Neuron Wallet</Link>
              <Link href="https://explorer.nervos.org/">CKB Explorer</Link>
              <Link href="https://v1.gwscan.com/">Godwoke Explorer</Link>
              <Link href="https://github.com/Magickbase/blockscan">Axon Explorer</Link>
              <Link href="https://github.com/ckb-js/kuai">Kuai</Link>
              <Link href="https://github.com/nervosnetwork/ckb/wiki/Public-JSON-RPC-nodes">Public Node</Link>
            </div>
          </div>

          <div className={styles.linkList}>
            <div className={styles.title}>Foundation</div>
            <div className={styles.linksContainer}>
              <Link href="https://www.nervos.org/">Nervos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
