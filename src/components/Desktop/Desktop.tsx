import { Box, Flex } from '@radix-ui/themes'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { appsQueryOptions } from '../../queries/apps'
import { settingsQueryOptions } from '../../queries/settings'
import { DesktopIcon } from './DesktopIcon'
import { TrashIcon } from './TrashIcon'
import { WindowManager } from '../WindowManager/WindowManager'
import { PromptBar } from '../PromptBar/PromptBar'
import { signOut } from '../../lib/auth-client'
import { resetUIState } from '../../stores/ui'
import { getWallpaperStyle } from '../OOBE/data/wallpapers'
import { AppleMenu } from './AppleMenu'
import { openWindow } from '../../stores/windows'

export function Desktop() {
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const { data: settings } = useQuery(settingsQueryOptions)

  // Get wallpaper style from user settings
  const wallpaperStyle = useMemo(() => {
    return getWallpaperStyle(settings?.wallpaper || 'gradient-purple')
  }, [settings?.wallpaper])

  const handleSignOut = async () => {
    resetUIState()
    // Clear remembered user on sign out
    localStorage.removeItem('emagine_remembered_email')
    localStorage.removeItem('emagine_remembered_name')
    await signOut()
    window.location.reload()
  }

  return (
    <Box
      className="relative w-screen h-screen overflow-hidden"
      style={wallpaperStyle}
    >
      {/* Top Bar */}
      <Flex
        align="center"
        className="absolute top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 z-50"
        style={{ height: '40px' }}
      >
        <AppleMenu
          onSignOut={handleSignOut}
          onOpenSettings={() => openWindow('__builtin_settings')}
        />
      </Flex>

      {/* Desktop Icons - Right Side */}
      <Box className="absolute top-14 right-8 flex flex-col gap-6 items-end">
        {apps.map((app) => (
          <DesktopIcon key={app.id} app={app} />
        ))}
      </Box>

      {/* Trash Icon - Bottom Right (like macOS) */}
      <Box className="absolute bottom-24 right-8">
        <TrashIcon />
      </Box>

      {/* Windows Layer */}
      <WindowManager />

      {/* Prompt Bar at Bottom */}
      <PromptBar />
    </Box>
  )
}
