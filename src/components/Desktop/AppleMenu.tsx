import { useState } from 'react'
import { Menu } from '@base-ui/react/menu'
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
      <Menu.Root open={isOpen} onOpenChange={setIsOpen}>
        <Menu.Trigger className="px-3 py-0 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
          <span className="text-lg">✨</span>
          <span className="text-base font-medium text-white">emagine</span>
        </Menu.Trigger>

        <AnimatePresence>
          {isOpen && (
            <Menu.Portal keepMounted>
              <Menu.Positioner sideOffset={8} align="start">
                <Menu.Popup
                  render={
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                    />
                  }
                  className="min-w-[200px] bg-[#2a2a2a]/80 backdrop-blur-3xl backdrop-saturate-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-1.5 z-9999 border border-white/15"
                >
                  <Menu.Item
                    className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded-sm mx-1"
                    onClick={() => setShowAbout(true)}
                  >
                    About Emagine
                  </Menu.Item>

                  <Menu.Separator className="h-px bg-white/10 my-1.5 mx-2" />

                  <Menu.Item
                    className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded-sm mx-1"
                    onClick={onOpenSettings}
                  >
                    System Settings...
                  </Menu.Item>

                  <Menu.Separator className="h-px bg-white/10 my-1.5 mx-2" />

                  <Menu.Item
                    className="px-3 py-1 text-white/90 text-[13px] cursor-default outline-none data-highlighted:bg-blue-500 rounded-sm mx-1"
                    onClick={onSignOut}
                  >
                    Sign Out
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          )}
        </AnimatePresence>
      </Menu.Root>

      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
    </>
  )
}
