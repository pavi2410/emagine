import { Box, Flex, Text } from '@radix-ui/themes'
import type { App } from '../../stores/desktop'
import { openWindow } from '../../stores/windows'

interface DesktopIconProps {
  app: App
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const handleDoubleClick = () => {
    openWindow(app.id)
  }

  return (
    <Flex
      direction="column"
      align="center"
      gap="2"
      className="w-24 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
      onDoubleClick={handleDoubleClick}
    >
      <Box className="text-5xl">{app.icon}</Box>
      <Text size="2" className="text-white text-center break-words">
        {app.name}
      </Text>
    </Flex>
  )
}
