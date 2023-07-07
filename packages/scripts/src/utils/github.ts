import { Octokit } from '@octokit/rest'

export const REPO = process.env.NEXT_PUBLIC_REPO
const TOKEN = process.env.GITHUB_TOKEN
if (REPO === undefined) throw new Error('NEXT_PUBLIC_REPO is required')
const repoOwner = REPO.split('/')[0] ?? ''
const repoName = REPO.split('/')[1] ?? ''

const octokit = new Octokit({ auth: TOKEN })

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET ?? 'secret'

export async function createWebhook(callbackURL: string) {
  const res = await octokit.rest.repos.createWebhook({
    owner: repoOwner,
    repo: repoName,
    events: ['discussion', 'issues'],
    config: {
      url: callbackURL,
      content_type: 'json',
      secret: GITHUB_WEBHOOK_SECRET,
    },
  })
  return res.data
}

export async function updateWebhook(hookId: number, callbackURL: string) {
  const res = await octokit.rest.repos.updateWebhook({
    owner: repoOwner,
    repo: repoName,
    hook_id: hookId,
    events: ['discussion', 'issues'],
    config: {
      url: callbackURL,
      content_type: 'json',
      secret: GITHUB_WEBHOOK_SECRET,
    },
  })
  return res.data
}

export async function getWebhooks() {
  const res = await octokit.rest.repos.listWebhooks({
    owner: repoOwner,
    repo: repoName,
  })
  return res.data
}
