import { Box } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { useMemo } from 'react'
import { apps } from '../../stores/desktop'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from '../WindowManager/WindowManager'
import { PromptBar } from '../PromptBar/PromptBar'

export function Desktop() {
  const $apps = useStore(apps)

  // Generate random wallpaper from static.photos
  const wallpaperUrl = useMemo(() => {
    return `https://static.photos/minimal/1200x630`
  }, [])

  return (
    <Box
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
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
