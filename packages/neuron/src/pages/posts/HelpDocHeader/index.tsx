import clsx from 'clsx'
import { ComponentProps, FC, useState } from 'react'
import Image from 'next/image'
import { useObservableState } from 'observable-hooks'
import { DocSearch } from '@docsearch/react'
import '@docsearch/css'
import { useTranslation } from 'react-i18next'
import { appSettings } from '../../../services/AppSettings'
import ImgNeuronLogo from './neuron-logo.png'
import IconDaylight from './daylight.svg'
import IconNight from './night.svg'
import IconMenu from './menu.svg'
import IconClose from './close.svg'
import styles from './index.module.scss'
import { APPID, Post, SEARCH_KEY, TopLevelMenu, languages, removeURLOrigin } from '../../../utils'
import { useIsHydrated, useIsMobile } from '../../../hooks'
import { ClassifiedPosts } from '../ClassifiedPosts'
import { LanguageMenu } from './LanguageMenu'
import { LanguageList } from './LanguageList'

export type HelpDocHeaderProps = ComponentProps<'div'> & { menuWithPosts: TopLevelMenu; viewingPost: Post }

export const HelpDocHeader: FC<HelpDocHeaderProps> = props => {
  const isMobile = useIsMobile()
  return isMobile ? <HelpDocHeader$Mobile {...props} /> : <HelpDocHeader$Desktop {...props} />
}

export const HelpDocHeader$Desktop: FC<HelpDocHeaderProps> = props => {
  const { t } = useTranslation('posts')
  const { menuWithPosts, viewingPost, ...divProps } = props
  const darkMode = useObservableState(appSettings.darkMode$)
  const isHydrated = useIsHydrated()

  return (
    <div {...divProps} className={clsx(styles.header, divProps.className)}>
      <div className={styles.left}>
        <Image src={ImgNeuronLogo} alt="Neuron Logo" width={24} height={24} />
        {t('Neuron Help Documents')}
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <DocSearch
            appId={APPID ?? ''}
            indexName="neuron-magickbase"
            apiKey={SEARCH_KEY ?? ''}
            translations={{ button: { buttonText: t('Please enter keywords') ?? '' } }}
            // This is experience optimization in a development environment
            hitComponent={({ hit, children }) => <a href={removeURLOrigin(hit.url)}>{children}</a>}
          />
        </div>

        {/**
         * The DOM structure of these two icon components is the same, so during the hydration phase,
         * they will not be re-rendered with the correct latest icons.
         * Here, useIsHydrated is used to ensure that the client will always re-render, while the server only renders a fixed placeholder.
         */}
        {!isHydrated ? (
          <IconNight className={clsx(styles.colorSchema, styles.placeholder)} />
        ) : darkMode ? (
          <IconNight className={styles.colorSchema} onClick={() => appSettings.setDarkMode(false)} />
        ) : (
          <IconDaylight className={styles.colorSchema} onClick={() => appSettings.setDarkMode(true)} />
        )}

        <LanguageMenu languages={languages} />
      </div>
    </div>
  )
}

export const HelpDocHeader$Mobile: FC<HelpDocHeaderProps> = props => {
  const { t } = useTranslation('posts')
  const { menuWithPosts, viewingPost, ...divProps } = props
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      {...divProps}
      className={clsx(styles.headerMobile, divProps.className, {
        [styles.isExpanded ?? '']: isExpanded,
      })}
    >
      <div className={styles.top}>
        <div className={styles.left}>
          <Image src={ImgNeuronLogo} alt="Neuron Logo" width={32} height={32} />
          {t('Neuron Help Documents')}
        </div>

        <div className={styles.right}>
          {isExpanded ? (
            <IconClose onClick={() => setIsExpanded(false)} />
          ) : (
            <IconMenu onClick={() => setIsExpanded(true)} />
          )}
        </div>
      </div>

      <div className={styles.search}>
        <DocSearch
          appId={APPID ?? ''}
          indexName="neuron-magickbase"
          apiKey={SEARCH_KEY ?? ''}
          translations={{ button: { buttonText: t('Please enter keywords') ?? '' } }}
          // This is experience optimization in a development environment
          hitComponent={({ hit, children }) => <a href={removeURLOrigin(hit.url)}>{children}</a>}
        />
      </div>

      {isExpanded && (
        <div className={styles.otherThenTop}>
          <ClassifiedPostsInHeader menuWithPosts={menuWithPosts} viewingPost={viewingPost} />

          <LanguageList languages={languages} />

          <div className={styles.colorSchema}>
            <IconDaylight onClick={() => appSettings.setDarkMode(false)} />
            <IconNight onClick={() => appSettings.setDarkMode(true)} />
          </div>
        </div>
      )}
    </div>
  )
}

const ClassifiedPostsInHeader: FC<ComponentProps<typeof ClassifiedPosts>> = props => {
  return (
    <ClassifiedPosts
      className={styles.classifiedPostsInHeader}
      categoryClass={styles.category}
      postClass={styles.post}
      {...props}
    />
  )
}
