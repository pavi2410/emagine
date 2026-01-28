import { ContextMenu } from '@base-ui/react/context-menu'
import { useState } from 'react'
import { Spinner } from '../ui/Spinner'
import type { App } from '../../queries/apps'
import { openWindow } from '../../stores/windows'
import { useMoveToTrash } from '../../queries/trash'
import { EditAppModal } from './EditAppModal'
import { RenameAppModal } from './RenameAppModal'

interface DesktopIconProps {
  app: App
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const moveToTrash = useMoveToTrash()

  const handleOpen = () => {
    openWindow(app.id)
  }

  const handleMoveToTrash = () => {
    moveToTrash.mutate(app.id)
  }

  const handleEditRegenerate = () => {
    setEditModalOpen(true)
  }

  const handleRename = () => {
    setRenameModalOpen(true)
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
          onClick={handleOpen}
          onDoubleClick={handleOpen}
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
            <ContextMenu.Popup className="min-w-[180px] bg-[#2a2a2a]/80 backdrop-blur-3xl backdrop-saturate-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-1.5 z-9999 border border-white/15">
              <ContextMenu.Item
                className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 data-disabled:text-white/30 rounded-sm mx-1"
                onClick={handleOpen}
                disabled={isGenerating}
              >
                Open
              </ContextMenu.Item>
              <ContextMenu.Separator className="h-px bg-white/10 my-1 mx-2" />
              <ContextMenu.Item
                className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 data-disabled:text-white/30 rounded-sm mx-1"
                onClick={handleRename}
                disabled={isGenerating}
              >
                Rename...
              </ContextMenu.Item>
              <ContextMenu.Item
                className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 data-disabled:text-white/30 rounded-sm mx-1"
                onClick={handleEditRegenerate}
                disabled={isGenerating}
              >
                Edit & Regenerate...
              </ContextMenu.Item>
              <ContextMenu.Separator className="h-px bg-white/10 my-1 mx-2" />
              <ContextMenu.Item
                className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 data-highlighted:text-white data-disabled:text-white/30 rounded-sm mx-1"
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

      <RenameAppModal
        app={app}
        open={renameModalOpen}
        onOpenChange={setRenameModalOpen}
      />
    </>
  )
}
