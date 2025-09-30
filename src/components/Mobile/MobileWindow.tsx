import { Box, Flex, IconButton, Text } from '@radix-ui/themes'
import { Cross2Icon, ChevronLeftIcon } from '@radix-ui/react-icons'
import { motion, AnimatePresence } from 'motion/react'
import type { WindowState } from '../../stores/windows'
import type { App } from '../../stores/desktop'
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
      sandbox="allow-scripts allow-same-origin"
      srcDoc={app.html}
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
      <Box className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 safe-top">
        <Flex align="center" justify="between" className="px-4 py-3">
          <IconButton
            size="2"
            variant="ghost"
            onClick={() => closeWindow(win.id)}
          >
            <ChevronLeftIcon width="20" height="20" />
          </IconButton>

          <Flex align="center" gap="2">
            <span className="text-xl">{app.icon}</span>
            <Text size="3" weight="medium">
              {app.name}
            </Text>
          </Flex>

          <Box className="w-8" />
        </Flex>
      </Box>

      {/* Content */}
      <Box className="flex-1 overflow-hidden">
        {renderAppContent(app)}
      </Box>
    </motion.div>
  )
}
