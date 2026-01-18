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
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] bg-slate-900/95 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700/50 py-1.5 z-9999">
          <ContextMenu.Item
            className="px-3 py-2 text-white text-sm cursor-pointer outline-none hover:bg-blue-500/30 rounded-md mx-1 transition-colors"
            onSelect={handleOpen}
            disabled={isGenerating}
          >
            Open
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-px bg-slate-700/50 my-1.5" />
          <ContextMenu.Item
            className="px-3 py-2 text-red-400 text-sm cursor-pointer outline-none hover:bg-red-500/20 rounded-md mx-1 transition-colors"
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
