import { useState } from 'react'
import { useStore } from '@nanostores/react'
import {
  apps,
  generateApp as generateAppAction,
  currentWorkspaceId,
  error as workspaceError,
} from '../stores/workspace'
import {
  startGeneration,
  completeGeneration,
  failGeneration,
} from '../stores/generation'
import { openWindow } from '../stores/windows'

/**
 * Custom hook to manage app generation
 * Uses server-side generation API
 */
export function useAppGeneration() {
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const $apps = useStore(apps)
  const $workspaceError = useStore(workspaceError)
  const $currentWorkspaceId = useStore(currentWorkspaceId)

  const generateApp = async (prompt: string) => {
    if (!$currentWorkspaceId) {
      setError('No workspace selected')
      return
    }

    try {
      setError(null)
      setIsGenerating(true)
      startGeneration(prompt)

      // Use server-side generation
      const appId = await generateAppAction(prompt)

      if (!appId) {
        failGeneration($workspaceError || 'Generation failed')
        setError($workspaceError || 'Generation failed')
        return
      }

      // Open window for the new app
      openWindow(appId)

      completeGeneration()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      failGeneration(message)
      setError(message)
      console.error('App generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateApp,
    error,
    isGenerating,
    apps: $apps,
  }
}
