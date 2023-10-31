import { kv } from '@vercel/kv'
import { Post } from './posts'

const KEYPREFIX_POST_VIEW_COUNT = 'post_view_count'

export function isKVConfigured() {
  return Boolean(process.env.KV_REST_API_TOKEN && process.env.KV_REST_API_URL)
}

export async function getPostViewCount(postKey: Post['key']) {
  const count = await kv.get<number>(`${KEYPREFIX_POST_VIEW_COUNT}_${postKey}`)
  return count ?? 0
}

export async function getPostsViewCount(postKeys: Post['key'][]) {
  const counts = await kv.mget<(number | null)[]>(...postKeys.map(postKey => `${KEYPREFIX_POST_VIEW_COUNT}_${postKey}`))
  return counts.map(count => count ?? 0)
}

export async function incrPostViewCount(postKey: Post['key']) {
  return kv.incr(`${KEYPREFIX_POST_VIEW_COUNT}_${postKey}`)
}
