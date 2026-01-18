import { useQuery, useQueryClient } from '@tanstack/react-query'
import { appsQueryOptions, useGenerateApp, subscribeToAppUpdates } from '../queries/apps'
import { settingsQueryOptions } from '../queries/settings'
import {
  startGeneration,
  completeGeneration,
  failGeneration,
} from '../stores/generation'
import { openWindow } from '../stores/windows'

/**
 * Custom hook to manage app generation
 * Uses server-side generation API with TanStack Query
 */
export function useAppGeneration() {
  const queryClient = useQueryClient()
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const { data: settings } = useQuery(settingsQueryOptions)
  const generateAppMutation = useGenerateApp()

  const generateApp = async (prompt: string) => {
    try {
      startGeneration(prompt)

      const { appId } = await generateAppMutation.mutateAsync({
        prompt,
        model: settings?.selectedModel,
      })

      // Open window for the new app
      openWindow(appId)

      // Subscribe to updates
      subscribeToAppUpdates(appId, queryClient, () => {
        completeGeneration()
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      failGeneration(message)
      console.error('App generation error:', err)
    }
  }

  return {
    generateApp,
    error: generateAppMutation.error?.message ?? null,
    isGenerating: generateAppMutation.isPending,
    apps,
  }
}
