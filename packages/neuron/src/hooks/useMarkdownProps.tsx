/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentProps, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { HeadingProps } from 'react-markdown/lib/ast-to-react'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import clsx from 'clsx'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { TOCItem } from '../components/TableOfContents'
import { UpsideDownEffect } from '../components/UpsideDownEffect'

type MarkdownProps = Omit<ComponentProps<typeof ReactMarkdown>, 'children'>

export function useMarkdownProps({
  supportToc = true,
  imgClass,
  linkClass,
  disableLinkEffect,
}: {
  supportToc?: boolean
  imgClass?: string
  linkClass?: string
  disableLinkEffect?: boolean
}): MarkdownProps {
  const components: MarkdownProps['components'] = useMemo(
    () => ({
      ...(supportToc && {
        h1: wrapHeadingWithTOCItem('h1'),
        h2: wrapHeadingWithTOCItem('h2'),
        h3: wrapHeadingWithTOCItem('h3'),
        h4: wrapHeadingWithTOCItem('h4'),
        h5: wrapHeadingWithTOCItem('h5'),
        h6: wrapHeadingWithTOCItem('h6'),
      }),

      a: ({ node, children, ...tagProps }) => (
        <a {...tagProps} className={clsx(tagProps.className, linkClass)} target="_blank" rel="noopener noreferrer">
          {disableLinkEffect ? children : <UpsideDownEffect>{children}</UpsideDownEffect>}
        </a>
      ),
      img: ({ node, ...tagProps }) => (
        // Expectedly, all the links are external (content from GitHub), so there is no need to use next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img {...tagProps} className={clsx(tagProps.className, imgClass)} alt={tagProps.alt ?? 'image'} />
      ),
      table: ({ node, ...tagProps }) => (
        // The table is too wide, so we need to wrap it in the OverlayScrollbarsComponent.
        <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: 'never' } }}>
          <table {...tagProps} />
        </OverlayScrollbarsComponent>
      ),
    }),
    [disableLinkEffect, imgClass, linkClass, supportToc],
  )

  const remarkPlugins = useMemo(() => [remarkGfm], [])
  const rehypePlugins = useMemo(() => [rehypeRaw, rehypeSanitize], [])

  return { remarkPlugins, rehypePlugins, components }
}

function wrapHeadingWithTOCItem(HeadingTag: string) {
  return function tagWithTOCItem({ node, ...tagProps }: HeadingProps) {
    const content = tagProps.children[0]
    if (typeof content !== 'string') return <HeadingTag {...tagProps} />

    return (
      <TOCItem id={content} titleInTOC={content}>
        <HeadingTag {...tagProps} />
      </TOCItem>
    )
  }
}
