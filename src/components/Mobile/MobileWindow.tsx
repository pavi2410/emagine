import { IconChevronLeft } from '@tabler/icons-react'
import { motion } from 'motion/react'
import type { WindowState } from '../../stores/windows'
import type { App } from '../../queries/apps'
import { closeWindow } from '../../stores/windows'
import { SettingsApp } from '../BuiltinApps/SettingsApp'
import { TrashApp } from '../BuiltinApps/TrashApp'
import { ProgressiveContent } from '../WindowManager/ProgressiveContent'

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

  // Use ProgressiveContent for streaming support
  return <ProgressiveContent appId={app.id} />
}

export function MobileWindow({ window: win, app }: MobileWindowProps) {
  // Settings and Trash have their own navigation, so hide system nav bar
  const isBuiltinApp = app.id === '__builtin_settings' || app.id === '__builtin_trash'

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-[#1c1c1e] flex flex-col"
    >
      {/* iOS-style Navigation Bar - hidden for built-in apps that have their own nav */}
      {!isBuiltinApp && (
        <div className="bg-[#1c1c1e]/95 backdrop-blur-3xl border-b border-white/10 safe-top">
          <div className="flex items-center justify-between px-4 h-11">
            {/* Back Button */}
            <button
              onClick={() => closeWindow(win.id)}
              className="flex items-center gap-0.5 text-blue-500 active:opacity-60 transition-opacity -ml-2"
            >
              <IconChevronLeft size={28} strokeWidth={2.5} />
              <span className="text-[17px]">Back</span>
            </button>

            {/* Title */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="text-base">{app.icon}</span>
              <span className="text-[17px] font-semibold text-white">
                {app.name}
              </span>
            </div>

            {/* Placeholder for right action */}
            <div className="w-16" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-[#1c1c1e]">
        {renderAppContent(app)}
      </div>

      {/* iOS Home Indicator */}
      <div className="bg-[#1c1c1e] pb-2 pt-1 safe-bottom">
        <div className="w-[134px] h-[5px] bg-white/30 rounded-full mx-auto" />
      </div>
    </motion.div>
  )
}
