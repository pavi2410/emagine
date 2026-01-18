/**
 * API client for server-side endpoints
 */

const API_BASE = ''

export interface Workspace {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

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

export const api = {
  // Workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    const res = await fetch(`${API_BASE}/api/workspaces`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch workspaces')
    return res.json()
  },

  async createWorkspace(name: string): Promise<Workspace> {
    const res = await fetch(`${API_BASE}/api/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    })
    if (!res.ok) throw new Error('Failed to create workspace')
    return res.json()
  },

  // Apps
  async getApps(workspaceId: string): Promise<App[]> {
    const res = await fetch(`${API_BASE}/api/workspaces/${workspaceId}/apps`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch apps')
    return res.json()
  },

  async getApp(appId: string): Promise<App> {
    const res = await fetch(`${API_BASE}/api/apps/${appId}`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch app')
    return res.json()
  },

  async generateApp(workspaceId: string, prompt: string, model?: string): Promise<{ appId: string; streamUrl: string }> {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workspaceId, prompt, model }),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Generation failed' }))
      throw new Error(error.error || 'Generation failed')
    }
    return res.json()
  },

  async deleteApp(appId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/apps/${appId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to delete app')
  },

  // Streaming
  subscribeToApp(appId: string, onUpdate: (data: AppStreamUpdate) => void, onError?: (error: Error) => void): () => void {
    const eventSource = new EventSource(`${API_BASE}/api/apps/${appId}/stream`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AppStreamUpdate
        onUpdate(data)

        // Close connection when done
        if (data.status === 'ready' || data.status === 'error' || data.error) {
          eventSource.close()
        }
      } catch (e) {
        console.error('Failed to parse SSE message:', e)
      }
    }

    eventSource.onerror = () => {
      onError?.(new Error('SSE connection failed'))
      eventSource.close()
    }

    return () => eventSource.close()
  },

  getAppUrl(appId: string): string {
    return `${API_BASE}/api/apps/${appId}/serve`
  },
}
