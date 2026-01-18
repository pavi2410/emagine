import { Box, Flex, Text, Grid } from '@radix-ui/themes'
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
    <Box className="p-6">
      <Text size="5" weight="bold" className="mb-6 block text-white">
        Appearance
      </Text>

      {/* Wallpaper Selection */}
      <Box className="bg-slate-800/50 rounded-xl p-5 mb-4">
        <Text size="3" weight="medium" className="mb-4 block text-slate-300">
          Wallpaper
        </Text>

        <Grid columns="3" gap="3">
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
        </Grid>

        <Text size="1" className="text-slate-500 mt-3 block">
          Current: {WALLPAPERS.find(w => w.id === settings?.wallpaper)?.name || 'Deep Purple'}
        </Text>
      </Box>

      {/* Theme */}
      <Box className="bg-slate-800/50 rounded-xl p-5">
        <Text size="3" weight="medium" className="mb-4 block text-slate-300">
          Theme
        </Text>

        <Flex justify="between" align="center" className="py-2">
          <Flex direction="column" gap="1">
            <Text size="2" className="text-white">Dark Mode</Text>
            <Text size="1" className="text-slate-500">
              Currently locked to dark theme
            </Text>
          </Flex>
          <Box className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
            Active
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
