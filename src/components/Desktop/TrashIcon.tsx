import { useQuery } from '@tanstack/react-query'
import { trashedAppsQueryOptions } from '../../queries/trash'
import { openWindow } from '../../stores/windows'

export function TrashIcon() {
  const { data: trashedApps = [] } = useQuery(trashedAppsQueryOptions)
  const hasItems = trashedApps.length > 0

  const handleDoubleClick = () => {
    openWindow('__builtin_trash')
  }

  return (
    <div
      className="flex flex-col items-center gap-2 w-24 cursor-pointer hover:bg-blue-500/25 rounded-lg p-2 transition-colors"
      onDoubleClick={handleDoubleClick}
    >
      <div className="text-5xl relative drop-shadow-lg">
        {hasItems ? '🗑️' : '🗑️'}
        {hasItems && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-[10px] text-white font-bold">
              {trashedApps.length > 9 ? '9+' : trashedApps.length}
            </span>
          </div>
        )}
      </div>
      <span className="text-sm text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        Trash
      </span>
    </div>
  )
}
