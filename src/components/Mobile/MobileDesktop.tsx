import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { appsQueryOptions } from '../../queries/apps'
import { settingsQueryOptions } from '../../queries/settings'
import { openWindow } from '../../stores/windows'
import { getWallpaperStyle } from '../OOBE/data/wallpapers'
import { MobileAppIcon } from './MobileAppIcon'

export function MobileDesktop() {
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const { data: settings } = useQuery(settingsQueryOptions)

  const wallpaperStyle = useMemo(() => {
    return getWallpaperStyle(settings?.wallpaper || 'gradient-purple')
  }, [settings?.wallpaper])

  // Get current time for iOS status bar
  const time = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).replace(' ', '')

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col"
      style={wallpaperStyle}
    >
      {/* iOS Status Bar */}
      <div className="px-6 pt-3 pb-1 flex justify-between items-center">
        <span className="text-[14px] font-semibold text-white drop-shadow-sm">{time}</span>
        <div className="flex gap-1 items-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C7.5 3 3.75 4.5 1 7l1.5 2c2.25-2 5.25-3.5 9.5-3.5s7.25 1.5 9.5 3.5L23 7c-2.75-2.5-6.5-4-11-4zm0 5c-3 0-5.5 1-7.5 2.5L6 12c1.5-1 3.5-2 6-2s4.5 1 6 2l1.5-1.5C17.5 9 15 8 12 8zm0 5c-1.5 0-3 .5-4 1.5L12 18l4-3.5c-1-.5-2.5-1-4-1z"/>
          </svg>
          <svg className="w-6 h-3 text-white" viewBox="0 0 28 14" fill="currentColor">
            <rect x="0" y="0" width="24" height="14" rx="3" stroke="currentColor" strokeWidth="1" fill="none"/>
            <rect x="2" y="2" width="18" height="10" rx="1.5" fill="currentColor"/>
            <rect x="25" y="4" width="2" height="6" rx="1" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* App Grid - scrollable */}
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-32">
        <div className="grid grid-cols-4 gap-y-6 gap-x-4">
          {/* Settings App */}
          <button
            onClick={() => openWindow('__builtin_settings')}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            <div className="w-[60px] h-[60px] bg-linear-to-b from-gray-400 to-gray-500 rounded-[14px] flex items-center justify-center text-[32px] shadow-lg">
              ⚙️
            </div>
            <span className="text-white text-[11px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Settings
            </span>
          </button>

          {/* User Apps */}
          {apps.map(app => (
            <MobileAppIcon key={app.id} app={app} />
          ))}
        </div>
      </div>

      {/* iOS Dock */}
      <div className="absolute bottom-4 left-3 right-3 safe-bottom">
        <div className="bg-white/20 backdrop-blur-3xl rounded-[26px] px-4 py-3 border border-white/20 shadow-2xl">
          <div className="flex gap-4 justify-center items-center">
            {/* Trash */}
            <button
              onClick={() => openWindow('__builtin_trash')}
              className="w-[54px] h-[54px] bg-white/25 backdrop-blur-xl rounded-[12px] flex items-center justify-center text-[28px] active:scale-95 transition-transform"
            >
              �️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
