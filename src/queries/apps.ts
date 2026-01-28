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
  errorMessage?: string
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
            ? { ...app, name: data.name, icon: data.icon, status: data.status, errorMessage: data.errorMessage }
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

// Version types
export interface AppVersion {
  id: string
  version: number
  prompt?: string
  createdAt: string
  isCurrent: boolean
}

export interface VersionsResponse {
  versions: AppVersion[]
  currentVersion: number
}

// Regenerate app mutation
export function useRegenerateApp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      appId,
      prompt,
    }: {
      appId: string
      prompt?: string
    }): Promise<{ success: boolean; streamUrl: string }> => {
      const res = await fetch(`/api/apps/${appId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Regeneration failed' }))
        throw new Error(error.error || 'Regeneration failed')
      }
      return res.json()
    },
    onSuccess: (_, { appId }) => {
      // Update app status to generating
      queryClient.setQueryData<App[]>(['apps'], (old) =>
        old?.map((app) =>
          app.id === appId ? { ...app, status: 'generating' as const } : app
        )
      )
    },
  })
}

// Get app versions
export function appVersionsQueryOptions(appId: string) {
  return queryOptions({
    queryKey: ['app-versions', appId],
    queryFn: async (): Promise<VersionsResponse> => {
      const res = await fetch(`/api/apps/${appId}/versions`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch versions')
      return res.json()
    },
    enabled: !!appId,
  })
}

// Restore version mutation
export function useRestoreVersion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      appId,
      versionId,
    }: {
      appId: string
      versionId: string
    }): Promise<{ success: boolean; restoredVersion: number }> => {
      const res = await fetch(`/api/apps/${appId}/versions/${versionId}/restore`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Restore failed' }))
        throw new Error(error.error || 'Restore failed')
      }
      return res.json()
    },
    onSuccess: (_, { appId }) => {
      // Invalidate app and versions queries
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      queryClient.invalidateQueries({ queryKey: ['app-versions', appId] })
    },
  })
}
