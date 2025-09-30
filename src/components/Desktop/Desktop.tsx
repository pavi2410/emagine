import { Box } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { apps } from '../../stores/desktop'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from '../WindowManager/WindowManager'
import { PromptBar } from '../PromptBar/PromptBar'

export function Desktop() {
  const $apps = useStore(apps)

  return (
    <Box className="relative w-screen h-screen bg-slate-900 overflow-hidden">
      {/* Desktop Icons */}
      <Box className="absolute top-8 left-8 flex flex-col gap-6">
        {$apps.map(app => (
          <DesktopIcon key={app.id} app={app} />
        ))}
      </Box>

      {/* Windows Layer */}
      <WindowManager />

      {/* Prompt Bar at Bottom */}
      <PromptBar />
    </Box>
  )
}
