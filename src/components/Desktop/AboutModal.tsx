import { Dialog } from '@base-ui/react/dialog'
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
              className="fixed inset-0 bg-black/40 z-9999"
            />
            <div className="fixed inset-0 z-10000 flex items-center justify-center pointer-events-none">
              <Dialog.Popup
                render={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                }
                className="pointer-events-auto w-[280px] bg-[#2a2a2c]/95 backdrop-blur-2xl rounded-xl shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] overflow-hidden"
              >
                {/* macOS-style close button */}
                <div className="absolute top-3 left-3">
                  <Dialog.Close
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors"
                    aria-label="Close"
                  />
                </div>

                <div className="flex flex-col items-center p-6 pt-8">
                  {/* Logo */}
                  <motion.div
                    className="text-5xl mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    ✨
                  </motion.div>

                  {/* App Name */}
                  <Dialog.Title className="text-[15px] font-semibold text-white/90 mb-0.5">
                    Emagine
                  </Dialog.Title>

                  {/* Version */}
                  <p className="text-[11px] text-white/50 mb-3">
                    Version 1.0
                  </p>

                  {/* Description */}
                  <Dialog.Description className="text-[12px] text-white/60 text-center mb-4 leading-relaxed">
                    AI-powered app generation platform.<br />
                    Describe what you want, and watch it come to life.
                  </Dialog.Description>

                  {/* Divider */}
                  <div className="w-full h-px bg-white/10 mb-3" />

                  {/* Credits */}
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-[10px] text-white/40">Powered by OpenRouter</span>
                    <span className="text-[10px] text-white/40">Built with React + TanStack</span>
                  </div>
                </div>
              </Dialog.Popup>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
