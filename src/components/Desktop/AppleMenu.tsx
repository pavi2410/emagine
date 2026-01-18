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
          <button className="px-3 py-0 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
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
                  className="min-w-[200px] bg-slate-800/90 backdrop-blur-2xl backdrop-saturate-150 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_0_0_0.5px_rgba(255,255,255,0.1)] py-1 z-9999"
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                >
                  <DropdownMenu.Item
                    className="px-3 py-1.5 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded mx-1 transition-colors"
                    onSelect={() => setShowAbout(true)}
                  >
                    About emagine
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-white/10 my-1" />

                  <DropdownMenu.Item
                    className="px-3 py-1.5 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded mx-1 transition-colors"
                    onSelect={onOpenSettings}
                  >
                    System Settings...
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-white/10 my-1" />

                  <DropdownMenu.Item
                    className="px-3 py-1.5 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded mx-1 transition-colors"
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
