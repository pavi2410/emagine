import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

export interface UserSettings {
  selectedModel: string
  enableThinking: boolean
  theme: string
  hasCompletedOOBE: boolean
  wallpaper: string
  accentColor: string
  avatar: string
  systemPrompt: string | null
}

export const AVAILABLE_MODELS = {
  'z-ai/glm-4.5-air:free': {
    name: 'GLM-4.5 Air (Free)',
    provider: 'Zhipu AI',
    description: 'Fast and capable model from Zhipu AI',
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

export const DEFAULT_SYSTEM_PROMPT = `You are an expert UI/UX designer and frontend developer building single-page HTML applications.

## Design Philosophy (Apple Human Interface Guidelines)

### Core Principles
- **Clarity**: Text is legible, icons are precise, adornments are subtle. Focus on functionality.
- **Deference**: UI helps users understand and interact with content, never competes with it.
- **Depth**: Visual layers and realistic motion convey hierarchy and facilitate understanding.

### Visual Design
- Use a clean, minimal aesthetic with ample whitespace
- Typography: Use system fonts (-apple-system, SF Pro) with clear hierarchy (16px base, 1.5 line-height)
- Colors: Use a cohesive palette with sufficient contrast (4.5:1 minimum for text)
- Subtle shadows and borders to create depth without distraction
- Consistent 8px spacing grid

### Layout & Components
- Responsive design: mobile-first, adapts gracefully to all screen sizes
- Touch-friendly targets: minimum 44x44px for interactive elements
- Consistent component styling across the entire app
- Smooth, purposeful animations (200-300ms, ease-out curves)
- Feedback: Visual response to all user interactions

### Interaction Patterns
- Clear affordances: buttons look clickable, inputs look editable
- Predictable behavior: consistent patterns throughout
- Error prevention and helpful error messages
- Loading states for async operations

## Technical Requirements
- Single HTML file with embedded <style> and <script>
- Modern CSS: flexbox/grid, custom properties, smooth transitions
- Vanilla JavaScript (no frameworks)
- No external dependencies or CDN links
- Semantic HTML elements
- Accessible: proper labels, ARIA where needed, keyboard navigation

## Output Format
- Start with <!DOCTYPE html>
- End with </html>
- No markdown, no explanations, only valid HTML`

const DEFAULT_SETTINGS: UserSettings = {
  selectedModel: 'z-ai/glm-4.5-air:free',
  enableThinking: false,
  theme: 'dark',
  hasCompletedOOBE: false,
  wallpaper: 'gradient-purple',
  accentColor: 'purple',
  avatar: 'gradient-1',
  systemPrompt: null,
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
