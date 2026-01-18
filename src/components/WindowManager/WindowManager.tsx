import { useStore } from '@nanostores/react'
import { useQuery } from '@tanstack/react-query'
import { windows } from '../../stores/windows'
import { appsQueryOptions } from '../../queries/apps'
import { Window } from './Window'

export function WindowManager() {
  const $windows = useStore(windows)
  const { data: apps = [] } = useQuery(appsQueryOptions)

  const windowList = Object.values($windows)

  return (
    <>
      {windowList.map(win => {
        const app = apps.find(a => a.id === win.appId)
        if (!app) return null

        return <Window key={win.id} window={win} app={app} />
      })}
    </>
  )
}
