import { IconChevronLeft } from '@tabler/icons-react'
import { motion } from 'motion/react'
import type { WindowState } from '../../stores/windows'
import type { App } from '../../queries/apps'
import { getAppUrl } from '../../queries/apps'
import { closeWindow } from '../../stores/windows'
import { SettingsApp } from '../BuiltinApps/SettingsApp'
import { TrashApp } from '../BuiltinApps/TrashApp'

interface MobileWindowProps {
  window: WindowState
  app: App
}

function renderAppContent(app: App) {
  if (app.id === '__builtin_settings') {
    return <SettingsApp />
  }
  if (app.id === '__builtin_trash') {
    return <TrashApp />
  }

  return (
    <iframe
      sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
      src={getAppUrl(app.id)}
      className="w-full h-full border-0"
      title={app.name}
    />
  )
}

export function MobileWindow({ window: win, app }: MobileWindowProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col"
    >
      {/* Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => closeWindow(win.id)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <IconChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">{app.icon}</span>
            <span className="text-base font-medium">
              {app.name}
            </span>
          </div>

          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderAppContent(app)}
      </div>
    </motion.div>
  )
}
