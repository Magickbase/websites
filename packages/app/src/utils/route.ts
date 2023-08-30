import { Post } from './posts'

export function getPostURL(post: Pick<Post, 'source' | 'number'>) {
  return `/posts/${post.source}/${post.number}`
}

export function removeURLOrigin(url: string) {
  try {
    const urlObj = new URL(url)
    return url.replace(urlObj.origin, '')
  } catch {
    return url
  }
}
