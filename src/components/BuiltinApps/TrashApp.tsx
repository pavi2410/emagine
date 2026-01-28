import { useQuery } from '@tanstack/react-query'
import { ContextMenu } from '@base-ui/react/context-menu'
import { ScrollArea } from '../ui/ScrollArea'
import { trashedAppsQueryOptions, useRestoreApp, usePermanentlyDeleteApp, useEmptyTrash, type TrashedApp } from '../../queries/trash'

function formatDeletedDate(deletedAt: string): string {
  const date = new Date(deletedAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function TrashItem({ app }: { app: TrashedApp }) {
  const restoreApp = useRestoreApp()
  const permanentlyDeleteApp = usePermanentlyDeleteApp()

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 cursor-default transition-colors w-full">
        <div className="text-xl">{app.icon}</div>
        <div className="flex flex-col flex-1 min-w-0 gap-0">
          <span className="text-[13px] font-medium text-white/90 truncate">
            {app.name}
          </span>
          <span className="text-[11px] text-white/40">
            Deleted {formatDeletedDate(app.deletedAt)}
          </span>
        </div>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup className="min-w-[180px] bg-[#2a2a2a]/80 backdrop-blur-3xl backdrop-saturate-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-1.5 z-9999 border border-white/15">
            <ContextMenu.Item
              className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded-sm mx-1"
              onClick={() => restoreApp.mutate(app.id)}
            >
              Put Back
            </ContextMenu.Item>
            <ContextMenu.Separator className="h-px bg-white/10 my-1 mx-2" />
            <ContextMenu.Item
              className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 data-highlighted:text-white rounded-sm mx-1"
              onClick={() => permanentlyDeleteApp.mutate(app.id)}
            >
              Delete Immediately
            </ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

export function TrashApp() {
  const { data: trashedApps = [], isLoading } = useQuery(trashedAppsQueryOptions)
  const emptyTrash = useEmptyTrash()

  const isEmpty = trashedApps.length === 0

  return (
    <div className="h-full flex flex-col bg-black/60 backdrop-blur-2xl">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-white/90">Trash</h2>
          {!isEmpty && (
            <span className="text-[11px] text-white/40">
              {trashedApps.length} {trashedApps.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        {!isEmpty && (
          <button
            className="px-2.5 py-1 text-[11px] bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors disabled:opacity-50"
            onClick={() => emptyTrash.mutate()}
            disabled={emptyTrash.isPending}
          >
            {emptyTrash.isPending ? 'Emptying...' : 'Empty Trash'}
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="text-[12px] text-white/40">Loading...</span>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-4xl mb-3 opacity-40">🗑️</div>
          <span className="text-[13px] text-white/60 mb-1">Trash is empty</span>
          <span className="text-[11px] text-white/40">
            Right-click apps to move them to trash
          </span>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="divide-y divide-white/5">
            {trashedApps.map((app) => (
              <TrashItem key={app.id} app={app} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
