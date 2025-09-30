import { useState } from 'react'
import { orchestratorAgent } from '../agents/orchestrator'
import { addApp } from '../stores/desktop'
import { openWindow } from '../stores/windows'
import {
  startGeneration,
  updateGenerationProgress,
  completeGeneration,
  failGeneration
} from '../stores/generation'

export function useAppGeneration() {
  const [error, setError] = useState<string | null>(null)

  const generateApp = async (prompt: string) => {
    try {
      setError(null)
      startGeneration(prompt)

      updateGenerationProgress(20, 'Planning app structure...')

      const result = await orchestratorAgent({ prompt })

      if (!result.success) {
        failGeneration(result.error.message)
        setError(result.error.message)
        return
      }

      updateGenerationProgress(90, 'Finalizing...')

      // Add app to desktop
      const app = {
        id: crypto.randomUUID(),
        ...result.app,
        createdAt: Date.now()
      }

      addApp(app)

      // Open window for the new app
      openWindow(app.id)

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
    error
  }
}
