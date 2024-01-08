import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import Script from 'next/script'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: <>{initialProps.styles}</>,
    }
  }

  render() {
    return (
      <Html lang="en" data-theme="magickbase" style={{ colorScheme: 'light' }}>
        <Head>
          <meta name="color-scheme" content="light only" />
          <link rel="icon" href="/favicon.svg" sizes="any" />
        </Head>
        <body className="h-screen relative overflow-x-hidden overflow-y-scroll">
          <Main />
          <NextScript />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js" async></script>
        </body>
      </Html>
    )
  }
}
