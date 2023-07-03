import { ComponentProps, FC } from 'react'

export type HeaderProps = ComponentProps<'div'>

export const Header: FC<HeaderProps> = props => {
  return <div {...props}>header</div>
}
