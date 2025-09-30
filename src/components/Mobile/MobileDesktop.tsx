import { Box, Flex, Text } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { apps } from '../../stores/desktop'
import { openWindow } from '../../stores/windows'

export function MobileDesktop() {
  const $apps = useStore(apps)

  return (
    <Box className="h-screen w-screen bg-gradient-to-b from-blue-400 to-purple-500 overflow-hidden">
      {/* Status Bar */}
      <Box className="px-4 py-2 text-white text-xs">
        <Flex justify="between" align="center">
          <span>9:41</span>
          <Flex gap="1" align="center">
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </Flex>
        </Flex>
      </Box>

      {/* App Grid */}
      <Box className="p-6 pt-12">
        <div className="grid grid-cols-4 gap-6">
          {$apps.map(app => (
            <button
              key={app.id}
              onClick={() => openWindow(app.id)}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <Box className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/30">
                {app.icon}
              </Box>
              <Text size="1" className="text-white text-center text-xs font-medium leading-tight">
                {app.name}
              </Text>
            </button>
          ))}
        </div>
      </Box>

      {/* Dock */}
      <Box className="absolute bottom-6 left-4 right-4">
        <Box className="bg-white/20 backdrop-blur-2xl rounded-3xl p-4 border border-white/30 shadow-2xl">
          <Flex gap="4" justify="center">
            {/* Placeholder for dock apps */}
            <Box className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl">
              💬
            </Box>
            <Box className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl">
              🎵
            </Box>
            <Box className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl">
              📷
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
