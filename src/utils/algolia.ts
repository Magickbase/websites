import algoliasearch from 'algoliasearch'
import chunkText from 'chunk-text'
import { Post, getPostLabels } from './posts'

export const APPID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ADMINKEY = process.env.ALGOLIA_ADMIN_KEY
if (APPID === undefined) throw new Error('NEXT_PUBLIC_ALGOLIA_APP_ID is required')
const client = algoliasearch(APPID, ADMINKEY ?? '')

export interface PostIndexRecord {
  number: number
  title: string
  labels: string[]
  assignees?: string[]
  objectID: string
  content: string
}

export async function syncPostsIndex(posts: Post[]) {
  // TODO: need to automatically remove old indexes
  const index = client.initIndex('posts')

  const records: PostIndexRecord[] = posts
    .map(post => {
      const record = {
        number: post.number,
        title: post.title,
        labels: getPostLabels(post),
        assignees: post.assignees?.map(author => author.name ?? author.login ?? ''),
      }
      // TODO: markdown to pure text
      const chunks: string[] = chunkText(post.body ?? '', 5000, {
        charLengthMask: 0,
        charLengthType: 'TextEncoder',
      })
      return chunks.map((chunk, idx) => ({
        ...record,
        objectID: `${post.number}_${idx}`,
        content: chunk,
      }))
    })
    .flat()
  console.log('records', records)
  const result = await index.saveObjects(records).wait()
  console.log('records result', result)
  return result
}
