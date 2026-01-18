import { IconSend, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { Input } from '../ui/Input'
import { IconButton } from '../ui/IconButton'
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
        <div className="fixed inset-x-0 bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40 rounded-t-3xl shadow-2xl p-6 safe-bottom">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl">✨</span>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <IconX size={20} />
                </button>
              </div>

              <Input
                inputSize="3"
                placeholder="What do you want to build?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={$generation.isGenerating}
                className="w-full"
                autoFocus
              />

              {$generation.isGenerating && (
                <div className="text-sm text-slate-500">
                  {$generation.currentStep}
                </div>
              )}

              <IconButton
                type="submit"
                size="3"
                disabled={!prompt.trim() || $generation.isGenerating}
                className="w-full"
              >
                <IconSend size={18} />
              </IconButton>
            </div>
          </form>
        </div>
      )}

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}
