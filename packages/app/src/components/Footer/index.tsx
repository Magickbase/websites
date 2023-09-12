import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'
import IconFullLogo from './full-logo.svg'
import { Contacts } from '../Contacts'
import { useIsMobile } from '../../hooks'

export type FooterProps = ComponentProps<'div'>

export const Footer: FC<FooterProps> = props => {
  const { t } = useTranslation('common')
  const isMobile = useIsMobile()

  return (
    <div {...props} className={clsx(styles.footer, props.className)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <IconFullLogo />

          <div className={styles.serversState}>
            {/* TODO: There is a need for API integration */}
            <div className={styles.dot} />
            {t('All services are online')}
          </div>

          <Contacts className={styles.contacts} />

          {!isMobile && <div className={styles.copyright}>{t('Copyright © 2023 Magickbase All Rights Reserved.')}</div>}
        </div>

        <div className={styles.right}>
          <div className={styles.linkList}>
            <div className={styles.title}>{t('Services')}</div>
            <div className={styles.linksContainer}>
              <Link href="https://docs.nervos.org/docs/basics/guides/crypto%20wallets/neuron">
                {t('Neuron Wallet')}
              </Link>
              <Link href="https://explorer.nervos.org/">{t('CKB Explorer')}</Link>
              <Link href="https://v1.gwscan.com/">{t('Godwoke Explorer')}</Link>
              <Link href="https://github.com/Magickbase/blockscan">{t('Axon Explorer')}</Link>
              <Link href="https://github.com/ckb-js/kuai">{t('Kuai')}</Link>
              <Link href="https://github.com/nervosnetwork/ckb/wiki/Public-JSON-RPC-nodes">{t('Public Node')}</Link>
            </div>
          </div>

          <div className={styles.linkList}>
            <div className={styles.title}>{t('Foundation')}</div>
            <div className={styles.linksContainer}>
              <Link href="https://www.nervos.org/">{t('Nervos')}</Link>
            </div>
          </div>

          {isMobile && <div className={styles.copyright}>{t('Copyright © 2023 Magickbase All Rights Reserved.')}</div>}
        </div>
      </div>
    </div>
  )
}
