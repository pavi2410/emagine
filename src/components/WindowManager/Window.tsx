import { Rnd } from 'react-rnd'
import { Flex, Text } from '@radix-ui/themes'
import type { WindowState } from '../../stores/windows'
import type { App } from '../../queries/apps'
import { closeWindow, updateWindowPosition, updateWindowSize, bringToFront, minimizeWindow, toggleMaximize } from '../../stores/windows'
import { SettingsApp } from '../BuiltinApps/SettingsApp'
import { TrashApp } from '../BuiltinApps/TrashApp'
import { ProgressiveContent } from './ProgressiveContent'
import { TrafficLights } from './TrafficLights'

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

  // Use ProgressiveContent for generated apps (supports streaming)
  return <ProgressiveContent appId={app.id} />
}

export function Window({ window: win, app }: WindowProps) {
  const handleClose = () => closeWindow(win.id)
  const handleMinimize = () => minimizeWindow(win.id)
  const handleMaximize = () => toggleMaximize(win.id)

  return (
    <Rnd
      position={{ x: win.x, y: win.y }}
      size={{ width: win.width, height: win.height }}
      minWidth={300}
      minHeight={200}
      style={{ zIndex: win.zIndex }}
      onDragStop={(e, d) => {
        if (!win.isMaximized) {
          updateWindowPosition(win.id, d.x, d.y)
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!win.isMaximized) {
          updateWindowSize(win.id, parseInt(ref.style.width), parseInt(ref.style.height))
          updateWindowPosition(win.id, position.x, position.y)
        }
      }}
      onMouseDown={() => bringToFront(win.id)}
      dragHandleClassName="window-drag-handle"
      disableDragging={win.isMaximized}
      enableResizing={!win.isMaximized}
    >
      <div className={`h-full w-full flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden ${win.isMaximized ? 'rounded-none' : 'rounded-xl'}`}>
        {/* Title Bar with macOS traffic lights */}
        <div className="window-drag-handle cursor-move shrink-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50" onDoubleClick={handleMaximize}>
          <Flex align="center" className="px-4 py-2.5">
            {/* Traffic Lights */}
            <TrafficLights
              onClose={handleClose}
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              isMaximized={win.isMaximized}
            />

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
