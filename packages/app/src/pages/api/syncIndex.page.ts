import { NextApiHandler } from 'next'
import { getPosts, syncPostsIndex } from '../../utils'

const SYNC_TOKEN = process.env.SYNC_TOKEN

const handle: NextApiHandler<{ message: string }> = async (req, res) => {
  const authToken = (req.headers['authorization'] ?? '').split('Bearer ').at(1)
  if (SYNC_TOKEN && authToken != SYNC_TOKEN) return res.status(401).json({ message: 'Unauthorized' })

  const posts = await getPosts()
  await syncPostsIndex(posts)

  const postPaths = posts.map(post => `/posts/${post.source}/${post.number}`)
  await Promise.all([res.revalidate('/'), ...postPaths.map(path => res.revalidate(path))])

  return res.json({ message: 'OK' })
}

export default handle
