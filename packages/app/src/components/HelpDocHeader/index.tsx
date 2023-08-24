import clsx from 'clsx'
import { ComponentProps, FC } from 'react'
import Image from 'next/image'
import { useObservableState } from 'observable-hooks'
import { DocSearch } from '@docsearch/react'
import '@docsearch/css'
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
          <DocSearch appId={APPID ?? ''} indexName="posts" apiKey={SEARCH_KEY ?? ''} />
        </div>

        {darkMode ? (
          <IconNight className={styles.colorSchema} onClick={() => appSettings.setDarkMode(false)} />
        ) : (
          <IconDaylight className={styles.colorSchema} onClick={() => appSettings.setDarkMode(true)} />
        )}

        <div className={styles.languageMenu}>
          English
          <IconArrow />
        </div>
      </div>
    </div>
  )
}
