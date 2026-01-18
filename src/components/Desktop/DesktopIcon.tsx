import { Box, Flex, Text, Spinner } from '@radix-ui/themes'
import type { App } from '../../lib/api'
import { openWindow } from '../../stores/windows'

interface DesktopIconProps {
  app: App
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const handleDoubleClick = () => {
    openWindow(app.id)
  }

  const isGenerating = app.status === 'generating'
  const hasError = app.status === 'error'

  return (
    <Flex
      direction="column"
      align="center"
      gap="2"
      className={`w-24 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors ${
        hasError ? 'opacity-50' : ''
      }`}
      onDoubleClick={handleDoubleClick}
    >
      <Box className="text-5xl relative">
        {isGenerating ? (
          <Spinner size="3" />
        ) : (
          app.icon
        )}
      </Box>
      <Text size="2" className="text-white text-center break-words">
        {app.name}
      </Text>
      {hasError && (
        <Text size="1" color="red">
          Error
        </Text>
      )}
    </Flex>
  )
}
