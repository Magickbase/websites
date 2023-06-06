import { Issue, getIssue, getIssues } from './github'

export type Post = Issue

export interface Menu {
  name: string
  label: string
  children?: Menu[]
  posts?: Post[]
}

const PostMenu: Menu[] = [
  {
    name: 'New User Guide',
    label: 'guide',
    children: [
      { name: 'Create wallet', label: 'create wallet' },
      { name: 'Backup wallet', label: 'backup wallet' },
      { name: 'Transfer and receive', label: 'transfer and receive' },
    ],
  },
  {
    name: 'Frequently Asked Questions',
    label: 'faq',
    children: [
      { name: 'Sync', label: 'sync' },
      { name: 'Migration', label: 'migration' },
      { name: 'CKBNode', label: 'ckb node' },
    ],
  },
  {
    name: 'Announcement',
    label: 'announcement',
    children: [
      { name: 'Change log', label: 'changelog' },
      { name: 'Develop guide', label: 'develop guide' },
    ],
  },
]

function mergePostsToMenu(menu: Menu, posts: Post[]): Menu {
  const menuPosts = [
    ...(menu.posts ?? []),
    ...posts.filter(post => getPostLabels(post).some(label => label === menu.label)),
  ]

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

export async function getMenuWithPosts(topMenu?: Menu) {
  if (topMenu) {
    const issues = await getIssues(topMenu.label)
    return [mergePostsToMenu(topMenu, issues)]
  }

  const menuWithPostsPromises = PostMenu.map(async menu => {
    const issues = await getIssues(menu.label)
    return mergePostsToMenu(menu, issues)
  })
  const menus: Menu[] = await Promise.all(menuWithPostsPromises)
  return menus
}

export async function getPosts() {
  const menuWithPostsPromises = PostMenu.map(async menu => {
    const issues = await getIssues(menu.label)
    return issues
  })
  const posts: Post[] = (await Promise.all(menuWithPostsPromises)).flat()
  return posts
}

export async function getPost(id: number) {
  const post = await getIssue(id)
  const isInMenu = getPostTopMenu(post) != null
  return isInMenu ? post : null
}

export function getPostLabels(post: Post): string[] {
  return post.labels.map(label => (typeof label === 'string' ? label : label.name ?? ''))
}

export function getPostTopMenu(post: Post) {
  const labels = getPostLabels(post)
  return PostMenu.find(menu => labels.includes(menu.label))
}
