import {
  Discussion,
  Issue,
  getDiscussion,
  getDiscussionCategories,
  getDiscussions,
  getIssue,
  getIssues,
} from './github'
import { createI18nKeyAdder } from './i18n'
import { getPostsViewCount, isKVConfigured } from './kv'

const postSources = ['issues', 'discussions'] as const
export type PostSource = (typeof postSources)[number]

export type Post = Pick<Issue | Discussion, 'number' | 'title' | 'body'> &
  (
    | {
        source: 'issues'
      }
    | {
        source: 'discussions'
        category: Discussion['category']
      }
  ) & {
    key: string
    labels: string[]
  }

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

const addI18nKey = createI18nKeyAdder('common')
const TopLevelMenus: TopLevelMenu[] = [
  {
    name: addI18nKey("Beginner's Guide"),
    source: 'issues',
    sourceTarget: 'Guide',
    children: [
      { name: addI18nKey('About Neuron'), sourceTarget: 'About Neuron' },
      { name: addI18nKey('Usage Tutorial'), sourceTarget: 'Usage Tutorial' },
      { name: addI18nKey('Advanced Features'), sourceTarget: 'Advanced Features' },
    ],
  },
  {
    name: addI18nKey('Frequently Asked Questions'),
    source: 'issues',
    sourceTarget: 'FAQ',
    children: [
      { name: addI18nKey('Sync'), sourceTarget: 'Synchronization' },
      { name: addI18nKey('Transaction'), sourceTarget: 'Transaction' },
      { name: addI18nKey('Assets'), sourceTarget: 'Assets' },
      { name: addI18nKey('Safety'), sourceTarget: 'Safety' },
      { name: addI18nKey('Report'), sourceTarget: 'Report' },
    ],
  },
  {
    name: addI18nKey('Announcement'),
    source: 'discussions',
    sourceTarget: 'Announcements',
    children: [
      { name: addI18nKey('Change log'), sourceTarget: 'Changelog' },
      { name: addI18nKey('Develop guide'), sourceTarget: 'Develop Guide' },
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
    key: `issues_${issue.number}`,
    source: 'issues',
    number: issue.number,
    title: issue.title,
    body: issue.body,
    labels: issue.labels.map(label => (typeof label === 'string' ? label : label.name ?? '')),
  }
}

function discussionToPost(discussion: Discussion): Post {
  return {
    key: `discussions_${discussion.number}`,
    source: 'discussions',
    number: discussion.number,
    title: discussion.title,
    body: discussion.body,
    category: discussion.category,
    labels: discussion.labels.map(label => label.name),
  }
}

async function sortPosts(posts: Post[], topMenu: TopLevelMenu) {
  switch (topMenu.sourceTarget) {
    case 'Guide':
      // Sort by creation time from old to new.
      return posts.sort((a, b) => a.number - b.number)

    case 'FAQ':
      if (!isKVConfigured()) {
        // Sort by creation time from old to new.
        return posts.sort((a, b) => a.number - b.number)
      }

      // Sort by view count from high to low.
      const counts = await getPostsViewCount(posts.map(post => post.key))
      const countMap = Object.fromEntries(posts.map((post, idx) => [post.key, counts[idx]]))
      return posts.sort((a, b) => {
        if (countMap[a.key] === countMap[b.key]) return a.number - b.number
        return (countMap[b.key] ?? 0) - (countMap[a.key] ?? 0)
      })

    case 'Announcements':
      // Sort by creation time from new to old.
      return posts.sort((a, b) => b.number - a.number)

    default:
      return posts
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
      return sortPosts(issues.map(issueToPost).filter(isInMenu), topMenu)

    case 'discussions':
      const categories = await getDiscussionCategories()
      const category = categories.find(({ name }) => name === topMenu.sourceTarget)
      if (category == null) {
        throw new Error('Not found category ' + topMenu.sourceTarget)
      }
      const discussions = await getDiscussions(category.id)
      return sortPosts(discussions.map(discussionToPost).filter(isInMenu), topMenu)
  }
}

export async function getMenusWithPosts(topMenu?: TopLevelMenu): Promise<TopLevelMenu[]> {
  if (!topMenu) {
    const menuWithPostsPromises = TopLevelMenus.map(getMenusWithPosts)
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

  return isInMenu(post) ? post : null
}

export function getPostTopMenu(post: Post): TopLevelMenu | undefined {
  switch (post.source) {
    case 'issues':
      return TopLevelMenus.find(menu => post.labels.includes(menu.sourceTarget))

    case 'discussions':
      return TopLevelMenus.find(menu => menu.sourceTarget === post.category.name)
  }
}

export function getPostMenu(post: Post): Menu | undefined {
  const topMenu = getPostTopMenu(post)
  return topMenu?.children?.find(subMenu => post.labels.includes(subMenu.sourceTarget))
}

export function getTopMenu(menu: Menu): TopLevelMenu | undefined {
  return TopLevelMenus.find(topMenu => topMenu === menu || topMenu.children?.includes(menu))
}

export function isInMenu(post: Post): boolean {
  return getPostMenu(post) != null
}

export function isPostSource(source?: string): source is PostSource {
  return (postSources as readonly unknown[]).includes(source)
}
