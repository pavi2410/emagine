import { useStore } from '@nanostores/react'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '../ui/ScrollArea'
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
    <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 shadow-lg border border-slate-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {$streaming.thinking.isActive ? '🤔' : '💭'}
          </span>
          <span className="text-sm font-medium text-slate-300">
            AI Reasoning
          </span>
          {$streaming.thinking.isActive && (
            <div className="ml-auto">
              <div className="animate-pulse w-2 h-2 bg-purple-400 rounded-full" />
            </div>
          )}
        </div>

        {/* Streaming thinking text */}
        {hasThinking && (
          <ScrollArea
            ref={scrollRef}
            style={{ maxHeight: '200px' }}
          >
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap font-mono">
              {thinkingText}
              {$streaming.thinking.isActive && (
                <span className="inline-block w-1 h-4 bg-purple-400 animate-pulse ml-1" />
              )}
            </p>
          </ScrollArea>
        )}

        {/* Fallback: legacy progress display */}
        {!hasThinking && $generation.currentStep && (
          <p className="text-sm text-slate-400 leading-relaxed">
            {$generation.currentStep}
          </p>
        )}

        {/* Progress info */}
        {$generation.isGenerating && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Progress: {$generation.progress}%
            </span>
          </div>
        )}

        {/* Streaming progress */}
        {$streaming.progress.current > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-400">
              {$streaming.progress.message} ({$streaming.progress.current}%)
            </span>
          </div>
        )}

        {/* Current tool execution */}
        {$streaming.currentTool && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-400">
              🔧 {$streaming.currentTool.name}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
