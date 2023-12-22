import { ComponentProps, FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import IconX from './x.svg'
import IconDiscord from './discord.svg'
import IconGithub from './github.svg'
import styles from './index.module.scss'

export const Contacts: FC<ComponentProps<'div'> & { linkClass?: string; iconClass?: string }> = ({
  linkClass,
  iconClass,
  ...divProps
}) => {
  const { locale = 'en' } = useRouter()
  return (
    <div {...divProps} className={clsx(styles.contacts, divProps.className)}>
      <Link className={linkClass} href={`https://x.com/magickbase/${locale}`}>
        <IconX className={iconClass} />
      </Link>
      <Link className={linkClass} href="https://discord.gg/GBYYgBA9s7">
        <IconDiscord className={iconClass} />
      </Link>
      <Link className={linkClass} href="https://github.com/Magickbase">
        <IconGithub className={iconClass} />
      </Link>
    </div>
  )
}
