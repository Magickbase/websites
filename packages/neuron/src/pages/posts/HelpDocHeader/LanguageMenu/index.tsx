import { useRouter } from 'next/router'
import { FC } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import IconArrow from './arrow.svg'
import styles from './index.module.scss'

export const LanguageMenu: FC<{ languages: { name: string; localeName: string }[] }> = ({ languages }) => {
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
