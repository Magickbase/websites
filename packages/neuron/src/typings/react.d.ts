declare namespace React {
  import { HTMLAttributes as ReactHTMLAttributes } from 'react'

  export interface HTMLAttributes<T> extends ReactHTMLAttributes<T> {
    // https://github.com/KingSora/OverlayScrollbars/blob/060cf1cd9c677482a3a04274cb237da894f0d4b8/README.md#bridging-initialization-flickering
    'data-overlayscrollbars-initialize'?: boolean
  }
}
