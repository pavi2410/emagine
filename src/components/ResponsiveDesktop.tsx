import { useState, useEffect } from 'react'
import { Desktop } from './Desktop/Desktop'
import { MobileDesktop } from './Mobile/MobileDesktop'
import { MobileWindowManager } from './Mobile/MobileWindowManager'
import { MobilePromptBar } from './Mobile/MobilePromptBar'
import { AuthScreen } from './Auth/AuthScreen'
import { useSession } from '../lib/auth-client'
import { loadWorkspaces, loadApps, currentWorkspaceId } from '../stores/workspace'
import { useStore } from '@nanostores/react'
import { Flex, Spinner, Text } from '@radix-ui/themes'

export function ResponsiveDesktop() {
  const [isMobile, setIsMobile] = useState(false)
  const { data: session, isPending } = useSession()
  const $currentWorkspaceId = useStore(currentWorkspaceId)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load workspaces when authenticated
  useEffect(() => {
    if (session?.user) {
      loadWorkspaces()
    }
  }, [session?.user])

  // Load apps when workspace changes
  useEffect(() => {
    if ($currentWorkspaceId) {
      loadApps($currentWorkspaceId)
    }
  }, [$currentWorkspaceId])

  // Show loading while checking auth
  if (isPending) {
    return (
      <Flex
        align="center"
        justify="center"
        direction="column"
        gap="3"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        }}
      >
        <Spinner size="3" />
        <Text className="text-slate-400">Loading...</Text>
      </Flex>
    )
  }

  // Show auth screen if not logged in
  if (!session?.user) {
    return <AuthScreen onSuccess={() => window.location.reload()} />
  }

  if (isMobile) {
    return (
      <>
        <MobileDesktop />
        <MobileWindowManager />
        <MobilePromptBar />
      </>
    )
  }

  return <Desktop />
}
