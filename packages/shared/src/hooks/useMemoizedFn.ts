/**
 * Modified from
 * https://github.com/alibaba/hooks/blob/37749a3a9a6927162e4c68146c9e06a0dffb32f9/packages/hooks/src/useMemoizedFn/index.ts
 */
import { useMemo, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type noop = (this: any, ...args: any[]) => any

export function useMemoizedFn<T extends noop>(fn: T): T
export function useMemoizedFn<T extends noop>(fn?: T): T | (() => void)
export function useMemoizedFn<T extends noop>(fn?: T): T | (() => void) {
  const fnRef = useRef<T | undefined>(fn)

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo(() => fn, [fn])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memoizedFn = useRef<T | ((...args: any[]) => void)>()
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current?.apply(this, args) as ReturnType<T> | void
    }
  }

  return memoizedFn.current as T | (() => void)
}
