import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { App } from './apps'

export interface TrashedApp extends App {
  deletedAt: string
}

export const trashedAppsQueryOptions = queryOptions({
  queryKey: ['trash'],
  queryFn: async (): Promise<TrashedApp[]> => {
    const res = await fetch('/api/trash', {
      credentials: 'include',
    })
    if (!res.ok) {
      if (res.status === 401) return []
      throw new Error('Failed to fetch trashed apps')
    }
    return res.json()
  },
  staleTime: 1000 * 30, // 30 seconds
})

export function useMoveToTrash() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appId: string): Promise<void> => {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to move app to trash')
    },
    onSuccess: (_, appId) => {
      // Remove from apps list
      queryClient.setQueryData<App[]>(['apps'], (old) =>
        old ? old.filter((a) => a.id !== appId) : []
      )
      // Invalidate trash to refetch
      queryClient.invalidateQueries({ queryKey: ['trash'] })
    },
  })
}

export function useRestoreApp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appId: string): Promise<void> => {
      const res = await fetch(`/api/trash/${appId}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to restore app')
    },
    onSuccess: () => {
      // Invalidate both queries to refetch
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
    },
  })
}

export function usePermanentlyDeleteApp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appId: string): Promise<void> => {
      const res = await fetch(`/api/trash/${appId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to permanently delete app')
    },
    onSuccess: (_, appId) => {
      // Remove from trash list
      queryClient.setQueryData<TrashedApp[]>(['trash'], (old) =>
        old ? old.filter((a) => a.id !== appId) : []
      )
    },
  })
}

export function useEmptyTrash() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const res = await fetch('/api/trash', {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to empty trash')
    },
    onSuccess: () => {
      // Clear trash list
      queryClient.setQueryData<TrashedApp[]>(['trash'], [])
    },
  })
}
