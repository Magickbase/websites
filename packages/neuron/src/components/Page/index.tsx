import { ComponentProps, forwardRef, ReactNode } from 'react'
import { clsx } from 'clsx'
import { Footer, FooterProps } from '../Footer'
import { Header, HeaderProps } from '../Header'
import styles from './index.module.scss'
import { useBodyClass } from '../../hooks'
import presets from '../../styles/presets.module.scss'

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

  // _document.page.tsx adds a theme class name to the HTML element during initialization, but this class name remains fixed and does not change.
  // In order to switch themes correctly when navigating between routes, it is necessary to add a theme class name to the body element.
  // Currently, except for the post detail page, all other pages have a fixed dark mode and cannot switch color modes.
  // Since the post detail page does not use the Page component, a fixed dark mode class name is applied here.
  // TODO: This may not be a good code implementation, but we should consider refactoring it after having multiple pages with switchable color modes.
  useBodyClass([presets.themeDark ?? ''])

  const finalChildren =
    typeof children === 'function' ? (
      children({
        renderHeader: props => <Header {...props} />,
        renderFooter: props => <Footer {...props} />,
      })
    ) : (
      <>
        <Header />
        {contentWrapper ? (
          <div {...contentWrapperProps} className={clsx(styles.contentWrapper, contentWrapperProps.className)}>
            {children}
          </div>
        ) : (
          children
        )}
        <Footer />
      </>
    )

  return (
    <div ref={ref} className={clsx(styles.page, className)} {...divProps}>
      {finalChildren}
    </div>
  )
})
