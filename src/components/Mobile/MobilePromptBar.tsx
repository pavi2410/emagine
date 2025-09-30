import { Box, Flex, TextField, IconButton } from '@radix-ui/themes'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useStore } from '@nanostores/react'
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
      {/* Floating Action Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl z-40 active:scale-95 transition-transform"
        >
          ✨
        </button>
      )}

      {/* Expanded Prompt Sheet */}
      {isExpanded && (
        <Box className="fixed inset-x-0 bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40 rounded-t-3xl shadow-2xl p-6 safe-bottom">
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <Flex justify="between" align="center">
                <span className="text-2xl">✨</span>
                <IconButton
                  type="button"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                >
                  ✕
                </IconButton>
              </Flex>

              <TextField.Root
                size="3"
                placeholder="What do you want to build?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={$generation.isGenerating}
                className="w-full"
                autoFocus
              />

              {$generation.isGenerating && (
                <Box className="text-sm text-slate-500">
                  {$generation.currentStep}
                </Box>
              )}

              <IconButton
                type="submit"
                size="3"
                disabled={!prompt.trim() || $generation.isGenerating}
                className="w-full"
              >
                <PaperPlaneIcon width="18" height="18" />
              </IconButton>
            </Flex>
          </form>
        </Box>
      )}

      {/* Backdrop */}
      {isExpanded && (
        <Box
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}
