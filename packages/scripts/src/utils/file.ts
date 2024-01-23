import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

export function ensureFileFolderExists(filePath: string) {
  const folder = dirname(filePath)
  if (existsSync(folder)) return
  mkdirSync(folder, { recursive: true })
}
