import { Box, Flex, Text, Spinner } from '@radix-ui/themes'
import * as ContextMenu from '@radix-ui/react-context-menu'
import type { App } from '../../queries/apps'
import { openWindow } from '../../stores/windows'
import { useMoveToTrash } from '../../queries/trash'

interface DesktopIconProps {
  app: App
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const moveToTrash = useMoveToTrash()

  const handleDoubleClick = () => {
    openWindow(app.id)
  }

  const handleOpen = () => {
    openWindow(app.id)
  }

  const handleMoveToTrash = () => {
    moveToTrash.mutate(app.id)
  }

  const isGenerating = app.status === 'generating'
  const hasError = app.status === 'error'

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <Flex
          direction="column"
          align="center"
          gap="2"
          className={`w-24 cursor-pointer hover:bg-blue-500/25 rounded-lg p-2 transition-colors ${
            hasError ? 'opacity-50' : ''
          }`}
          onDoubleClick={handleDoubleClick}
        >
          <Box className="text-5xl relative drop-shadow-lg">
            {isGenerating ? (
              <Spinner size="3" />
            ) : (
              app.icon
            )}
          </Box>
          <Text size="2" className="text-white text-center line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {app.name}
          </Text>
          {hasError && (
            <Text size="1" color="red">
              Error
            </Text>
          )}
        </Flex>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] bg-slate-800/90 backdrop-blur-2xl backdrop-saturate-150 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_0_0_0.5px_rgba(255,255,255,0.1)] py-1 z-9999">
          <ContextMenu.Item
            className="px-3 py-1.5 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded mx-1 transition-colors"
            onSelect={handleOpen}
            disabled={isGenerating}
          >
            Open
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-px bg-white/10 my-1" />
          <ContextMenu.Item
            className="px-3 py-1.5 text-red-400 text-[13px] cursor-default outline-none data-highlighted:bg-red-500 data-highlighted:text-white rounded mx-1 transition-colors"
            onSelect={handleMoveToTrash}
            disabled={isGenerating}
          >
            Move to Trash
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
