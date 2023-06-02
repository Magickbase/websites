import { Octokit } from '@octokit/rest'
import { paginateRest } from '@octokit/plugin-paginate-rest'
import { components } from '@octokit/openapi-types'

export const REPO = process.env.NEXT_PUBLIC_REPO
const TOKEN = process.env.GITHUB_TOKEN
if (REPO === undefined) throw new Error('NEXT_PUBLIC_REPO is required')
const repoOwner = REPO.split('/')[0] ?? ''
const repoName = REPO.split('/')[1] ?? ''

const EnhancedOctokit = Octokit.plugin(paginateRest)
const octokit = new EnhancedOctokit({ auth: TOKEN })

export type Issue = components['schemas']['issue']

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

export async function getIssue(issueNumber: number): Promise<Issue> {
  const res = await octokit.rest.issues.get({
    owner: repoOwner,
    repo: repoName,
    issue_number: issueNumber,
  })
  return res.data
}
