import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Desktop } from './Desktop/Desktop'
import { MobileDesktop } from './Mobile/MobileDesktop'
import { MobileWindowManager } from './Mobile/MobileWindowManager'
import { MobilePromptBar } from './Mobile/MobilePromptBar'
import { SignInScreen } from './Auth/SignInScreen'
import { OOBEScreen } from './OOBE/OOBEScreen'
import { useSession } from '../lib/auth-client'
import { settingsQueryOptions } from '../queries/settings'
import { Spinner } from './ui/Spinner'

export function ResponsiveDesktop() {
  const [isMobile, setIsMobile] = useState(false)
  const { data: session, isPending: isSessionPending } = useSession()
  const { data: settings, isPending: isSettingsPending } = useQuery({
    ...settingsQueryOptions,
    enabled: !!session?.user,
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show loading while checking auth
  if (isSessionPending) {
    return (
      <div
        className="flex items-center justify-center flex-col gap-3 min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        }}
      >
        <Spinner size="3" />
        <span className="text-slate-400">Loading...</span>
      </div>
    )
  }

  // Show sign-in screen if not logged in (macOS-style)
  if (!session?.user) {
    return <SignInScreen onSuccess={() => window.location.reload()} />
  }

  // Show loading while fetching settings
  if (isSettingsPending) {
    return (
      <div
        className="flex items-center justify-center flex-col gap-3 min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        }}
      >
        <Spinner size="3" />
        <span className="text-slate-400">Setting up...</span>
      </div>
    )
  }

  // Show OOBE if user hasn't completed it
  if (!settings?.hasCompletedOOBE) {
    return (
      <OOBEScreen
        initialName={session.user.name || ''}
        onComplete={() => window.location.reload()}
      />
    )
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
