import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

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
      <Html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
        <Head>
          <meta name="color-scheme" content="light only" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
