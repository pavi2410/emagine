import { useQuery } from '@tanstack/react-query'
import { appsQueryOptions } from '../../queries/apps'
import { openWindow } from '../../stores/windows'

export function MobileDesktop() {
  const { data: apps = [] } = useQuery(appsQueryOptions)

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-400 to-purple-500 overflow-hidden">
      {/* Status Bar */}
      <div className="px-4 py-2 text-white text-xs">
        <div className="flex justify-between items-center">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
      </div>

      {/* App Grid */}
      <div className="p-6 pt-12">
        <div className="grid grid-cols-4 gap-6">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => openWindow(app.id)}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/30">
                {app.icon}
              </div>
              <span className="text-white text-center text-xs font-medium leading-tight">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-4 border border-white/30 shadow-2xl">
          <div className="flex gap-4 justify-center">
            {/* Placeholder for dock apps */}
            <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl">
              💬
            </div>
            <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl">
              🎵
            </div>
            <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl">
              📷
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
