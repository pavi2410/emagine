import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

export interface App {
  id: string
  name: string
  icon: string
  description?: string
  status: 'generating' | 'ready' | 'error'
  prompt?: string
  modelUsed?: string
  generationTimeMs?: number
  createdAt: string
  updatedAt: string
}

export interface AppStreamUpdate {
  id: string
  name: string
  icon: string
  status: 'generating' | 'ready' | 'error'
  errorMessage?: string
  generationTimeMs?: number
  error?: string
}

export const appsQueryOptions = queryOptions({
  queryKey: ['apps'],
  queryFn: async (): Promise<App[]> => {
    const res = await fetch('/api/apps', {
      credentials: 'include',
    })
    if (!res.ok) {
      if (res.status === 401) return []
      throw new Error('Failed to fetch apps')
    }
    return res.json()
  },
  staleTime: 1000 * 30, // 30 seconds
})

export function useGenerateApp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      prompt,
      model,
    }: {
      prompt: string
      model?: string
    }): Promise<{ appId: string; streamUrl: string }> => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt, model }),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Generation failed' }))
        throw new Error(error.error || 'Generation failed')
      }
      return res.json()
    },
    onSuccess: ({ appId }) => {
      // Add placeholder app to cache
      const placeholderApp: App = {
        id: appId,
        name: 'Generating...',
        icon: '🔄',
        status: 'generating',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData<App[]>(['apps'], (old) =>
        old ? [placeholderApp, ...old] : [placeholderApp]
      )
    },
  })
}

export function useDeleteApp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appId: string): Promise<void> => {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete app')
    },
    onSuccess: (_, appId) => {
      queryClient.setQueryData<App[]>(['apps'], (old) =>
        old ? old.filter((a) => a.id !== appId) : []
      )
    },
  })
}

export function subscribeToAppUpdates(
  appId: string,
  queryClient: ReturnType<typeof useQueryClient>,
  onComplete?: () => void
): () => void {
  const eventSource = new EventSource(`/api/apps/${appId}/stream`)

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as AppStreamUpdate

      // Update app in cache
      queryClient.setQueryData<App[]>(['apps'], (old) => {
        if (!old) return old
        return old.map((app) =>
          app.id === appId
            ? { ...app, name: data.name, icon: data.icon, status: data.status }
            : app
        )
      })

      // Close connection when done
      if (data.status === 'ready' || data.status === 'error' || data.error) {
        eventSource.close()
        onComplete?.()
      }
    } catch (e) {
      console.error('Failed to parse SSE message:', e)
    }
  }

  eventSource.onerror = () => {
    eventSource.close()
    onComplete?.()
  }

  return () => eventSource.close()
}

export function getAppUrl(appId: string): string {
  return `/api/apps/${appId}/serve`
}
