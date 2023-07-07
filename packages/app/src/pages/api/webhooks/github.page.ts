import { NextApiHandler } from 'next'
import { EmitterWebhookEvent, createNodeMiddleware } from '@octokit/webhooks'
import { Post, getPost, syncPostsIndex, webhooks } from '../../../utils'

export const config = {
  api: {
    // This is because the `middleware` created by `@octokit/webhooks` requires the raw body for internal processing,
    // and it will automatically retrieve it from the data event.
    bodyParser: false,
  },
}

const middleware = createNodeMiddleware(webhooks, {
  // TODO: Is there any way to dynamically get the pathname of the current page?
  path: '/api/webhooks/github',
})

const handle: NextApiHandler = async (req, res) => {
  const reqId = req.headers['x-github-delivery']
  if (typeof reqId !== 'string') return res.json({ message: 'Missing x-github-delivery' })

  const onWebhook = async ({ id, name, payload }: EmitterWebhookEvent) => {
    if (id !== reqId) return

    let post: Post | null = null
    switch (name) {
      case 'issues':
        post = await getPost('issues', payload.issue.number)
        break
      case 'discussion':
        post = await getPost('discussions', payload.discussion.number)
        break
    }
    if (post === null) return

    const postPath = `/posts/${post.source}/${post.number}`
    await Promise.all([syncPostsIndex([post]), res.revalidate('/'), res.revalidate(postPath)])
  }

  // TODO: Vercel seems to have a timeout mechanism that forcibly terminates the process.
  // So, is it possible that if the `middleware` execution times out and is forcibly terminated,
  // the `finally` block will not be executed, leading to a memory leak?
  webhooks.onAny(onWebhook)
  try {
    // This `promise` will wait for all webhooks callbacks (including the `onWebhook` above) to complete before ending.
    await middleware(req, res)
  } finally {
    webhooks.removeListener('*', onWebhook)
  }
}

export default handle
