import { Box, Flex, Button, Text } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { useMemo } from 'react'
import { apps } from '../../stores/workspace'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from '../WindowManager/WindowManager'
import { PromptBar } from '../PromptBar/PromptBar'
import { WorkspaceSelector } from '../Auth/WorkspaceSelector'
import { signOut, useSession } from '../../lib/auth-client'

export function Desktop() {
  const $apps = useStore(apps)
  const { data: session } = useSession()

  // Generate random wallpaper from static.photos
  const wallpaperUrl = useMemo(() => {
    return `https://static.photos/minimal/1200x630`
  }, [])

  const handleSignOut = async () => {
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
        <WorkspaceSelector />
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
        {$apps.map((app) => (
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
