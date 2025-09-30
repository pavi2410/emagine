import { Rnd } from 'react-rnd'
import { Box, Flex, IconButton, Text } from '@radix-ui/themes'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { WindowState } from '../../stores/windows'
import type { App } from '../../stores/desktop'
import { closeWindow, updateWindowPosition, updateWindowSize, bringToFront } from '../../stores/windows'

interface WindowProps {
  window: WindowState
  app: App
}

export function Window({ window: win, app }: WindowProps) {
  return (
    <Rnd
      position={{ x: win.x, y: win.y }}
      size={{ width: win.width, height: win.height }}
      minWidth={300}
      minHeight={200}
      style={{ zIndex: win.zIndex }}
      onDragStop={(e, d) => {
        updateWindowPosition(win.id, d.x, d.y)
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateWindowSize(win.id, parseInt(ref.style.width), parseInt(ref.style.height))
        updateWindowPosition(win.id, position.x, position.y)
      }}
      onMouseDown={() => bringToFront(win.id)}
      dragHandleClassName="window-drag-handle"
    >
      <Box className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
        {/* Title Bar */}
        <Flex
          justify="between"
          align="center"
          className="window-drag-handle px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-700 cursor-move"
        >
          <Flex align="center" gap="2">
            <span className="text-xl">{app.icon}</span>
            <Text size="2" weight="medium">
              {app.name}
            </Text>
          </Flex>
          <IconButton
            size="1"
            variant="ghost"
            onClick={() => closeWindow(win.id)}
            className="cursor-pointer"
          >
            <Cross2Icon />
          </IconButton>
        </Flex>

        {/* Content */}
        <Box className="flex-1 overflow-hidden bg-white dark:bg-slate-900">
          <iframe
            sandbox="allow-scripts allow-same-origin"
            srcDoc={app.html}
            className="w-full h-full border-0"
            title={app.name}
          />
        </Box>
      </Box>
    </Rnd>
  )
}
