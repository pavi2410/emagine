import { atom } from 'nanostores'

export interface App {
  id: string
  name: string
  icon: string
  html: string
  createdAt: number
}

export const apps = atom<App[]>([])
export const isGenerating = atom<boolean>(false)
export const generationStatus = atom<string>('')

export function addApp(app: App) {
  apps.set([...apps.get(), app])
}

export function removeApp(id: string) {
  apps.set(apps.get().filter(app => app.id !== id))
}
