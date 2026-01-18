import { Box, Flex, Button, Text } from '@radix-ui/themes'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { appsQueryOptions } from '../../queries/apps'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from '../WindowManager/WindowManager'
import { PromptBar } from '../PromptBar/PromptBar'
import { signOut, useSession } from '../../lib/auth-client'
import { resetUIState } from '../../stores/ui'

export function Desktop() {
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const { data: session } = useSession()

  // Generate random wallpaper from static.photos
  const wallpaperUrl = useMemo(() => {
    return `https://static.photos/minimal/1200x630`
  }, [])

  const handleSignOut = async () => {
    resetUIState()
    await signOut()
    window.location.reload()
  }

  return (
    <Box
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
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
