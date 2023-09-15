/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentProps, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { HeadingProps } from 'react-markdown/lib/ast-to-react'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import clsx from 'clsx'
import { TOCItem } from '../components/TableOfContents'
import { UpsideDownEffect } from '../components/UpsideDownEffect'

type MarkdownProps = Omit<ComponentProps<typeof ReactMarkdown>, 'children'>

export function useMarkdownProps({
  supportToc = true,
  imgClass,
}: {
  supportToc?: boolean
  imgClass?: string
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
        <a {...tagProps} target="_blank" rel="noopener noreferrer">
          <UpsideDownEffect>{children}</UpsideDownEffect>
        </a>
      ),
      img: ({ node, ...tagProps }) => (
        // Expectedly, all the links are external (content from GitHub), so there is no need to use next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img {...tagProps} alt={tagProps.alt ?? 'image'} className={clsx(tagProps.className, imgClass)} />
      ),
      table: ({ node, ...tagProps }) => (
        // The table is too wide, so we need to wrap it in a container with `overflow: auto`.
        <div style={{ width: 'min-content', maxWidth: '100%', overflow: 'auto' }}>
          <table {...tagProps} />
        </div>
      ),
    }),
    [imgClass, supportToc],
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
