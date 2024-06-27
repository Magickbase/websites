import clsx from 'clsx'
import { ComponentProps, FC } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { useIsMobile } from '@magickbase-website/shared'
import styles from './index.module.scss'
import IconLogo from './logo.svg'
import IconGithub from './github.svg'
import IconMenu from './menu.svg'
import IconClose from './close.svg'
import { languages } from '../../utils'
import { Contacts } from '../Contacts'
import { LinkWithEffect } from '../UpsideDownEffect'

export type HeaderProps = ComponentProps<'div'> & {
  navMenuGroupName?: string | null
  navMenus?: { name: string; link: string }[]
  githubLink?: string
}

export const Header: FC<HeaderProps> = props => {
  const isMobile = useIsMobile()
  return isMobile ? <Header$Mobile {...props} /> : <Header$Desktop {...props} />
}

export const Header$Desktop: FC<HeaderProps> = ({ navMenuGroupName, navMenus, githubLink, ...elProps }) => {
  return (
    <div {...elProps} className={clsx(styles.header, elProps.className)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link href="/">
            <IconLogo />
          </Link>
          {navMenus?.map(({ name, link }) => (
            <LinkWithEffect key={name} href={link}>
              {name}
            </LinkWithEffect>
          ))}
        </div>

        <div className={styles.right}>
          {githubLink && (
            <Link href={githubLink} target="_blank" rel="noopener noreferrer">
              <IconGithub />
            </Link>
          )}

          <MenuDialog navMenuGroupName={navMenuGroupName} navMenus={navMenus} />
        </div>
      </div>
    </div>
  )
}

export const Header$Mobile: FC<HeaderProps> = ({ navMenuGroupName, navMenus, ...elProps }) => {
  return (
    <div {...elProps} className={clsx(styles.headerMobile, elProps.className)}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Link href="/">
            <IconLogo width={32} height={32} />
          </Link>
        </div>

        <div className={styles.right}>
          <MenuDialog navMenuGroupName={navMenuGroupName} navMenus={navMenus} />
        </div>
      </div>
    </div>
  )
}

const MenuDialog: FC<Pick<HeaderProps, 'navMenuGroupName' | 'navMenus'>> = ({ navMenuGroupName, navMenus }) => {
  const { t } = useTranslation('common')
  const isMobile = useIsMobile()
  const router = useRouter()
  const { pathname, query } = router

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {/* This div wrapping layer is because SVGComponent cannot accept the ref from Dialog.Trigger, it will error. */}
        <div className={styles.menuDialogTrigger}>
          <IconMenu />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.menuDialogOverlay} />
        <Dialog.Content className={styles.menuDialogContent}>
          <div className={styles.top}>
            {isMobile && (
              <div className={styles.left}>
                <Link href="/">
                  <IconLogo width={32} height={32} />
                </Link>
              </div>
            )}

            <Dialog.Close asChild>
              <IconClose className={styles.close} />
            </Dialog.Close>
          </div>

          <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: 'never' } }}>
            <div className={styles.content}>
              {navMenuGroupName != null && navMenus != null && (
                <>
                  <div className={styles.title}>{navMenuGroupName}</div>
                  <div className={styles.links}>
                    {navMenus.map(({ name, link }) => (
                      <LinkWithEffect key={name} href={link}>
                        {name}
                      </LinkWithEffect>
                    ))}
                  </div>
                </>
              )}

              <LinkWithEffect className={styles.title} href="https://magickbase.com/">
                {t('Home')}
              </LinkWithEffect>

              <div className={styles.title}>{t('Services')}</div>
              <div className={styles.links}>
                <LinkWithEffect href="https://neuron.magickbase.com/en">{t('Neuron Wallet')}</LinkWithEffect>
                <LinkWithEffect href="https://explorer.nervos.org/">{t('CKB Explorer')}</LinkWithEffect>
                <LinkWithEffect href="https://v1.gwscan.com/">{t('Godwoke Explorer')}</LinkWithEffect>
                <LinkWithEffect href="https://github.com/Magickbase/blockscan">{t('Axon Explorer')}</LinkWithEffect>
                <LinkWithEffect href="https://lumos-website.vercel.app/">{t('Lumos')}</LinkWithEffect>
                <LinkWithEffect href="https://github.com/ckb-js/kuai">{t('Kuai')}</LinkWithEffect>
                <LinkWithEffect href="https://portfolio.magickbase.com">{t('Portfolio')}</LinkWithEffect>
              </div>

              <LinkWithEffect className={styles.title} href="https://status-website-delta.vercel.app">
                {t('Service Monitor')}
              </LinkWithEffect>

              <div className={styles.title}>{t('Language')}</div>
              <div className={clsx(styles.links, styles.languages)}>
                {languages.map(language => (
                  <LinkWithEffect
                    key={language.name}
                    className={clsx(styles.languageItem, {
                      [styles.selected ?? '']: language.localeName === router.locale,
                    })}
                    href={{ pathname, query }}
                    locale={language.localeName}
                  >
                    {language.name}
                  </LinkWithEffect>
                ))}
              </div>
            </div>
          </OverlayScrollbarsComponent>

          <Contacts className={styles.contacts} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
