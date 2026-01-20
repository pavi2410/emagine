import { ContextMenu } from '@base-ui/react/context-menu'
import { useState } from 'react'
import { Spinner } from '../ui/Spinner'
import type { App } from '../../queries/apps'
import { openWindow } from '../../stores/windows'
import { useMoveToTrash } from '../../queries/trash'
import { EditAppModal } from './EditAppModal'

interface DesktopIconProps {
  app: App
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
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

  const handleEditRegenerate = () => {
    setEditModalOpen(true)
  }

  const isGenerating = app.status === 'generating'
  const hasError = app.status === 'error'

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger
          className={`flex flex-col items-center gap-2 w-24 cursor-pointer hover:bg-blue-500/25 rounded-lg p-2 transition-colors ${
            hasError ? 'opacity-50' : ''
          }`}
          onDoubleClick={handleDoubleClick}
        >
          <div className="text-5xl relative drop-shadow-lg">
            {isGenerating ? (
              <Spinner size="3" />
            ) : (
              app.icon
            )}
          </div>
          <span className="text-sm text-white text-center line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {app.name}
          </span>
          {hasError && (
            <span className="text-xs text-red-500">
              Error
            </span>
          )}
        </ContextMenu.Trigger>

        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup className="min-w-[160px] bg-slate-800/90 backdrop-blur-2xl backdrop-saturate-150 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_0_0_0.5px_rgba(255,255,255,0.1)] py-1 z-9999">
              <ContextMenu.Item
                className="px-3 py-1.5 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded mx-1 transition-colors"
                onClick={handleOpen}
                disabled={isGenerating}
              >
                Open
              </ContextMenu.Item>
              <ContextMenu.Item
                className="px-3 py-1.5 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded mx-1 transition-colors"
                onClick={handleEditRegenerate}
                disabled={isGenerating}
              >
                Edit & Regenerate
              </ContextMenu.Item>
              <ContextMenu.Separator className="h-px bg-white/10 my-1" />
              <ContextMenu.Item
                className="px-3 py-1.5 text-red-400 text-[13px] cursor-default outline-none data-highlighted:bg-red-500 data-highlighted:text-white rounded mx-1 transition-colors"
                onClick={handleMoveToTrash}
                disabled={isGenerating}
              >
                Move to Trash
              </ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>

      <EditAppModal
        app={app}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  )
}
