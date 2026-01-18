import { IconSend } from '@tabler/icons-react'
import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { Input } from '../ui/Input'
import { IconButton } from '../ui/IconButton'
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
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
      <div className="flex flex-col gap-3 max-w-3xl mx-auto">
        <AIReasoning />

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center">
            <Input
              inputSize="3"
              placeholder="💭 What do you want to build?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={$generation.isGenerating}
              className="flex-1"
            />
            <IconButton
              type="submit"
              size="3"
              disabled={!prompt.trim() || $generation.isGenerating}
            >
              <IconSend size={18} />
            </IconButton>
          </div>
        </form>
      </div>
    </div>
  )
}
