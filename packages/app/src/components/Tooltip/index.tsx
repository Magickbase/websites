import { FC, PropsWithChildren, ReactNode } from 'react'
import { Root, Trigger, Content, Provider, Portal, Arrow } from '@radix-ui/react-tooltip'
import styles from './index.module.scss'

export const Tooltip: FC<PropsWithChildren<{ content?: ReactNode }>> = props => {
  return (
    <Root>
      <Trigger className={styles.trigger}>{props.children}</Trigger>
      <Portal>
        <Content className={styles.content}>
          {props.content}
          {/* TODO: The inside border line needs to be hidden */}
          <Arrow className={styles.arrow} width={32} height={16} />
        </Content>
      </Portal>
    </Root>
  )
}

export const TooltipProvider: FC<PropsWithChildren> = props => {
  return <Provider delayDuration={0}>{props.children}</Provider>
}
