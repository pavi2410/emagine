import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '../../../ui/ScrollArea'
import { appsQueryOptions, type App } from '../../../../queries/apps'
import { useMoveToTrash } from '../../../../queries/trash'
import { openWindow } from '../../../../stores/windows'

function AppItem({ app }: { app: App }) {
  const moveToTrash = useMoveToTrash()

  const handleOpen = () => {
    openWindow(app.id)
  }

  const handleDelete = () => {
    moveToTrash.mutate(app.id)
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{app.icon}</span>
        <div className="flex flex-col gap-0">
          <span className="text-[13px] font-medium text-white/90">{app.name}</span>
          <span className="text-[11px] text-white/40">
            {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={handleOpen}
          disabled={app.status !== 'ready'}
          className="px-2 py-1 text-[11px] bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white/80 rounded transition-colors"
        >
          Open
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-[11px] bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export function AppsSection() {
  const { data: apps = [], isLoading } = useQuery(appsQueryOptions)

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[13px] font-semibold text-white/90">Apps</h2>
        <span className="text-[11px] text-white/40">
          {apps.length} {apps.length === 1 ? 'app' : 'apps'}
        </span>
      </div>

      {/* Apps List */}
      <div className="bg-white/5 rounded-lg flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-[12px] text-white/40">Loading...</span>
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <span className="text-4xl mb-3 opacity-40">📱</span>
            <span className="text-[13px] text-white/60 mb-1">No apps yet</span>
            <span className="text-[11px] text-white/40">
              Use the prompt bar to create your first app
            </span>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="divide-y divide-white/5">
              {apps.map((app) => (
                <AppItem key={app.id} app={app} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
