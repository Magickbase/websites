import { Post } from './posts'

export function getPostURL(post: Pick<Post, 'source' | 'number'>) {
  return `/posts/${post.source}/${post.number}`
}
