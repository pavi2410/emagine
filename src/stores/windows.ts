import { atom, map } from 'nanostores'

export interface WindowState {
  id: string
  appId: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  preMaximizeState?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export const windows = map<Record<string, WindowState>>({})
export const maxZIndex = atom<number>(1000)

export function openWindow(appId: string) {
  const id = crypto.randomUUID()
  const currentMaxZ = maxZIndex.get()

  windows.setKey(id, {
    id,
    appId,
    x: Math.random() * 200 + 100,
    y: Math.random() * 200 + 100,
    width: 500,
    height: 400,
    zIndex: currentMaxZ + 1,
    isMinimized: false,
    isMaximized: false,
  })

  maxZIndex.set(currentMaxZ + 1)
  return id
}

export function closeWindow(id: string) {
  const current = windows.get()
  const { [id]: _, ...rest } = current
  windows.set(rest)
}

export function updateWindowPosition(id: string, x: number, y: number) {
  const win = windows.get()[id]
  if (win) {
    windows.setKey(id, { ...win, x, y })
  }
}

export function updateWindowSize(id: string, width: number, height: number) {
  const win = windows.get()[id]
  if (win) {
    windows.setKey(id, { ...win, width, height })
  }
}

export function bringToFront(id: string) {
  const win = windows.get()[id]
  if (win) {
    const currentMaxZ = maxZIndex.get()
    windows.setKey(id, { ...win, zIndex: currentMaxZ + 1 })
    maxZIndex.set(currentMaxZ + 1)
  }
}

export function minimizeWindow(id: string) {
  const win = windows.get()[id]
  if (win) {
    windows.setKey(id, { ...win, isMinimized: true })
  }
}

export function unminimizeWindow(id: string) {
  const win = windows.get()[id]
  if (win) {
    const currentMaxZ = maxZIndex.get()
    windows.setKey(id, { ...win, isMinimized: false, zIndex: currentMaxZ + 1 })
    maxZIndex.set(currentMaxZ + 1)
  }
}

export function toggleMaximize(id: string) {
  const win = windows.get()[id]
  if (!win) return

  if (win.isMaximized) {
    // Restore to previous state
    if (win.preMaximizeState) {
      windows.setKey(id, {
        ...win,
        x: win.preMaximizeState.x,
        y: win.preMaximizeState.y,
        width: win.preMaximizeState.width,
        height: win.preMaximizeState.height,
        isMaximized: false,
        preMaximizeState: undefined,
      })
    } else {
      windows.setKey(id, { ...win, isMaximized: false })
    }
  } else {
    // Maximize - save current state and expand
    windows.setKey(id, {
      ...win,
      preMaximizeState: {
        x: win.x,
        y: win.y,
        width: win.width,
        height: win.height,
      },
      x: 0,
      y: 40, // Below top bar
      width: window.innerWidth,
      height: window.innerHeight - 40,
      isMaximized: true,
    })
  }
}
