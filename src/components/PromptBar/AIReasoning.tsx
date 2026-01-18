import { Box, Flex, Text, ScrollArea } from '@radix-ui/themes'
import { useStore } from '@nanostores/react'
import { useEffect, useRef } from 'react'
import { generation } from '../../stores/generation'
import { streaming } from '../../stores/streaming'

/**
 * Component to display AI reasoning stream
 * Shows thinking process in real-time
 */
export function AIReasoning() {
  const $generation = useStore(generation)
  const $streaming = useStore(streaming)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll when new chunks are added
  useEffect(() => {
    if (scrollRef.current && $streaming.thinking.isActive) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [$streaming.thinking.chunks.length])

  // Show only when thinking stream or legacy progress is active
  const shouldShow = $streaming.thinking.isActive ||
                     $streaming.thinking.chunks.length > 0 ||
                     ($generation.isGenerating && $generation.currentStep)

  if (!shouldShow) {
    return null
  }

  const thinkingText = $streaming.thinking.chunks.join('')
  const hasThinking = thinkingText.length > 0

  return (
    <Box className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-slate-700">
      <Flex direction="column" gap="2">
        <Flex align="center" gap="2">
          <span className="text-lg">
            {$streaming.thinking.isActive ? '🤔' : '💭'}
          </span>
          <Text size="2" weight="medium" className="text-slate-300">
            AI Reasoning
          </Text>
          {$streaming.thinking.isActive && (
            <Box className="ml-auto">
              <Box className="animate-pulse w-2 h-2 bg-purple-400 rounded-full" />
            </Box>
          )}
        </Flex>

        {/* Streaming thinking text */}
        {hasThinking && (
          <ScrollArea
            ref={scrollRef}
            type="auto"
            scrollbars="vertical"
            style={{ maxHeight: '200px' }}
          >
            <Text
              size="2"
              className="text-slate-400 leading-relaxed whitespace-pre-wrap font-mono"
            >
              {thinkingText}
              {$streaming.thinking.isActive && (
                <span className="inline-block w-1 h-4 bg-purple-400 animate-pulse ml-1" />
              )}
            </Text>
          </ScrollArea>
        )}

        {/* Fallback: legacy progress display */}
        {!hasThinking && $generation.currentStep && (
          <Text size="2" className="text-slate-400 leading-relaxed">
            {$generation.currentStep}
          </Text>
        )}

        {/* Progress info */}
        {$generation.isGenerating && (
          <Flex align="center" gap="2">
            <Text size="1" className="text-slate-500">
              Progress: {$generation.progress}%
            </Text>
          </Flex>
        )}

        {/* Streaming progress */}
        {$streaming.progress.current > 0 && (
          <Flex align="center" gap="2">
            <Text size="1" className="text-purple-400">
              {$streaming.progress.message} ({$streaming.progress.current}%)
            </Text>
          </Flex>
        )}

        {/* Current tool execution */}
        {$streaming.currentTool && (
          <Flex align="center" gap="2">
            <Text size="1" className="text-blue-400">
              🔧 {$streaming.currentTool.name}
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
