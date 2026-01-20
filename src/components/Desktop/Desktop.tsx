import { IconMaximize, IconMinimize } from '@tabler/icons-react'
import { useMemo, useState, useEffect } from 'react'
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
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={wallpaperStyle}
    >
      {/* Top Bar */}
      <div
        className="absolute top-0 left-0 right-0 bg-black/25 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 z-50 flex items-center justify-between"
        style={{ height: '28px' }}
      >
        <AppleMenu
          onSignOut={handleSignOut}
          onOpenSettings={() => openWindow('__builtin_settings')}
        />
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen()
            } else {
              document.documentElement.requestFullscreen()
            }
          }}
          className="px-3 py-0 rounded hover:bg-white/10 transition-colors flex items-center"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <IconMinimize className="text-white/90" size={14} />
          ) : (
            <IconMaximize className="text-white/90" size={14} />
          )}
        </button>
      </div>

      {/* Desktop Icons - Right Side, wrapping to columns */}
      <div
        className="absolute top-10 right-8 flex flex-col flex-wrap-reverse gap-4 items-end content-end"
        style={{ maxHeight: 'calc(100vh - 240px)' }}
      >
        {apps.map((app) => (
          <DesktopIcon key={app.id} app={app} />
        ))}
      </div>

      {/* Trash Icon - Bottom Right, fixed position (like macOS Dock) */}
      <div className="absolute bottom-28 right-8">
        <TrashIcon />
      </div>

      {/* Windows Layer */}
      <WindowManager />

      {/* Prompt Bar at Bottom */}
      <PromptBar />
    </div>
  )
}
