import { useQuery } from '@tanstack/react-query'
import { Button } from '../../../ui/Button'
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
    <div
      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{app.icon}</span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {app.name}
          </span>
          <span className="text-xs text-slate-500">
            Created {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="1"
          variant="soft"
          onClick={handleOpen}
          disabled={app.status !== 'ready'}
        >
          Open
        </Button>
        <Button
          size="1"
          variant="danger"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export function AppsSection() {
  const { data: apps = [], isLoading } = useQuery(appsQueryOptions)

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          Apps
        </h2>
        <span className="text-sm text-slate-500">
          {apps.length} {apps.length === 1 ? 'app' : 'apps'}
        </span>
      </div>

      {/* Apps List */}
      <div className="bg-slate-800/50 rounded-xl flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-slate-500">Loading...</span>
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <span className="text-5xl mb-4 opacity-50">📱</span>
            <span className="text-base text-slate-400 mb-2">No apps yet</span>
            <span className="text-sm text-slate-500">
              Use the prompt bar to create your first app
            </span>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-2">
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
