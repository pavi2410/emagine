import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { motion, AnimatePresence } from 'motion/react'
import { generation } from '../../stores/generation'
import { useAppGeneration } from '../../hooks/useAppGeneration'

export function MobilePromptBar() {
  const [prompt, setPrompt] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const $generation = useStore(generation)
  const { generateApp } = useAppGeneration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || $generation.isGenerating) return

    const userPrompt = prompt
    setPrompt('')
    setIsExpanded(false)
    await generateApp(userPrompt)
  }

  return (
    <>
      {/* iOS-style Floating Action Button */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-28 right-5 w-14 h-14 bg-blue-500 rounded-full shadow-[0_4px_20px_rgba(0,122,255,0.4)] flex items-center justify-center text-white text-2xl z-40 active:scale-95 transition-transform"
          >
            ✨
          </motion.button>
        )}
      </AnimatePresence>

      {/* iOS-style Action Sheet */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsExpanded(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 safe-bottom"
            >
              {/* Drag Handle */}
              <div className="flex justify-center py-2">
                <div className="w-9 h-1 bg-white/40 rounded-full" />
              </div>

              <div className="bg-[#2c2c2e]/95 backdrop-blur-3xl rounded-t-[20px] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-[17px] text-blue-500 font-normal"
                  >
                    Cancel
                  </button>
                  <span className="text-[17px] font-semibold text-white">New App</span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || $generation.isGenerating}
                    className="text-[17px] text-blue-500 font-semibold disabled:text-white/30"
                  >
                    Create
                  </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4">
                  <div className="bg-white/10 rounded-xl overflow-hidden">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the app you want to build..."
                      disabled={$generation.isGenerating}
                      autoFocus
                      rows={4}
                      className="w-full bg-transparent text-[17px] text-white placeholder:text-white/40 px-4 py-3 resize-none outline-none"
                    />
                  </div>

                  {$generation.isGenerating && (
                    <div className="flex items-center gap-2 mt-3 px-1">
                      <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                      <span className="text-[13px] text-white/60">
                        {$generation.currentStep || 'Creating your app...'}
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
