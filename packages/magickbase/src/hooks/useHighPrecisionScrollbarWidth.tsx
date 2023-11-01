import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useDevicePixelRatio } from '.'

// The `--removed-body-scroll-bar-size` provided by `react-remove-scroll` does not have decimal places and is
// not precise enough, so we will implement our own.
export function useHighPrecisionScrollbarWidth(): {
  tester: ReactNode
  scrollbarWidth: number
  refresh: () => void
} {
  const pixelRatio = useDevicePixelRatio()
  const [width, setWidth] = useState(0)
  const refTesterContainer = useRef<HTMLDivElement>(null)
  const refTesterContent = useRef<HTMLDivElement>(null)

  const tester = (
    <div ref={refTesterContainer} style={{ width: 100, height: 100 }}>
      <div ref={refTesterContent} style={{ width: '100%' }}></div>
    </div>
  )

  const refresh = useCallback(() => {
    if (!refTesterContainer.current || !refTesterContent.current) {
      setWidth(0)
      return
    }

    const originValue = refTesterContainer.current.style.overflowY
    refTesterContainer.current.style.overflowY = 'scroll'
    const widthWithScrollbar = refTesterContent.current.getBoundingClientRect().width
    refTesterContainer.current.style.overflowY = originValue
    const scrollbarWidth = refTesterContent.current.getBoundingClientRect().width - widthWithScrollbar
    setWidth(scrollbarWidth)
  }, [])

  useEffect(
    () => refresh(),
    [
      refresh,
      // When the user zooms the webpage, the pixelRatio and scrollbar size will change, so we refresh when pixelRatio changes.
      pixelRatio,
    ],
  )

  return {
    tester,
    scrollbarWidth: width,
    refresh,
  }
}
