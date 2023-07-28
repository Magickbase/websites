import './prepare'
// TODO: Now that the `utils` are an exact copy of what's in the `app` package, you should consider creating a `shared` package.
import { syncPostsIndex } from './utils/algolia'
import { getPosts } from './utils/posts'

const posts = await getPosts()
await syncPostsIndex(posts)
