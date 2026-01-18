import { Box, Flex, Button, Text } from '@radix-ui/themes'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { appsQueryOptions } from '../../queries/apps'
import { settingsQueryOptions } from '../../queries/settings'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from '../WindowManager/WindowManager'
import { PromptBar } from '../PromptBar/PromptBar'
import { signOut, useSession } from '../../lib/auth-client'
import { resetUIState } from '../../stores/ui'
import { getWallpaperStyle } from '../OOBE/data/wallpapers'

export function Desktop() {
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const { data: session } = useSession()
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
        justify="between"
        align="center"
        className="absolute top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50"
        style={{ height: '40px' }}
      >
        <Text size="3" weight="medium" className="text-white px-3">emagine</Text>
        <Flex align="center" gap="3" className="px-3">
          {session?.user && (
            <Text size="2" className="text-slate-400">
              {session.user.email}
            </Text>
          )}
          <Button size="1" variant="soft" color="gray" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Flex>
      </Flex>

      {/* Desktop Icons - Right Side */}
      <Box className="absolute top-14 right-8 flex flex-col gap-6 items-end">
        {apps.map((app) => (
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
