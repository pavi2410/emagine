import * as Dialog from '@radix-ui/react-dialog'
import { Text, Flex } from '@radix-ui/themes'
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
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[320px] bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Flex direction="column" align="center" className="p-8">
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
                  <Dialog.Title asChild>
                    <Text size="6" weight="bold" className="text-white mb-1">
                      emagine
                    </Text>
                  </Dialog.Title>

                  {/* Version */}
                  <Text size="2" className="text-slate-400 mb-4">
                    Version 1.0
                  </Text>

                  {/* Description */}
                  <Dialog.Description asChild>
                    <Text size="2" className="text-slate-300 text-center mb-6">
                      AI-powered app generation platform. Describe what you want, and watch it come to life.
                    </Text>
                  </Dialog.Description>

                  {/* Divider */}
                  <div className="w-full h-px bg-slate-700/50 mb-4" />

                  {/* Credits */}
                  <Flex direction="column" gap="1" align="center" className="text-slate-400">
                    <Text size="1">Powered by OpenRouter</Text>
                    <Text size="1">Built with React + TanStack</Text>
                  </Flex>
                </Flex>

                {/* Close button */}
                <Dialog.Close asChild>
                  <button
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="w-3 h-3 text-slate-400"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M2 2l6 6M8 2l-6 6" />
                    </svg>
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
