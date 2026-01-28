import { useStore } from '@nanostores/react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence } from 'motion/react'
import { windows } from '../../stores/windows'
import { appsQueryOptions, type App } from '../../queries/apps'
import { MobileWindow } from './MobileWindow'

// Built-in apps that don't come from the database
const BUILTIN_APPS: Record<string, App> = {
  '__builtin_settings': {
    id: '__builtin_settings',
    name: 'Settings',
    icon: '⚙️',
    status: 'ready' as const,
    createdAt: '',
    updatedAt: '',
  },
  '__builtin_trash': {
    id: '__builtin_trash',
    name: 'Trash',
    icon: '🗑️',
    status: 'ready' as const,
    createdAt: '',
    updatedAt: '',
  },
}

export function MobileWindowManager() {
  const $windows = useStore(windows)
  const { data: apps = [] } = useQuery(appsQueryOptions)

  const windowList = Object.values($windows)
  // On mobile, only show the top window (last opened)
  const topWindow = windowList[windowList.length - 1]

  if (!topWindow) return null

  // Check for built-in apps first
  const builtinApp = BUILTIN_APPS[topWindow.appId]
  const app = builtinApp || apps.find(a => a.id === topWindow.appId)
  if (!app) return null

  return (
    <AnimatePresence>
      <MobileWindow key={topWindow.id} window={topWindow} app={app} />
    </AnimatePresence>
  )
}
