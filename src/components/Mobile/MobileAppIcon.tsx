import { useState, useRef, useCallback } from 'react'
import { ContextMenu } from '@base-ui/react/context-menu'
import type { App } from '../../queries/apps'
import { openWindow } from '../../stores/windows'
import { useMoveToTrash } from '../../queries/trash'
import { EditAppModal } from '../Desktop/EditAppModal'
import { RenameAppModal } from '../Desktop/RenameAppModal'

interface MobileAppIconProps {
  app: App
}

export function MobileAppIcon({ app }: MobileAppIconProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const moveToTrash = useMoveToTrash()

  const isGenerating = app.status === 'generating'

  const handleOpen = () => {
    openWindow(app.id)
  }

  const handleMoveToTrash = () => {
    moveToTrash.mutate(app.id)
  }

  const handleRename = () => {
    setRenameModalOpen(true)
  }

  const handleEditRegenerate = () => {
    setEditModalOpen(true)
  }

  // Long press handling for touch devices
  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true)
      // Trigger haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    }, 500)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    // If we were long pressing, don't open the app
    if (isLongPressing) {
      setIsLongPressing(false)
      return
    }
    // Otherwise, open the app
    if (!isGenerating) {
      handleOpen()
    }
  }, [isLongPressing, isGenerating])

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <>
      <ContextMenu.Root
        onOpenChange={(open) => {
          setMenuOpen(open)
          if (open && iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect()
            setIconPosition({ x: rect.left, y: rect.top })
          }
        }}
      >
        <ContextMenu.Trigger
          className={`flex flex-col items-center gap-1.5 active:scale-95 transition-transform touch-manipulation ${isGenerating ? 'opacity-50' : ''}`}
          onTouchStart={!isGenerating ? handleTouchStart : undefined}
          onTouchEnd={!isGenerating ? handleTouchEnd : undefined}
          onTouchMove={handleTouchMove}
        >
          <div
            ref={iconRef}
            className="w-[60px] h-[60px] bg-white/20 backdrop-blur-xl rounded-[14px] flex items-center justify-center text-[32px] shadow-lg border border-white/30"
          >
            {isGenerating ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              app.icon
            )}
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-1 max-w-[60px]">
            {app.name}
          </span>
        </ContextMenu.Trigger>

        <ContextMenu.Portal>
          <div className="contents">
            {/* Blur backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-9998 pointer-events-none" />
            {/* Elevated app icon above backdrop */}
            {menuOpen && (
              <div
                className="fixed z-9998 pointer-events-none flex flex-col items-center gap-1.5"
                style={{ left: iconPosition.x, top: iconPosition.y }}
              >
                <div className="w-[60px] h-[60px] bg-white/20 backdrop-blur-xl rounded-[14px] flex items-center justify-center text-[32px] shadow-lg border border-white/30">
                  {app.icon}
                </div>
                <span className="text-white text-[11px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-1 max-w-[60px]">
                  {app.name}
                </span>
              </div>
            )}
            <ContextMenu.Positioner
              className="z-9999"
              side="bottom"
              sideOffset={56}
              align="end"
            >
              <ContextMenu.Popup className="min-w-[200px] bg-[#2c2c2e]/95 backdrop-blur-3xl rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 border border-white/10 overflow-hidden">
              <ContextMenu.Item
                className="px-4 py-2.5 text-white text-[17px] cursor-default outline-none data-highlighted:bg-white/10 data-disabled:text-white/30"
                onClick={handleOpen}
                disabled={isGenerating}
              >
                Open
              </ContextMenu.Item>
              <div className="h-px bg-white/10 mx-4" />
              <ContextMenu.Item
                className="px-4 py-2.5 text-white text-[17px] cursor-default outline-none data-highlighted:bg-white/10 data-disabled:text-white/30"
                onClick={handleRename}
                disabled={isGenerating}
              >
                Rename
              </ContextMenu.Item>
              <ContextMenu.Item
                className="px-4 py-2.5 text-white text-[17px] cursor-default outline-none data-highlighted:bg-white/10 data-disabled:text-white/30"
                onClick={handleEditRegenerate}
                disabled={isGenerating}
              >
                Edit & Regenerate
              </ContextMenu.Item>
              <div className="h-px bg-white/10 mx-4" />
              <ContextMenu.Item
                className="px-4 py-2.5 text-red-500 text-[17px] cursor-default outline-none data-highlighted:bg-white/10 data-disabled:text-white/30"
                onClick={handleMoveToTrash}
                disabled={isGenerating}
              >
                Delete
              </ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
          </div>
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
