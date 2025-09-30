import { map } from 'nanostores'

export interface WindowState {
  id: string
  appId: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
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
    zIndex: currentMaxZ + 1
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

import { atom } from 'nanostores'
