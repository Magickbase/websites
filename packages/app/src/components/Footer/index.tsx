import { ComponentProps, FC } from 'react'

export type FooterProps = ComponentProps<'div'>

export const Footer: FC<FooterProps> = props => {
  return <div {...props}>footer</div>
}
