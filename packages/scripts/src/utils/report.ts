import { join } from 'path'
import { existsSync, readFileSync, renameSync, writeFileSync } from 'fs'
import { ProjectItem, createDiscussion, getOrganizationProjects, getProjectItems } from './github'
import { assert } from './error'
import { ensureFileFolderExists } from './file'

const projectNames = ['CKB Explorer', 'Neuron', 'Fiber Explorer', 'P | Magickbase']
const sortedStatusValues = [
  '🆕 New',
  '📫Hold On',
  '📋 Backlog',
  '📌Planning',
  '🎨 Designing',
  '🏗 In Progress',
  '🔎 Code Review',
  '👀 Testing',
  '🚩Pre Release',
  '✅ Done',
]

const statusDisplayMap = {
  '🆕 New': '🆕 **New**',
  '📫Hold On': '⏸️ **On Hold**',
  '📋 Backlog': '📋 **Backlog**',
  '📌Planning': '📌 **Planning**',
  '🎨 Designing': '🎨 **Designing**',
  '🏗 In Progress': '🏗 **In Progress**',
  '🔎 Code Review': '🔍 **Code Review**',
  '👀 Testing': '🧪 **Testing**',
  '🚩Pre Release': '🚀 **Pre-Release**',
  '✅ Done': '✅ **Done**',
}

const folder = join(process.cwd(), 'snapshots')
const currentFilepath = join(folder, 'current.json')
const prevFilepath = join(folder, 'prev.json')

export async function updateSnapshots() {
  const projects = [...(await getOrganizationProjects('Magickbase'))]
  const filteredProjects = projects.filter(p => projectNames.includes(p.title))
  assert(filteredProjects.length === projectNames.length)

  const projectItemsMap: Record<string, ProjectItem[]> = {}
  for (const project of filteredProjects) {
    projectItemsMap[project.title] = await getProjectItems(project.id)
  }

  if (existsSync(currentFilepath)) {
    renameSync(currentFilepath, prevFilepath)
  }
  ensureFileFolderExists(currentFilepath)
  writeFileSync(currentFilepath, JSON.stringify(projectItemsMap))
}

export function generateDevlogFromSnapshotsDiff() {
  if (!existsSync(currentFilepath) || !existsSync(prevFilepath)) return null
  const currentProjectItemsMap = JSON.parse(readFileSync(currentFilepath).toString()) as Record<string, ProjectItem[]>
  const prevProjectItemsMap = JSON.parse(readFileSync(prevFilepath).toString()) as Record<string, ProjectItem[]>

  let devLog = ''

  const reportDate = new Date().toISOString().slice(0, 10)
  devLog += `# 📊 Development Progress Report\n\n`
  devLog += `**Date:** ${reportDate}\n`
  devLog += `**Generated:** ${new Date().toLocaleString()}\n\n`

  let totalNew = 0
  let totalUpdates = 0
  let totalCompleted = 0

  for (const [title, currentItems] of Object.entries(currentProjectItemsMap)) {
    const prevItems = prevProjectItemsMap[title] ?? []

    const currentMap = itemsToItemMap(currentItems)
    const prevMap = itemsToItemMap(prevItems)

    const newItems: ProjectItem[] = []
    const update: ProjectItem[] = []
    const done: ProjectItem[] = []

    for (const id of Object.keys(currentMap)) {
      const currentItem = currentMap[id]

      if (!currentItem?.content?.title) continue

      const prevItem = prevMap[id]
      assert(currentItem)

      const hasAnyChange = !prevItem || JSON.stringify(currentItem) !== JSON.stringify(prevItem)
      const hasStatusChange = !prevItem || getField(currentItem, 'Status')?.name !== getField(prevItem, 'Status')?.name
      if (!hasAnyChange) continue

      const currentStatus = getField(currentItem, 'Status')?.name ?? '🆕 New'
      switch (currentStatus) {
        case '🆕 New':
          newItems.push(currentItem)
          break
        case '🚩Pre Release':
        case '✅ Done':
          const prevStatus = prevItem == null ? '' : getField(prevItem, 'Status')?.name ?? ''
          const prevIsDone = ['🚩Pre Release', '✅ Done'].includes(prevStatus)
          if (hasStatusChange && !prevIsDone) {
            done.push(currentItem)
          }
          break
        default:
          update.push(currentItem)
          break
      }
    }

    totalNew += newItems.length
    totalUpdates += update.length
    totalCompleted += done.length
    ;[newItems, update, done].forEach(items =>
      items.sort((a, b) => {
        const aStatus = getField(a, 'Status')?.name ?? '🆕 New'
        const bStatus = getField(b, 'Status')?.name ?? '🆕 New'
        return sortedStatusValues.indexOf(aStatus) - sortedStatusValues.indexOf(bStatus)
      }),
    )

    const getStatusChangeLog = (item: ProjectItem) => {
      const currentStatus = getField(item, 'Status')?.name ?? '🤖 Unset'
      const prevItem = prevMap[item.id]
      const prevStatus = prevItem == null ? undefined : getField(prevItem, 'Status')?.name

      if (prevStatus == null || currentStatus === prevStatus) {
        return `**${statusDisplayMap[currentStatus as keyof typeof statusDisplayMap] || currentStatus}**`
      }
      return `**${statusDisplayMap[prevStatus as keyof typeof statusDisplayMap] || prevStatus}** → **${
        statusDisplayMap[currentStatus as keyof typeof statusDisplayMap] || currentStatus
      }**`
    }

    const getContentURL = (item: ProjectItem) =>
      item.content.url != null ? ` [#${item.content.number}](${item.content.url})` : ''

    const getPriority = (item: ProjectItem) => {
      const priority = getField(item, 'Priority')?.name
      if (!priority) return ''

      const priorityMap = {
        High: '🟥',
        Medium: '🟨',
        Low: '🟩',
        Urgent: '🚨',
      }
      return ` ${priorityMap[priority as keyof typeof priorityMap] || ''}`
    }

    const getLabels = (item: ProjectItem) => {
      const labels = getField(item, 'Labels')?.name
      if (!labels) return ''
      return ` \`${labels}\``
    }

    devLog += `### ${title}\n\n`

    if ([newItems, update, done].every(items => items.length === 0)) {
      devLog += `#### 📊 No Updates\n\n*No changes detected in this project since the last snapshot.*\n\n`
      continue
    }

    if (newItems.length > 0) {
      devLog += '#### 🆕 New Items\n\n'
      devLog += '| Status | Title | Issue |\n'
      devLog += '|--------|-------|-------|\n'
      newItems.forEach(item => {
        const status = getStatusChangeLog(item)
        const title = item.content.title
        const issue = getContentURL(item)
        const priority = getPriority(item)
        const labels = getLabels(item)
        devLog += `| ${status} | ${title}${priority}${labels} | ${issue} |\n`
      })
      devLog += '\n'
    }

    if (update.length > 0) {
      devLog += '#### 🔄 Updates\n\n'
      devLog += '| Status Change | Title | Issue |\n'
      devLog += '|---------------|-------|-------|\n'
      update.forEach(item => {
        const statusChange = getStatusChangeLog(item)
        const title = item.content.title
        const issue = getContentURL(item)
        const priority = getPriority(item)
        const labels = getLabels(item)
        devLog += `| ${statusChange} | ${title}${priority}${labels} | ${issue} |\n`
      })
      devLog += '\n'
    }

    if (done.length > 0) {
      devLog += '#### ✅ Completed\n\n'
      devLog += '| Final Status | Title | Issue |\n'
      devLog += '|--------------|-------|-------|\n'
      done.forEach(item => {
        const finalStatus = `**${
          statusDisplayMap[getField(item, 'Status')?.name as keyof typeof statusDisplayMap] ||
          getField(item, 'Status')?.name
        }**`
        const title = item.content.title
        const issue = getContentURL(item)
        const priority = getPriority(item)
        const labels = getLabels(item)
        devLog += `| ${finalStatus} | ${title}${priority}${labels} | ${issue} |\n`
      })
    }

    devLog += '\n---\n\n'
  }

  const summary = `## 📈 Summary\n\n`
  const summaryTable = `| Metric | Count |\n|--------|-------|\n`
  const summaryRows = [
    `| 🆕 New Items | ${totalNew} |`,
    `| 🔄 Updates | ${totalUpdates} |`,
    `| ✅ Completed | ${totalCompleted} |`,
    `| 📊 Total Changes | ${totalNew + totalUpdates + totalCompleted} |`,
  ].join('\n')

  const finalDevLog = devLog.replace(
    '# 📊 Development Progress Report',
    `# 📊 Development Progress Report\n\n${summary}${summaryTable}${summaryRows}\n\n---\n\n## 📋 Project Details`,
  )

  return finalDevLog
}

export async function createDevlogDiscussion() {
  const devLog = generateDevlogFromSnapshotsDiff()
  if (devLog == null) return null

  return createDiscussion(
    'Magickbase',
    'shaping',
    'Dev Log',
    `Dev Log ${new Date().toISOString().slice(0, 10)}`,
    devLog,
  )
}

function itemsToItemMap(items: ProjectItem[]): Record<ProjectItem['id'], ProjectItem> {
  const map: Record<ProjectItem['id'], ProjectItem> = {}
  for (const item of items) {
    map[item.id] = item
  }
  return map
}

function getField(item: ProjectItem, filedName: string) {
  return item.fieldValues.nodes.find(n => n.field.name === filedName)
}
