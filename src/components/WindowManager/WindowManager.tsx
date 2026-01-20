import { useStore } from '@nanostores/react'
import { useQuery } from '@tanstack/react-query'
import { windows } from '../../stores/windows'
import { appsQueryOptions } from '../../queries/apps'
import { Window } from './Window'
import { SnapPreview } from './SnapPreview'

// Built-in apps that don't come from the database
const BUILTIN_APPS = {
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

export function WindowManager() {
  const $windows = useStore(windows)
  const { data: apps = [] } = useQuery(appsQueryOptions)

  // Filter out minimized windows
  const visibleWindows = Object.values($windows).filter(win => !win.isMinimized)

  return (
    <>
      <SnapPreview />
      {visibleWindows.map(win => {
        // Check for built-in apps first
        const builtinApp = BUILTIN_APPS[win.appId as keyof typeof BUILTIN_APPS]
        const app = builtinApp || apps.find(a => a.id === win.appId)
        if (!app) return null

        return <Window key={win.id} window={win} app={app} />
      })}
    </>
  )
}
