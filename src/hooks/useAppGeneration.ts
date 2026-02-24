import { useQuery, useQueryClient } from '@tanstack/react-query'
import { appsQueryOptions, useGenerateApp, subscribeToAppUpdates } from '../queries/apps'
import { settingsQueryOptions } from '../queries/settings'
import {
  startGeneration,
  completeGeneration,
  failGeneration,
} from '../stores/generation'
import { useNavigate } from '@tanstack/react-router'

/**
 * Custom hook to manage app generation
 * Uses server-side generation API with TanStack Query
 */
export function useAppGeneration() {
  const queryClient = useQueryClient()
  const { data: apps = [] } = useQuery(appsQueryOptions)
  const { data: settings } = useQuery(settingsQueryOptions)
  const generateAppMutation = useGenerateApp()
  const navigate = useNavigate()

  const generateApp = async (prompt: string) => {
    try {
      startGeneration(prompt)

      const { appId } = await generateAppMutation.mutateAsync({
        prompt,
        model: settings?.selectedModel,
      })

      // Navigate to the new app
      navigate({ to: `/a/$appId`, params: { appId } })

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
