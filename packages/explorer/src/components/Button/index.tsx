/**
 * Currently, there are no complex button scenarios, so a simple implementation is sufficient.
 * If the requirements cannot be met in the future, consider using a third-party component library.
 */
import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import presets from '../../styles/presets.module.scss'

export type ButtonVariant = 'contained' | 'outlined' | 'text'

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  theme?: 'light' | 'dark' | 'blackwhite'
}

export const Button: FC<ButtonProps> = ({ children, variant = 'contained', theme, ...elProps }) => {
  return (
    <button
      {...elProps}
      className={clsx(
        styles.button,
        {
          [styles.contained ?? '']: variant === 'contained',
          [styles.outlined ?? '']: variant === 'outlined',
          [styles.text ?? '']: variant === 'text',

          [presets.themeLight ?? '']: theme === 'light',
          [presets.themeDark ?? '']: theme === 'dark',
          [styles.themeBlackWhite ?? '']: theme === 'blackwhite',
        },
        elProps.className,
      )}
    >
      {children}
    </button>
  )
}
