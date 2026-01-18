import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { simpleOrchestratorAgent } from '../agents/simple-orchestrator'
import { apps } from '../stores/desktop'
import { streaming, getCurrentHtml } from '../stores/streaming'
import {
  startGeneration,
  completeGeneration,
  failGeneration
} from '../stores/generation'

/**
 * Custom hook to manage app generation
 * Monitors streaming state and updates HTML in real-time
 */
export function useAppGeneration() {
  const [error, setError] = useState<string | null>(null)
  const $streaming = useStore(streaming)

  // Update app when HTML chunks are added
  useEffect(() => {
    if ($streaming.html.targetAppId && $streaming.html.chunks.length > 0) {
      const appId = $streaming.html.targetAppId
      const currentApps = apps.get()
      const appIndex = currentApps.findIndex(a => a.id === appId)

      if (appIndex !== -1) {
        // Update existing app's HTML
        const updatedApps = [...currentApps]
        updatedApps[appIndex] = {
          ...updatedApps[appIndex],
          html: getCurrentHtml()
        }
        apps.set(updatedApps)
      }
    }
  }, [$streaming.html.chunks.length, $streaming.html.targetAppId])

  const generateApp = async (prompt: string) => {
    try {
      setError(null)
      startGeneration(prompt)

      // Use simple orchestrator (non-streaming tools version)
      const result = await simpleOrchestratorAgent({ prompt })

      if (!result.success) {
        failGeneration(result.error?.message || 'Generation failed')
        setError(result.error?.message || 'Generation failed')
        return
      }

      completeGeneration()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      failGeneration(message)
      setError(message)
      console.error('App generation error:', error)
    }
  }

  return {
    generateApp,
    error,
    streaming: $streaming
  }
}
