import { atom, computed } from 'nanostores'
import { api, type Workspace, type App } from '../lib/api'

// State atoms
export const workspaces = atom<Workspace[]>([])
export const currentWorkspaceId = atom<string | null>(null)
export const apps = atom<App[]>([])
export const isLoading = atom(false)
export const error = atom<string | null>(null)

// Computed
export const currentWorkspace = computed(
  [currentWorkspaceId, workspaces],
  (id, list) => list.find((w) => w.id === id) || null
)

// Actions
export async function loadWorkspaces(): Promise<void> {
  isLoading.set(true)
  error.set(null)

  try {
    const data = await api.getWorkspaces()
    workspaces.set(data)

    // Auto-select first workspace if none selected
    if (data.length > 0 && !currentWorkspaceId.get()) {
      currentWorkspaceId.set(data[0].id)
    }
  } catch (e) {
    error.set(e instanceof Error ? e.message : 'Failed to load workspaces')
  } finally {
    isLoading.set(false)
  }
}

export async function createWorkspace(name: string): Promise<Workspace | null> {
  error.set(null)

  try {
    const workspace = await api.createWorkspace(name)
    workspaces.set([...workspaces.get(), workspace])
    currentWorkspaceId.set(workspace.id)
    return workspace
  } catch (e) {
    error.set(e instanceof Error ? e.message : 'Failed to create workspace')
    return null
  }
}

export function selectWorkspace(workspaceId: string): void {
  currentWorkspaceId.set(workspaceId)
  // Clear apps when switching workspace
  apps.set([])
}

export async function loadApps(workspaceId: string): Promise<void> {
  isLoading.set(true)
  error.set(null)

  try {
    const data = await api.getApps(workspaceId)
    apps.set(data)
  } catch (e) {
    error.set(e instanceof Error ? e.message : 'Failed to load apps')
  } finally {
    isLoading.set(false)
  }
}

export async function generateApp(prompt: string): Promise<string | null> {
  const workspaceId = currentWorkspaceId.get()
  if (!workspaceId) {
    error.set('No workspace selected')
    return null
  }

  error.set(null)

  try {
    const { appId } = await api.generateApp(workspaceId, prompt)

    // Add placeholder app
    const placeholderApp: App = {
      id: appId,
      name: 'Generating...',
      icon: '🔄',
      status: 'generating',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    apps.set([placeholderApp, ...apps.get()])

    // Subscribe to updates
    api.subscribeToApp(appId, (update) => {
      const current = apps.get()
      const idx = current.findIndex((a) => a.id === appId)
      if (idx !== -1) {
        const updated = [...current]
        updated[idx] = {
          ...updated[idx],
          name: update.name,
          icon: update.icon,
          status: update.status,
        }
        apps.set(updated)
      }
    })

    return appId
  } catch (e) {
    error.set(e instanceof Error ? e.message : 'Failed to generate app')
    return null
  }
}

export async function deleteApp(appId: string): Promise<boolean> {
  error.set(null)

  try {
    await api.deleteApp(appId)
    apps.set(apps.get().filter((a) => a.id !== appId))
    return true
  } catch (e) {
    error.set(e instanceof Error ? e.message : 'Failed to delete app')
    return false
  }
}

// Helper to check if we have a valid workspace
export function hasWorkspace(): boolean {
  return currentWorkspaceId.get() !== null
}
