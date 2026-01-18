import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

export interface UserSettings {
  selectedModel: string
  enableThinking: boolean
  theme: string
  hasCompletedOOBE: boolean
  wallpaper: string
  accentColor: string
  avatar: string
}

export const AVAILABLE_MODELS = {
  'mistralai/devstral-2512:free': {
    name: 'Devstral (Free)',
    provider: 'Mistral AI',
    description: 'Code-focused model optimized for development tasks',
    supportsTools: true
  },
  'xiaomi/mimo-v2-flash:free': {
    name: 'MiMo v2 Flash (Free)',
    provider: 'Xiaomi',
    description: 'Fast and efficient model from Xiaomi',
    supportsTools: true
  },
  'google/gemini-2.0-flash-exp:free': {
    name: 'Gemini 2.0 Flash (Free)',
    provider: 'Google',
    description: 'Fast and free model from Google',
    supportsTools: true
  }
} as const

export type ModelId = keyof typeof AVAILABLE_MODELS

const DEFAULT_SETTINGS: UserSettings = {
  selectedModel: 'mistralai/devstral-2512:free',
  enableThinking: false,
  theme: 'dark',
  hasCompletedOOBE: false,
  wallpaper: 'gradient-purple',
  accentColor: 'purple',
  avatar: 'gradient-1',
}

export const settingsQueryOptions = queryOptions({
  queryKey: ['settings'],
  queryFn: async (): Promise<UserSettings> => {
    const res = await fetch('/api/settings', { credentials: 'include' })
    if (!res.ok) {
      if (res.status === 401) return DEFAULT_SETTINGS
      throw new Error('Failed to fetch settings')
    }
    return res.json()
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
})

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<UserSettings>): Promise<UserSettings> => {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update settings')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data)
    },
  })
}
