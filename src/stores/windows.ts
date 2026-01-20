import { atom, map } from 'nanostores'

export type SnapZone = 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null

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
  snapZone?: SnapZone
  preMaximizeState?: {
    x: number
    y: number
    width: number
    height: number
  }
  preSnapState?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export const windows = map<Record<string, WindowState>>({})
export const maxZIndex = atom<number>(1000)
export const activeSnapPreview = atom<SnapZone>(null)

// Snap zone detection thresholds
const EDGE_THRESHOLD = 20 // pixels from edge to trigger snap
const TOP_BAR_HEIGHT = 28

export function detectSnapZone(x: number, y: number): SnapZone {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const nearLeft = x <= EDGE_THRESHOLD
  const nearRight = x >= screenWidth - EDGE_THRESHOLD
  const nearTop = y <= TOP_BAR_HEIGHT + EDGE_THRESHOLD
  const nearBottom = y >= screenHeight - EDGE_THRESHOLD

  // Corner snaps (quarter screen)
  if (nearLeft && nearTop) return 'top-left'
  if (nearRight && nearTop) return 'top-right'
  if (nearLeft && nearBottom) return 'bottom-left'
  if (nearRight && nearBottom) return 'bottom-right'

  // Edge snaps (half screen)
  if (nearLeft) return 'left'
  if (nearRight) return 'right'

  return null
}

export function getSnapDimensions(zone: SnapZone): { x: number; y: number; width: number; height: number } | null {
  if (!zone) return null

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const availableHeight = screenHeight - TOP_BAR_HEIGHT

  switch (zone) {
    case 'left':
      return { x: 0, y: TOP_BAR_HEIGHT, width: screenWidth / 2, height: availableHeight }
    case 'right':
      return { x: screenWidth / 2, y: TOP_BAR_HEIGHT, width: screenWidth / 2, height: availableHeight }
    case 'top-left':
      return { x: 0, y: TOP_BAR_HEIGHT, width: screenWidth / 2, height: availableHeight / 2 }
    case 'top-right':
      return { x: screenWidth / 2, y: TOP_BAR_HEIGHT, width: screenWidth / 2, height: availableHeight / 2 }
    case 'bottom-left':
      return { x: 0, y: TOP_BAR_HEIGHT + availableHeight / 2, width: screenWidth / 2, height: availableHeight / 2 }
    case 'bottom-right':
      return { x: screenWidth / 2, y: TOP_BAR_HEIGHT + availableHeight / 2, width: screenWidth / 2, height: availableHeight / 2 }
    default:
      return null
  }
}

export function setSnapPreview(zone: SnapZone) {
  activeSnapPreview.set(zone)
}

export function snapWindow(id: string, zone: SnapZone) {
  const win = windows.get()[id]
  if (!win || !zone) return

  const dims = getSnapDimensions(zone)
  if (!dims) return

  // Save current state for unsnapping
  const preSnapState = win.preSnapState || {
    x: win.x,
    y: win.y,
    width: win.width,
    height: win.height,
  }

  windows.setKey(id, {
    ...win,
    x: dims.x,
    y: dims.y,
    width: dims.width,
    height: dims.height,
    snapZone: zone,
    preSnapState,
    isMaximized: false,
  })
}

export function unsnapWindow(id: string) {
  const win = windows.get()[id]
  if (!win || !win.preSnapState) return

  windows.setKey(id, {
    ...win,
    x: win.preSnapState.x,
    y: win.preSnapState.y,
    width: win.preSnapState.width,
    height: win.preSnapState.height,
    snapZone: undefined,
    preSnapState: undefined,
  })
}

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
      y: 28, // Below top bar
      width: window.innerWidth,
      height: window.innerHeight - 28,
      isMaximized: true,
    })
  }
}
