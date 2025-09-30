import { Box, Flex, TextField, IconButton } from '@radix-ui/themes'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
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
    <Box className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
      <Flex direction="column" gap="3" className="max-w-3xl mx-auto">
        <AIReasoning />

        <form onSubmit={handleSubmit}>
          <Flex gap="2" align="center">
            <TextField.Root
              size="3"
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
              <PaperPlaneIcon width="18" height="18" />
            </IconButton>
          </Flex>
        </form>
      </Flex>
    </Box>
  )
}
