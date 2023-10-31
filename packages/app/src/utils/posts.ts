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
import { unique } from './array'

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

function sortPosts(posts: Post[], topMenu: TopLevelMenu) {
  switch (topMenu.sourceTarget) {
    case 'Guide':
      // Sort by creation time from old to new.
      return posts.sort((a, b) => a.number - b.number)

    case 'FAQ':
      // Sort by creation time from old to new.
      // TODO: Sort by view count.
      return posts.sort((a, b) => a.number - b.number)

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

// Currently, the `<!-- PARSE_CSV_TO_MARKDOWN: ${url} -->` syntax is supported here, which replaces it with a markdown table.
async function handleRawPostBody<T extends Issue | Discussion>(raw: T): Promise<T> {
  if (raw.body == null) return raw
  let newBody = raw.body

  const linesNeedParse = Array.from(raw.body?.match(/<!-- PARSE_CSV_TO_MARKDOWN: https:\/\/.*?\.csv -->/g) ?? [])
  const csvURLs = unique(
    linesNeedParse.map(wrapperd => wrapperd.replace(/<!-- PARSE_CSV_TO_MARKDOWN: (https:\/\/.*?\.csv) -->/, '$1')),
  )
  const csvContents = await Promise.all(csvURLs.map(url => fetch(url).then(res => res.text())))
  const markdownContents = csvContents.map(content => {
    content = content.trim()

    // calc columnsDefineStatement
    let lines = content.split('\n')
    const columns = (lines[0] ?? '').split(/(?<!\\),/)
    const columnsDefineStatement = columns.map(() => '--').join(' | ')

    // replace `,` to `|`
    // The implementation here is not rigorous, for example, it does not consider the case of escaping escape characters,
    // but most of the time it will not cause problems.
    content = content
      .trim()
      .replaceAll('|', '\\|')
      .replace(/(?<!\\),/g, '|')

    // insert columnsDefineStatement
    lines = content.split('\n')
    lines.splice(1, 0, columnsDefineStatement)
    content = lines.join('\n')

    return content
  })

  csvURLs.map((url, idx) => {
    newBody = newBody.replaceAll(`<!-- PARSE_CSV_TO_MARKDOWN: ${url} -->`, markdownContents[idx] ?? '')
  })

  return { ...raw, body: newBody }
}

export async function getPost(source: PostSource, number: number): Promise<Post | null> {
  let post: Post
  switch (source) {
    case 'issues':
      const issue = await handleRawPostBody(await getIssue(number))
      post = issueToPost(issue)
      break

    case 'discussions':
      const discussion = await handleRawPostBody(await getDiscussion(number))
      post = discussionToPost(discussion)
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
