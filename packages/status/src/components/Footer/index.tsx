import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { isMobile } from 'react-device-detect'
import styles from './index.module.scss'
import IconFullLogo from './full-logo.svg'
import { Contacts } from '../Contacts'
import { LinkWithEffect } from '../UpsideDownEffect'

export type FooterProps = ComponentProps<'div'> & {
  serviceState?: 'operational' | 'downtime' | 'degraded' | 'unknown'
  serviceLink?: string
}

export const Footer: FC<FooterProps> = ({
  serviceState,
  serviceLink = 'https://status.magickbase.com/',
  ...elProps
}) => {
  const { t } = useTranslation('common')

  const serviceStateText =
    serviceState === 'operational'
      ? t('All services are online')
      : serviceState === 'downtime' || serviceState === 'degraded'
      ? t('Some services are offline')
      : t('Services status loading...')

  return (
    <div {...elProps} className={clsx(styles.footer, elProps.className)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <IconFullLogo />

          <div
            className={clsx(styles.serversState, {
              [styles.warnning ?? '']: serviceState === 'downtime' || serviceState === 'degraded',
            })}
          >
            <span className={styles.title}>{t('Status')}</span>
            <div className={styles.dot} />
            <Link href={serviceLink} target="_blank">
              {serviceStateText}
            </Link>
          </div>

          <Link href="https://status-website-delta.vercel.app" target="_blank">
            <div className={styles.serviceMonitor}>{t('Service Monitor')}</div>
          </Link>

          <Contacts className={styles.contacts} />

          {!isMobile && <div className={styles.copyright}>{t('Copyright © 2023 Magickbase All Rights Reserved.')}</div>}
        </div>

        <div className={styles.right}>
          <div className={styles.linkList}>
            <div className={styles.title}>{t('Services')}</div>
            <div className={styles.linksContainer}>
              <LinkWithEffect href="https://docs.nervos.org/docs/basics/guides/crypto%20wallets/neuron">
                {t('Neuron Wallet')}
              </LinkWithEffect>
              <LinkWithEffect href="https://explorer.nervos.org/" target="_blank">
                {t('CKB Explorer')}
              </LinkWithEffect>
              <LinkWithEffect href="https://v1.gwscan.com/" target="_blank">
                {t('Godwoke Explorer')}
              </LinkWithEffect>
              <LinkWithEffect href="https://github.com/Magickbase/blockscan" target="_blank">
                {t('Axon Explorer')}
              </LinkWithEffect>
              <LinkWithEffect href="https://github.com/ckb-js/kuai" target="_blank">
                {t('Kuai')}
              </LinkWithEffect>
              <LinkWithEffect href="https://lumos-website.vercel.app/" target="_blank">
                {t('Lumos')}
              </LinkWithEffect>
            </div>
          </div>

          <div className={styles.linkList}>
            <div className={styles.title}>{t('Foundation')}</div>
            <div className={styles.linksContainer}>
              <LinkWithEffect href="https://www.nervos.org/">{t('Nervos')}</LinkWithEffect>
            </div>
          </div>

          {isMobile && <div className={styles.copyright}>{t('Copyright © 2023 Magickbase All Rights Reserved.')}</div>}
        </div>
      </div>
    </div>
  )
}
