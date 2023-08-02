import {
  Discussion,
  Issue,
  getDiscussion,
  getDiscussionCategories,
  getDiscussions,
  getIssue,
  getIssues,
} from './github'

const postSources = ['issues', 'discussions'] as const
export type PostSource = (typeof postSources)[number]

export type Post = Pick<Issue | Discussion, 'number' | 'title' | 'body'> &
  (
    | {
        source: 'issues'
        labels: string[]
      }
    | {
        source: 'discussions'
        category: Discussion['category']
        labels: string[]
      }
  )

export interface Menu {
  name: string
  // label name or category name
  sourceTarget: string
  children?: Menu[]
  posts?: Post[]
}

export interface TopLevelMenu extends Menu {
  source: PostSource
}

const TopLevelMenus: TopLevelMenu[] = [
  {
    name: "Beginner's Guide",
    source: 'issues',
    sourceTarget: 'Guide',
    children: [
      { name: 'Create wallet', sourceTarget: 'create wallet' },
      { name: 'Backup wallet', sourceTarget: 'backup wallet' },
      { name: 'Transfer and receive', sourceTarget: 'transfer and receive' },
    ],
  },
  {
    name: 'Frequently Asked Questions',
    source: 'issues',
    sourceTarget: 'FAQ',
    children: [
      { name: 'Sync', sourceTarget: 'Synchronization' },
      { name: 'Transaction', sourceTarget: 'Transaction' },
      { name: 'Migration', sourceTarget: 'migration' },
      { name: 'CKBNode', sourceTarget: 'ckb node' },
    ],
  },
  {
    name: 'Announcement',
    source: 'discussions',
    sourceTarget: 'Announcements',
    children: [
      { name: 'Change log', sourceTarget: 'changelog' },
      { name: 'Develop guide', sourceTarget: 'develop guide' },
    ],
  },
]

function isPostInMenu(menu: Menu, post: Post) {
  const topMenu = getTopMenu(menu)
  if (topMenu == null) return menu

  if (topMenu.source !== post.source) return false

  switch (post.source) {
    case 'issues':
      return post.labels.includes(menu.sourceTarget)
    case 'discussions':
      // The discussions API only supports querying by a single specified category, not by label.
      // So the data for the top-level menu will be filtered by category, while the sub-level menu will be filtered by label.
      return topMenu === menu ? post.category.name === menu.sourceTarget : post.labels.includes(menu.sourceTarget)
  }
}

function mergePostsToMenu<T extends Menu>(menu: T, posts: Post[]): T {
  const menuPosts = [...(menu.posts ?? []), ...posts.filter(post => isPostInMenu(menu, post))]

  if (menu.children) {
    return {
      ...menu,
      children: menu.children.map(child => mergePostsToMenu(child, posts)),
      posts: menuPosts,
    }
  }

  return {
    ...menu,
    posts: menuPosts,
  }
}

function issueToPost(issue: Issue): Post {
  return {
    source: 'issues',
    number: issue.number,
    title: issue.title,
    body: issue.body,
    labels: issue.labels.map(label => (typeof label === 'string' ? label : label.name ?? '')),
  }
}

function discussionToPost(discussion: Discussion): Post {
  return {
    source: 'discussions',
    number: discussion.number,
    title: discussion.title,
    body: discussion.body,
    category: discussion.category,
    labels: discussion.labels.map(label => label.name),
  }
}

export async function getPosts(topMenu?: TopLevelMenu): Promise<Post[]> {
  if (!topMenu) {
    const menuPostsPromises = TopLevelMenus.map(getPosts)
    const menuPosts: Post[][] = await Promise.all(menuPostsPromises)
    return menuPosts.flat()
  }

  switch (topMenu.source) {
    case 'issues':
      const issues = await getIssues(topMenu.sourceTarget)
      return issues.map(issueToPost)

    case 'discussions':
      const categories = await getDiscussionCategories()
      const category = categories.find(({ name }) => name === topMenu.sourceTarget)
      if (category == null) {
        throw new Error('Not found category ' + topMenu.sourceTarget)
      }
      const discussions = await getDiscussions(category.id)
      return discussions.map(discussionToPost)
  }
}

export async function getMenuWithPosts(topMenu?: TopLevelMenu): Promise<TopLevelMenu[]> {
  if (!topMenu) {
    const menuWithPostsPromises = TopLevelMenus.map(getMenuWithPosts)
    const menus: TopLevelMenu[][] = await Promise.all(menuWithPostsPromises)
    return menus.flat()
  }

  return [mergePostsToMenu(topMenu, await getPosts(topMenu))]
}

export async function getPost(source: PostSource, number: number): Promise<Post | null> {
  let post: Post
  switch (source) {
    case 'issues':
      post = issueToPost(await getIssue(number))
      break

    case 'discussions':
      post = discussionToPost(await getDiscussion(number))
      break
  }

  const isInMenu = getPostTopMenu(post) != null
  return isInMenu ? post : null
}

export function getPostTopMenu(post: Post): TopLevelMenu | undefined {
  switch (post.source) {
    case 'issues':
      return TopLevelMenus.find(menu => post.labels.includes(menu.sourceTarget))

    case 'discussions':
      return TopLevelMenus.find(menu => menu.sourceTarget === post.category.name)
  }
}

export function getTopMenu(menu: Menu): TopLevelMenu | undefined {
  return TopLevelMenus.find(topMenu => topMenu === menu || topMenu.children?.includes(menu))
}

export function isPostSource(source?: string): source is PostSource {
  return (postSources as readonly unknown[]).includes(source)
}
