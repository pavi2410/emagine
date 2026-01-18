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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-white">
        Appearance
      </h2>

      {/* Wallpaper Selection */}
      <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
        <h3 className="text-base font-medium mb-4 text-slate-300">
          Wallpaper
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {WALLPAPERS.map((wallpaper) => {
            const isSelected = settings?.wallpaper === wallpaper.id
            return (
              <button
                key={wallpaper.id}
                onClick={() => handleWallpaperChange(wallpaper.id)}
                className={`aspect-video rounded-lg overflow-hidden transition-all ${
                  isSelected
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900'
                    : 'hover:ring-2 hover:ring-slate-500 hover:ring-offset-1 hover:ring-offset-slate-900'
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

        <span className="text-xs text-slate-500 mt-3 block">
          Current: {WALLPAPERS.find(w => w.id === settings?.wallpaper)?.name || 'Deep Purple'}
        </span>
      </div>

      {/* Theme */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-base font-medium mb-4 text-slate-300">
          Theme
        </h3>

        <div className="flex justify-between items-center py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-white">Dark Mode</span>
            <span className="text-xs text-slate-500">
              Currently locked to dark theme
            </span>
          </div>
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        </div>
      </div>
    </div>
  )
}
