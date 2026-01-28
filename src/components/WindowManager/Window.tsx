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
      <div className={`h-full w-full flex flex-col bg-[#1e1e1e]/90 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56),0_0_0_0.5px_rgba(255,255,255,0.15)] overflow-hidden ${win.isMaximized ? 'rounded-none' : 'rounded-xl'}`}>
        {/* Title Bar with macOS traffic lights */}
        <div className="window-drag-handle cursor-move shrink-0 bg-white/5 backdrop-blur-xl border-b border-white/10" onDoubleClick={handleMaximize}>
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
              <span className="text-sm">{app.icon}</span>
              <span className="text-[13px] font-medium text-white/80">
                {app.name}
              </span>
            </div>

            {/* Spacer to center title */}
            <div className="w-14" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {renderAppContent(app)}
        </div>
      </div>
    </Rnd>
  )
}
