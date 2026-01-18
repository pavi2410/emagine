import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Text } from '@radix-ui/themes'
import { motion, AnimatePresence } from 'motion/react'
import { AboutModal } from './AboutModal'

interface AppleMenuProps {
  onSignOut: () => void
  onOpenSettings: () => void
}

export function AppleMenu({ onSignOut, onOpenSettings }: AppleMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="px-3 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
            <span className="text-lg">✨</span>
            <Text size="3" weight="medium" className="text-white">
              emagine
            </Text>
          </button>
        </DropdownMenu.Trigger>

        <AnimatePresence>
          {isOpen && (
            <DropdownMenu.Portal forceMount>
              <DropdownMenu.Content asChild sideOffset={8} align="start">
                <motion.div
                  className="min-w-[200px] bg-slate-900/95 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700/50 py-1.5 z-[9999]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <DropdownMenu.Item
                    className="px-3 py-2 text-white text-sm cursor-pointer outline-none hover:bg-blue-500/30 rounded-md mx-1 transition-colors"
                    onSelect={() => setShowAbout(true)}
                  >
                    About emagine
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-slate-700/50 my-1.5" />

                  <DropdownMenu.Item
                    className="px-3 py-2 text-white text-sm cursor-pointer outline-none hover:bg-blue-500/30 rounded-md mx-1 transition-colors"
                    onSelect={onOpenSettings}
                  >
                    System Settings...
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-slate-700/50 my-1.5" />

                  <DropdownMenu.Item
                    className="px-3 py-2 text-white text-sm cursor-pointer outline-none hover:bg-blue-500/30 rounded-md mx-1 transition-colors"
                    onSelect={onSignOut}
                  >
                    Sign Out
                  </DropdownMenu.Item>
                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>

      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
    </>
  )
}
