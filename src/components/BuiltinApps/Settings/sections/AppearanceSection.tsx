import { useQuery } from '@tanstack/react-query'
import { settingsQueryOptions, useUpdateSettings } from '../../../../queries/settings'
import { WALLPAPERS, getWallpaperStyle } from '../../../OOBE/data/wallpapers'

export function AppearanceSection() {
  const { data: settings } = useQuery(settingsQueryOptions)
  const updateSettings = useUpdateSettings()

  const handleWallpaperChange = (wallpaperId: string) => {
    updateSettings.mutate({ wallpaper: wallpaperId })
  }

  return (
    <div className="p-5">
      <h2 className="text-[13px] font-semibold mb-4 text-white/90">
        Appearance
      </h2>

      {/* Wallpaper Selection */}
      <div className="bg-white/5 rounded-lg overflow-hidden mb-3">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
            Wallpaper
          </span>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {WALLPAPERS.map((wallpaper) => {
              const isSelected = settings?.wallpaper === wallpaper.id
              return (
                <button
                  key={wallpaper.id}
                  onClick={() => handleWallpaperChange(wallpaper.id)}
                  className={`aspect-video rounded-md overflow-hidden transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-500'
                      : 'hover:ring-1 hover:ring-white/30'
                  }`}
                >
                  <div
                    className="w-full h-full"
                    style={getWallpaperStyle(wallpaper.id)}
                  />
                </button>
              )
            })}
          </div>

          <span className="text-[11px] text-white/40 mt-2 block">
            Current: {WALLPAPERS.find(w => w.id === settings?.wallpaper)?.name || 'Deep Purple'}
          </span>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
            Theme
          </span>
        </div>

        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] text-white/90">Dark Mode</span>
            <span className="text-[11px] text-white/40">
              Currently locked to dark theme
            </span>
          </div>
          <span className="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
            Active
          </span>
        </div>
      </div>
    </div>
  )
}
