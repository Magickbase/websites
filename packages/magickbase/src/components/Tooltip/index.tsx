import { FC, PropsWithChildren, ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import * as RadixPopover from '@radix-ui/react-popover'
import clsx from 'clsx'
import { useIsMobile } from '@/hooks/useIsMobile'
import styles from './index.module.scss'

export const Tooltip: FC<PropsWithChildren<{ content?: ReactNode; className?: string }>> = props => {
  const isMobile = useIsMobile()

  return isMobile ? (
    // RadixTooltip does not support mobile, so use RadixPopover instead.
    <RadixPopover.Root>
      <RadixPopover.Trigger className={clsx(styles.trigger, props.className)}>{props.children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content className={styles.content}>
          {props.content}
          {/* TODO: The inside border line needs to be hidden */}
          <RadixPopover.Arrow className={styles.arrow} width={32} height={16} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  ) : (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger className={clsx(styles.trigger, props.className)}>{props.children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content side="top" className={styles.content}>
          {props.content}
          {/* TODO: The inside border line needs to be hidden */}
          <RadixTooltip.Arrow className={styles.arrow} width={32} height={16} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

export const TooltipProvider: FC<PropsWithChildren> = props => {
  return <RadixTooltip.Provider delayDuration={0}>{props.children}</RadixTooltip.Provider>
}
