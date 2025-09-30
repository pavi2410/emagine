import { Rnd } from 'react-rnd'
import { Box, Flex, IconButton, Text } from '@radix-ui/themes'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { WindowState } from '../../stores/windows'
import type { App } from '../../stores/desktop'
import { closeWindow, updateWindowPosition, updateWindowSize, bringToFront } from '../../stores/windows'
import { SettingsApp } from '../BuiltinApps/SettingsApp'
import { TrashApp } from '../BuiltinApps/TrashApp'

interface WindowProps {
  window: WindowState
  app: App
}

function renderAppContent(app: App) {
  // Render React components for built-in apps
  if (app.id === '__builtin_settings') {
    return <SettingsApp />
  }
  if (app.id === '__builtin_trash') {
    return <TrashApp />
  }

  // Render iframe for generated apps
  return (
    <iframe
      sandbox="allow-scripts allow-same-origin"
      srcDoc={app.html}
      className="w-full h-full border-0"
      title={app.name}
    />
  )
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
      <div className="h-full w-full flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-300/50 dark:border-slate-700/50 overflow-hidden">
        {/* Title Bar with macOS traffic lights */}
        <div className="window-drag-handle cursor-move shrink-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
          <Flex align="center" className="px-4 py-2.5">
            {/* Traffic Lights */}
            <Flex gap="2" className="mr-3">
              <button
                onClick={() => closeWindow(win.id)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                title="Close"
              />
              <button
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                title="Minimize"
              />
              <button
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                title="Maximize"
              />
            </Flex>

            {/* Title */}
            <Flex align="center" gap="2" className="flex-1 justify-center">
              <span className="text-base">{app.icon}</span>
              <Text size="2" weight="medium" className="text-slate-700 dark:text-slate-300">
                {app.name}
              </Text>
            </Flex>

            {/* Spacer to center title */}
            <div className="w-14" />
          </Flex>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 min-h-0">
          {renderAppContent(app)}
        </div>
      </div>
    </Rnd>
  )
}
