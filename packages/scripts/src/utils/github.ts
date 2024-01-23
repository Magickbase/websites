import { Octokit } from '@octokit/rest'
import { paginateRest } from '@octokit/plugin-paginate-rest'
import { paginateGraphql } from '@octokit/plugin-paginate-graphql'
import { assert } from './error'

const TOKEN = process.env.GITHUB_TOKEN
assert(TOKEN != null && TOKEN !== '', 'GITHUB_TOKEN is required')

const EnhancedOctokit = Octokit.plugin(paginateRest, paginateGraphql)
const octokit = new EnhancedOctokit({ auth: TOKEN })

const GQL_ProjectV2FieldCommon_FIELDS = () => `
  ... on ProjectV2FieldCommon {
    name
  }
`
const GQL_PROJECTV2ITEMFIELDVALUE_FIELDS = () => `
  ... on ProjectV2ItemFieldTextValue {
    text
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldNumberValue {
    number
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldDateValue {
    date
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldSingleSelectValue {
    name
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldIterationValue {
    title
    startDate
    duration
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldLabelValue {
    labels (first: 100) {
      nodes {
        id
        name
        description
      }
    }
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldMilestoneValue {
    milestone {
      title
      dueOn
    }
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldPullRequestValue {
    pullRequests(first: 100) {
      nodes {
        title
        url
      }
    }
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldRepositoryValue {
    repository {
      name
      url
    }
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldReviewerValue {
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
  ... on ProjectV2ItemFieldUserValue {
    field {${GQL_ProjectV2FieldCommon_FIELDS()}}
  }
`

export async function getOrganizationProjects(org: string) {
  const res = await octokit.graphql<{
    organization: {
      projectsV2: {
        nodes: {
          id: string
          number: number
          title: string
        }[]
      }
    }
  }>(
    `
    query($login: String!) {
      organization(login: $login) {
        projectsV2(first: 100, query: "is:open") {
          totalCount
          nodes {
            id
            number
            title
          }
        }
      }
    }
  `,
    {
      login: org,
    },
  )

  return res.organization.projectsV2.nodes
}

export interface ProjectItem {
  id: string
  content: { title: string; number?: number; url?: string }
  fieldValues: {
    nodes: {
      text?: string
      number?: number
      date?: unknown
      name?: string
      title?: string
      startDate?: unknown
      duration?: unknown
      labels?: { nodes: { name: string }[] }
      milestone?: { title: string; dueOn: unknown }
      pullRequests?: { nodes: { title: string; url: string }[] }
      repository?: { name: string; url: string }
      field: { name: string }
    }[]
  }
}

export async function getProjectItems(id: string) {
  const res = await octokit.graphql.paginate<{
    node: {
      items: {
        nodes: ProjectItem[]
      }
    }
  }>(
    `
      query($cursor: String, $id: ID!) {
        node(id: $id) {
          ... on ProjectV2 {
            items(first: 20, after: $cursor) {
              nodes {
                id
                content {
                  ... on DraftIssue {
                    title
                  }
                  ... on Issue {
                    title
                    number
                    url
                  }
                  ... on PullRequest {
                    title
                    number
                    url
                  }
                }
                fieldValues(first: 100) {
                  nodes {
                    ${GQL_PROJECTV2ITEMFIELDVALUE_FIELDS()}
                  }
                }
              }

              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }
    `,
    {
      id,
    },
  )

  return res.node.items.nodes
}

export async function createDiscussion(
  repoOwner: string,
  repoName: string,
  category: string,
  title: string,
  body: string,
) {
  const repoRes = await octokit.graphql<{
    repository: {
      id: string
      discussionCategories: {
        nodes: {
          id: string
          name: string
        }[]
      }
    }
  }>(
    `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        discussionCategories(first: 100) {
          nodes {
            id
            name
          }
        }
      }
    }
  `,
    {
      owner: repoOwner,
      name: repoName,
    },
  )

  const categoryId = repoRes.repository.discussionCategories.nodes.find(n => n.name === category)?.id
  assert(categoryId)

  const createRes = octokit.graphql<{
    createDiscussion: {
      discussion: {
        id: string
      }
    }
  }>(
    `
    mutation($repoId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
      createDiscussion(input: {repositoryId: $repoId, categoryId: $categoryId, body: $body, title: $title}) {
        discussion {
          id
        }
      }
    }
  `,
    {
      repoId: repoRes.repository.id,
      categoryId,
      title,
      body,
    },
  )

  return (await createRes).createDiscussion.discussion
}
