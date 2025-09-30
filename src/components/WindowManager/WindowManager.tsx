import { useStore } from '@nanostores/react'
import { windows } from '../../stores/windows'
import { apps } from '../../stores/desktop'
import { Window } from './Window'

export function WindowManager() {
  const $windows = useStore(windows)
  const $apps = useStore(apps)

  const windowList = Object.values($windows)

  return (
    <>
      {windowList.map(win => {
        const app = $apps.find(a => a.id === win.appId)
        if (!app) return null

        return <Window key={win.id} window={win} app={app} />
      })}
    </>
  )
}
