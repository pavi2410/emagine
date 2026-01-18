import { useQuery } from '@tanstack/react-query'
import { ContextMenu } from '@base-ui/react/context-menu'
import { Button } from '../ui/Button'
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
      <ContextMenu.Trigger className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-default transition-colors w-full">
        <div className="text-3xl">{app.icon}</div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium text-white truncate">
            {app.name}
          </span>
          <span className="text-xs text-slate-500">
            Deleted {formatDeletedDate(app.deletedAt)}
          </span>
        </div>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup className="min-w-[160px] bg-slate-900/95 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700/50 py-1.5 z-[9999]">
            <ContextMenu.Item
              className="px-3 py-2 text-white text-sm cursor-pointer outline-none data-highlighted:bg-blue-500/30 rounded-md mx-1 transition-colors"
              onClick={() => restoreApp.mutate(app.id)}
            >
              Restore
            </ContextMenu.Item>
            <ContextMenu.Separator className="h-px bg-slate-700/50 my-1.5" />
            <ContextMenu.Item
              className="px-3 py-2 text-red-400 text-sm cursor-pointer outline-none data-highlighted:bg-red-500/20 rounded-md mx-1 transition-colors"
              onClick={() => permanentlyDeleteApp.mutate(app.id)}
            >
              Delete Permanently
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
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">
            Trash
          </h2>
          {!isEmpty && (
            <span className="text-sm text-slate-500">
              {trashedApps.length} {trashedApps.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        {!isEmpty && (
          <Button
            size="1"
            variant="soft"
            className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
            onClick={() => emptyTrash.mutate()}
            disabled={emptyTrash.isPending}
          >
            {emptyTrash.isPending ? 'Emptying...' : 'Empty Trash'}
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
          <span className="text-base">Loading...</span>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
          <div className="text-6xl mb-4 opacity-50">🗑️</div>
          <span className="text-lg mb-2 text-slate-400">Trash is empty</span>
          <span className="text-sm text-slate-600">
            Right-click apps to move them to trash
          </span>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2">
            {trashedApps.map((app) => (
              <TrashItem key={app.id} app={app} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
