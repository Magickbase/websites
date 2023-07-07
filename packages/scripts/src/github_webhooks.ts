import './prepare'
import { basename } from 'path'
import { createWebhook, getWebhooks, updateWebhook } from './utils/github'

async function main() {
  const apiPath = getAPIPath()
  if (apiPath == null) {
    console.warn('apiPath is null')
    process.exit(0)
  }

  const webhooks = await getWebhooks()
  const existedWebhook = webhooks.find(webhook => {
    if (!webhook.config.url) return false
    const url = new URL(webhook.config.url)
    return url.pathname + url.search === apiPath
  })
  console.info('existedWebhook', existedWebhook?.id)

  // TODO: Should VERCEL_BRANCH_URL be used? Does VERCEL_URL provide additional support for custom domains?
  const { VERCEL_URL } = process.env
  if (!VERCEL_URL) throw new Error('VERCEL_URL is required')
  const callbackURL = `https://${VERCEL_URL}${apiPath}`
  console.info('callbackURL', callbackURL)

  if (existedWebhook == null) {
    await createWebhook(callbackURL)
  } else if (existedWebhook.config.url !== callbackURL) {
    await updateWebhook(existedWebhook.id, callbackURL)
  }

  console.log(`script ${basename(import.meta.url)} done`)
}

function getAPIPath() {
  const base = '/api/webhooks/github'

  const { VERCEL_GIT_PULL_REQUEST_ID, NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF } = process.env

  // Only one at a time
  if (VERCEL_GIT_PULL_REQUEST_ID) return `${base}?pr`

  // renovate branches is bot created
  if (NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF && !NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF.startsWith('renovate/'))
    return `${base}?br=${NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}`
}

await main()
