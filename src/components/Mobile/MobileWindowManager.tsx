import { useStore } from '@nanostores/react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence } from 'motion/react'
import { windows } from '../../stores/windows'
import { appsQueryOptions } from '../../queries/apps'
import { MobileWindow } from './MobileWindow'

export function MobileWindowManager() {
  const $windows = useStore(windows)
  const { data: apps = [] } = useQuery(appsQueryOptions)

  const windowList = Object.values($windows)
  // On mobile, only show the top window (last opened)
  const topWindow = windowList[windowList.length - 1]

  if (!topWindow) return null

  const app = apps.find(a => a.id === topWindow.appId)
  if (!app) return null

  return (
    <AnimatePresence>
      <MobileWindow key={topWindow.id} window={topWindow} app={app} />
    </AnimatePresence>
  )
}
