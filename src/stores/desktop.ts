import { atom } from 'nanostores'
import { BUILTIN_APPS } from './builtin-apps'

export interface App {
  id: string
  name: string
  icon: string
  html: string
  createdAt: number
}

// Initialize with built-in apps
export const apps = atom<App[]>(BUILTIN_APPS)
export const isGenerating = atom<boolean>(false)
export const generationStatus = atom<string>('')

export function addApp(app: App) {
  apps.set([...apps.get(), app])
}

export function removeApp(id: string) {
  // Don't allow removing built-in apps
  if (id.startsWith('__builtin_')) {
    return
  }
  apps.set(apps.get().filter(app => app.id !== id))
}

export function isBuiltinApp(id: string): boolean {
  return id.startsWith('__builtin_')
}
