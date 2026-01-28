import { IconSend } from '@tabler/icons-react'
import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { generation } from '../../stores/generation'
import { AIReasoning } from './AIReasoning'
import { useAppGeneration } from '../../hooks/useAppGeneration'

export function PromptBar() {
  const [prompt, setPrompt] = useState('')
  const $generation = useStore(generation)
  const { generateApp } = useAppGeneration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || $generation.isGenerating) return

    const userPrompt = prompt
    setPrompt('')
    await generateApp(userPrompt)
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="flex flex-col gap-3 max-w-2xl mx-auto">
        <AIReasoning />

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center bg-black/40 backdrop-blur-2xl backdrop-saturate-150 rounded-xl p-2 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <input
              type="text"
              placeholder="What do you want to build?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={$generation.isGenerating}
              className="flex-1 bg-transparent text-[14px] text-white/90 placeholder:text-white/40 px-3 py-2 outline-none"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || $generation.isGenerating}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-blue-500 transition-colors"
            >
              <IconSend size={16} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
