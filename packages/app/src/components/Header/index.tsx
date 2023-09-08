import clsx from 'clsx'
import { ComponentProps, FC } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import IconLogo from './logo.svg'
import IconGithub from './github.svg'
import IconMenu from './menu.svg'
import IconClose from './close.svg'
import { useIsMobile } from '../../hooks'
import { languages } from '../../utils'
import { Contacts } from '../Contacts'

export type HeaderProps = ComponentProps<'div'>

export const Header: FC<HeaderProps> = props => {
  const isMobile = useIsMobile()
  return isMobile ? <Header$Mobile {...props} /> : <Header$Desktop {...props} />
}

export const Header$Desktop: FC<HeaderProps> = props => {
  return (
    <div {...props} className={clsx(styles.header, props.className)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link href="/">
            <IconLogo />
          </Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/help-center">Help Center</Link>
          <Link href="/download">Download Neuron</Link>
        </div>

        <div className={styles.right}>
          <Link href="https://github.com/nervosnetwork/neuron" target="_blank" rel="noopener noreferrer">
            <IconGithub />
          </Link>

          <MenuDialog />
        </div>
      </div>
    </div>
  )
}

export const Header$Mobile: FC<HeaderProps> = props => {
  return (
    <div {...props} className={clsx(styles.headerMobile, props.className)}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Link href="/">
            <IconLogo width={32} height={32} />
          </Link>
        </div>

        <div className={styles.right}>
          <MenuDialog />
        </div>
      </div>
    </div>
  )
}

const MenuDialog: FC = () => {
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

          <div className={styles.content}>
            <Link className={styles.title} href="/">
              Home
            </Link>

            <div className={styles.title}>Services</div>
            <div className={styles.links}>
              <Link href="https://neuron.magickbase.com/">Neuron Wallet</Link>
              <Link href="https://ckb.magickbase.com/">CKB Explorer</Link>
              <Link href="https://godwoke.magickbase.com/">Godwoke Explorer</Link>
              <Link href="https://axon.magickbase.com/">Axon Explorer</Link>
              <Link href="https:/kuai.magickbase.com/">Kuai</Link>
            </div>

            <Link className={styles.title} href="https://github.com/nervosnetwork/ckb/wiki/Public-JSON-RPC-nodes">
              Public Node
            </Link>

            <div className={styles.title}>Language</div>
            <div className={clsx(styles.links, styles.languages)}>
              {languages.map(language => (
                <Link
                  key={language.name}
                  className={clsx(styles.languageItem, {
                    [styles.selected ?? '']: language.localeName === router.locale,
                  })}
                  href={{ pathname, query }}
                  locale={language.localeName}
                >
                  {language.name}
                </Link>
              ))}
            </div>
          </div>

          <Contacts className={styles.contacts} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
