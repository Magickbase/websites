import clsx from 'clsx'
import { ComponentProps, FC } from 'react'
import Image from 'next/image'
import { useObservableState } from 'observable-hooks'
import { DocSearch } from '@docsearch/react'
import '@docsearch/css'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { appSettings } from '../../services/AppSettings'
import ImgNeuronLogo from './neuron-logo.png'
import IconDaylight from './daylight.svg'
import IconNight from './night.svg'
import IconArrow from './arrow.svg'
import styles from './index.module.scss'
import { APPID, SEARCH_KEY } from '../../utils'

export type HelpDocHeaderProps = ComponentProps<'div'>

export const HelpDocHeader: FC<HelpDocHeaderProps> = props => {
  const darkMode = useObservableState(appSettings.darkMode$)

  return (
    <div {...props} className={clsx(styles.header, props.className)}>
      <div className={styles.left}>
        <Image src={ImgNeuronLogo} alt="Neuron Logo" width={24} height={24} />
        Neuron Help Documents
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <DocSearch appId={APPID ?? ''} indexName="neuron-magickbase" apiKey={SEARCH_KEY ?? ''} />
        </div>

        {darkMode ? (
          <IconNight className={styles.colorSchema} onClick={() => appSettings.setDarkMode(false)} />
        ) : (
          <IconDaylight className={styles.colorSchema} onClick={() => appSettings.setDarkMode(true)} />
        )}

        <LanguageMenu />
      </div>
    </div>
  )
}

const languages = [
  { name: 'English', localeName: 'en' },
  { name: '简体中文', localeName: 'zh' },
]

const LanguageMenu: FC = () => {
  const router = useRouter()
  const { pathname, query } = router

  const currentLanguage = languages.find(language => language.localeName === router.locale)

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className={styles.languageTrigger} aria-label="Language menu">
          {currentLanguage?.name}
          <IconArrow />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.languageContent} sideOffset={16} align="end" alignOffset={-16}>
          {languages.map(language => (
            <Link key={language.name} href={{ pathname, query }} locale={language.localeName}>
              <DropdownMenu.Item className={styles.languageItem}>{language.name}</DropdownMenu.Item>
            </Link>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
