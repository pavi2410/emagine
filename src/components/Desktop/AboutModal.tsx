import { Dialog } from '@base-ui/react/dialog'
import { IconX } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'motion/react'

interface AboutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal keepMounted>
            <Dialog.Backdrop
              render={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              }
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            />
            <Dialog.Popup
              render={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              }
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[320px] bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="flex flex-col items-center p-8">
                {/* Logo */}
                <motion.div
                  className="text-6xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  ✨
                </motion.div>

                {/* App Name */}
                <Dialog.Title className="text-xl font-bold text-white mb-1">
                  emagine
                </Dialog.Title>

                {/* Version */}
                <p className="text-sm text-slate-400 mb-4">
                  Version 1.0
                </p>

                {/* Description */}
                <Dialog.Description className="text-sm text-slate-300 text-center mb-6">
                  AI-powered app generation platform. Describe what you want, and watch it come to life.
                </Dialog.Description>

                {/* Divider */}
                <div className="w-full h-px bg-slate-700/50 mb-4" />

                {/* Credits */}
                <div className="flex flex-col gap-1 items-center text-slate-400">
                  <span className="text-xs">Powered by OpenRouter</span>
                  <span className="text-xs">Built with React + TanStack</span>
                </div>
              </div>

              {/* Close button */}
              <Dialog.Close
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <IconX className="w-3 h-3 text-slate-400" />
              </Dialog.Close>
            </Dialog.Popup>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
