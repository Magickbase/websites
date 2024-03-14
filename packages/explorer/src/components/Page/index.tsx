import { ComponentProps, forwardRef, ReactNode, useMemo } from 'react'
import { clsx } from 'clsx'
import { Footer, FooterProps, Header, HeaderProps, useBodyClass } from '@magickbase-website/shared'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'
import presets from '../../styles/presets.module.scss'
import { api } from '../../utils'

type PageProps = Omit<ComponentProps<'div'>, 'children'> & {
  children?:
    | ReactNode
    | ((opts: {
        renderHeader: (props?: HeaderProps) => ReactNode
        renderFooter: (props?: FooterProps) => ReactNode
      }) => JSX.Element | undefined)
  contentWrapper?: boolean | ComponentProps<'div'>
}

export const Page = forwardRef<HTMLDivElement, PageProps>(function Page(props, ref) {
  const { children, contentWrapper = true, className, ...divProps } = props
  const contentWrapperProps = typeof contentWrapper === 'object' ? contentWrapper : {}
  const { t } = useTranslation('common')

  // _document.page.tsx adds a theme class name to the HTML element during initialization, but this class name remains fixed and does not change.
  // In order to switch themes correctly when navigating between routes, it is necessary to add a theme class name to the body element.
  // Currently, except for the post detail page, all other pages have a fixed dark mode and cannot switch color modes.
  // Since the post detail page does not use the Page component, a fixed dark mode class name is applied here.
  // TODO: This may not be a good code implementation, but we should consider refactoring it after having multiple pages with switchable color modes.
  useBodyClass([presets.themeDark ?? ''])

  const aggregateStateQuery = api.uptime.aggregateState.useQuery()

  const navMenus = useMemo<HeaderProps['navMenus']>(() => [{ name: t('Changelog'), link: '/changelog' }], [t])

  const finalChildren =
    typeof children === 'function' ? (
      children({
        renderHeader: props => (
          <Header
            navMenuGroupName={t('CKB Explorer')}
            navMenus={navMenus}
            githubLink="https://github.com/nervosnetwork/ckb-explorer"
            {...props}
          />
        ),
        renderFooter: props => <Footer serviceState={aggregateStateQuery.data} {...props} />,
      })
    ) : (
      <>
        <Header
          navMenuGroupName={t('CKB Explorer')}
          navMenus={navMenus}
          githubLink="https://github.com/nervosnetwork/ckb-explorer"
        />
        {contentWrapper ? (
          <div {...contentWrapperProps} className={clsx(styles.contentWrapper, contentWrapperProps.className)}>
            {children}
          </div>
        ) : (
          children
        )}
        <Footer serviceState={aggregateStateQuery.data} />
      </>
    )

  return (
    <div ref={ref} className={clsx(styles.page, className)} {...divProps}>
      {finalChildren}
    </div>
  )
})
