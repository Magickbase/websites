import React, {
  ComponentProps,
  createContext,
  FC,
  ReactNode,
  RefAttributes,
  RefCallback,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export interface TOCItemInfo {
  id: string
  title: string
  el: HTMLElement
  isActive: boolean
  isInViewport: boolean
}

export interface TOCContextValue {
  // When there is no toc item in the viewport on the page, this ref will be used to calculate which toc item the current page belongs to.
  // Solve the bivariance problem by using a RefCallback instead of a RefObject
  scrollContainerRef: RefCallback<HTMLElement>
  tocItems: TOCItemInfo[]
  addTOCItem: (tocItemEl: HTMLElement, title: string) => void
  removeTOCItem: (tocItemEl: HTMLElement) => void
}

export const TOCContext = createContext<TOCContextValue>(
  new Proxy(
    {},
    {
      get: () => {
        throw new Error('TOCContext must wrapped by provider')
      },
    },
  ) as TOCContextValue,
)

export const TOCContextProvider: FC<{ children?: ReactNode | ((value: TOCContextValue) => ReactNode) }> = props => {
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [tocItems, setTOCItems] = useState<TOCItemInfo[]>([])

  const observer = useRef<IntersectionObserver>()

  useEffect(() => {
    observer.current = new IntersectionObserver(
      entries => {
        setTOCItems(tocItems => {
          let newTOCItems = tocItems.map(tocItem => {
            const entry = entries.find(entry => entry.target === tocItem.el)
            if (!entry) return tocItem
            return {
              ...tocItem,
              isInViewport: entry.isIntersecting,
            }
          })

          const sortedTOCItems = newTOCItems.sort((a, b) => a.el.offsetTop - b.el.offsetTop)

          let topmost: TOCItemInfo | null
          if (!newTOCItems.find(item => item.isInViewport) && scrollContainerRef.current) {
            const scrollContainer = scrollContainerRef.current

            const idx =
              sortedTOCItems.findIndex(
                tocItem => tocItem.el.offsetTop > scrollContainer.offsetTop + scrollContainer.scrollTop,
              ) - 1
            topmost =
              sortedTOCItems[
                // Because there will be a -1 above, to avoid the situation of -1 here, all the content above
                // the first tocItem will be included in the first tocItem.
                Math.max(0, idx)
              ] ?? null
          } else {
            topmost = newTOCItems
              .filter(item => item.isInViewport)
              .reduce(
                (topmost, item) => (topmost && topmost.el.clientTop <= item.el.clientTop ? topmost : item),
                null as TOCItemInfo | null,
              )
          }

          newTOCItems = newTOCItems.map(tocItem => ({
            ...tocItem,
            isActive: tocItem === topmost,
          }))

          return newTOCItems
        })
      },
      {
        root: scrollContainerRef.current,
      },
    )

    return () => observer.current?.disconnect()
  }, [])

  const addTOCItem: TOCContextValue['addTOCItem'] = useCallback((tocItemEl, title) => {
    setTOCItems(tocItems => [
      ...tocItems,
      {
        id: tocItemEl.id,
        title,
        el: tocItemEl,
        isActive: false,
        isInViewport: false,
      },
    ])
    observer.current?.observe(tocItemEl)
  }, [])

  const removeTOCItem: TOCContextValue['removeTOCItem'] = useCallback(tocItemEl => {
    setTOCItems(tocItems => tocItems.filter(val => val.el !== tocItemEl))
    observer.current?.unobserve(tocItemEl)
  }, [])

  const value: TOCContextValue = useMemo(
    () => ({
      scrollContainerRef: el => {
        scrollContainerRef.current = el
      },
      tocItems,
      addTOCItem,
      removeTOCItem,
    }),
    [addTOCItem, removeTOCItem, tocItems],
  )

  return (
    <TOCContext.Provider value={value}>
      {typeof props.children === 'function' ? props.children(value) : props.children}
    </TOCContext.Provider>
  )
}

type TOCElementProps = { id: string }

export const TOCItem: FC<
  Omit<ComponentProps<'div'>, 'children'> &
    TOCElementProps & {
      titleInTOC: string
      children?: ReactNode | ((props: TOCElementProps & { ref: RefAttributes<HTMLHeadingElement>['ref'] }) => ReactNode)
    }
> = props => {
  const { children, id, titleInTOC, ...divProps } = props
  const ref = useRef<HTMLDivElement>(null)

  const { addTOCItem, removeTOCItem } = useContext(TOCContext)

  useEffect(() => {
    const el = ref.current
    if (el == null) return

    addTOCItem(el, titleInTOC)
    return () => removeTOCItem(el)
  }, [addTOCItem, removeTOCItem, titleInTOC])

  const finalId = encodeURIComponent(id.toLowerCase().replaceAll(' ', '_'))

  return typeof children === 'function' ? (
    children({ ref, id: finalId })
  ) : (
    <div ref={ref} id={finalId} {...divProps}>
      {children}
    </div>
  )
}
