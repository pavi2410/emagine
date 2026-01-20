import { Rnd } from 'react-rnd'
import type { WindowState } from '../../stores/windows'
import type { App } from '../../queries/apps'
import {
  closeWindow,
  updateWindowPosition,
  updateWindowSize,
  bringToFront,
  minimizeWindow,
  toggleMaximize,
  detectSnapZone,
  setSnapPreview,
  snapWindow,
} from '../../stores/windows'
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

  const handleDrag = (_e: unknown, d: { x: number; y: number }) => {
    // Detect snap zone based on cursor position
    const zone = detectSnapZone(d.x, d.y)
    setSnapPreview(zone)
  }

  const handleDragStop = (_e: unknown, d: { x: number; y: number }) => {
    const zone = detectSnapZone(d.x, d.y)
    setSnapPreview(null)

    if (zone) {
      // Snap the window
      snapWindow(win.id, zone)
    } else if (!win.isMaximized) {
      // Normal position update
      updateWindowPosition(win.id, d.x, d.y)
    }
  }

  return (
    <Rnd
      position={{ x: win.x, y: win.y }}
      size={{ width: win.width, height: win.height }}
      minWidth={300}
      minHeight={200}
      style={{ zIndex: win.zIndex }}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        if (!win.isMaximized) {
          updateWindowSize(win.id, parseInt(ref.style.width), parseInt(ref.style.height))
          updateWindowPosition(win.id, position.x, position.y)
        }
      }}
      onMouseDown={() => bringToFront(win.id)}
      dragHandleClassName="window-drag-handle"
      disableDragging={win.isMaximized}
      enableResizing={!win.isMaximized && !win.snapZone}
    >
      <div className={`h-full w-full flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-[0_22px_70px_4px_rgba(0,0,0,0.56),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden ${win.isMaximized ? 'rounded-none' : 'rounded-[10px]'}`}>
        {/* Title Bar with macOS traffic lights */}
        <div className="window-drag-handle cursor-move shrink-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50" onDoubleClick={handleMaximize}>
          <div className="flex items-center px-4 py-1">
            {/* Traffic Lights */}
            <TrafficLights
              onClose={handleClose}
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              isMaximized={win.isMaximized}
            />

            {/* Title */}
            <div className="flex items-center gap-2 flex-1 justify-center">
              <span className="text-base">{app.icon}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {app.name}
              </span>
            </div>

            {/* Spacer to center title */}
            <div className="w-14" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 min-h-0">
          {renderAppContent(app)}
        </div>
      </div>
    </Rnd>
  )
}
