import { Webhooks } from '@octokit/webhooks'
import { Octokit } from '@octokit/rest'
import { paginateRest } from '@octokit/plugin-paginate-rest'
import { components } from '@octokit/openapi-types'
import {
  Discussion as GQLDiscussion,
  DiscussionCategory as GQLDiscussionCategory,
  Label as GQLLabel,
  Repository,
  SearchResultItemConnection,
} from '@octokit/graphql-schema'
import { BooleanT } from './array'

export const REPO = process.env.NEXT_PUBLIC_REPO
const TOKEN = process.env.GITHUB_TOKEN
if (REPO === undefined) throw new Error('NEXT_PUBLIC_REPO is required')
const repoOwner = REPO.split('/')[0] ?? ''
const repoName = REPO.split('/')[1] ?? ''

const EnhancedOctokit = Octokit.plugin(paginateRest)
const octokit = new EnhancedOctokit({ auth: TOKEN })

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET ?? 'secret'
export const webhooks = new Webhooks({
  secret: GITHUB_WEBHOOK_SECRET,
})

export type Issue = components['schemas']['issue']
export type DiscussionCategory = Omit<GQLDiscussionCategory, 'repository'>
export type Discussion = Pick<GQLDiscussion, 'id' | 'number' | 'title' | 'body' | 'createdAt' | 'url'> & {
  category: DiscussionCategory
  labels: Pick<GQLLabel, 'id' | 'name' | 'description'>[]
}

const GQL_CATEGORY_FIELDS = () => `
  createdAt
  description
  emoji
  emojiHTML
  id
  isAnswerable
  name
  slug
  updatedAt
`
const GQL_DISCUSSION_FIELDS = (labelFirst = 100) => `
  id
  number
  title
  body
  category {
    ${GQL_CATEGORY_FIELDS()}
  }
  createdAt
  url
  labels(first: ${labelFirst}) {
    nodes {
      id
      name
      description
    }
  }
`

export async function getIssues(label?: string, limit = Infinity): Promise<Issue[]> {
  let sum = 0
  const issues = await octokit.paginate(
    octokit.rest.issues.listForRepo,
    {
      owner: repoOwner,
      repo: repoName,
      labels: label,
      per_page: Math.min(limit, 100),
      state: 'all',
    },
    (response, done) => {
      sum += response.data.length
      if (sum >= limit) done()
      return response.data
    },
  )
  return issues.slice(0, limit)
}

// TODO: support nullable
export async function getIssue(issueNumber: number): Promise<Issue> {
  const res = await octokit.rest.issues.get({
    owner: repoOwner,
    repo: repoName,
    issue_number: issueNumber,
  })
  return res.data
}

export async function getDiscussionCategories(): Promise<DiscussionCategory[]> {
  const res = await octokit.graphql<{ repository: Repository }>(
    `
    query($repoOwner: String!, $repoName: String!) {
      repository(owner: $repoOwner, name: $repoName) {
        discussionCategories(first: 100) {
          nodes {
            ${GQL_CATEGORY_FIELDS()}
          }
        }
      }
    }
  `,
    {
      repoOwner,
      repoName,
    },
  )
  const discussionCategories = res.repository.discussionCategories.nodes ?? []
  return discussionCategories.filter(BooleanT())
}

export async function getDiscussions(categoryId: DiscussionCategory['id']): Promise<Discussion[]> {
  // TODO: support paginate
  const res = await octokit.graphql<{ repository: Repository }>(
    `
    query($repoOwner: String!, $repoName: String!, $categoryId: ID) {
      repository(owner: $repoOwner, name: $repoName) {
        discussions(first: 100, categoryId: $categoryId) {
          nodes {
            ${GQL_DISCUSSION_FIELDS()}
          }
        }
      }
    }
  `,
    {
      repoOwner,
      repoName,
      categoryId,
    },
  )
  const discussions = res.repository.discussions.nodes ?? []
  return discussions.filter(BooleanT()).map(discussion => ({
    ...discussion,
    labels: (discussion.labels?.nodes ?? []).filter(BooleanT()),
  }))
}

// TODO: support nullable
export async function getDiscussion(number: number): Promise<Discussion> {
  const res = await octokit.graphql<{ repository: Repository }>(
    `
    query($repoOwner: String!, $repoName: String!, $number: Int!) {
      repository(owner: $repoOwner, name: $repoName) {
        discussion(number: $number) {
          ${GQL_DISCUSSION_FIELDS()}
        }
      }
    }
  `,
    {
      repoOwner,
      repoName,
      number,
    },
  )

  const discussion = res.repository.discussion
  if (discussion == null) {
    throw new Error(`Discussion ${number} not found`)
  }

  return {
    ...discussion,
    labels: (discussion.labels?.nodes ?? []).filter(BooleanT()),
  }
}

// This function is currently not in use. it is reserved for a future scenario where there
// may be a desire to switch to obtaining the top-level menu of Discussions through labels.
export async function getDiscussionsByLabel(label?: string): Promise<Discussion[]> {
  // TODO: support paginate
  const res = await octokit.graphql<{ search: SearchResultItemConnection }>(
    `
    query($searchQuery: String!) {
      search(type: DISCUSSION, query: $searchQuery, first: 100) {
        discussionCount
        nodes {
          ... on Discussion {
            ${GQL_DISCUSSION_FIELDS()}
          }
        }
      }
    }
  `,
    {
      searchQuery: `repo:${repoOwner}/${repoName}${label ? ` label:"${label}"` : ''}`,
    },
  )
  const discussions = res.search.nodes?.filter((node): node is GQLDiscussion => node?.__typename === 'Discussion') ?? []
  return discussions.map(discussion => ({
    ...discussion,
    labels: (discussion.labels?.nodes ?? []).filter(BooleanT()),
  }))
}
