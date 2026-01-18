export interface Wallpaper {
  id: string
  name: string
  colors: string[]
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'gradient-purple',
    name: 'Deep Purple',
    colors: ['#1e1b4b', '#312e81', '#1e1b4b'],
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Blue',
    colors: ['#0c4a6e', '#0369a1', '#0ea5e9'],
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    colors: ['#7c2d12', '#c2410c', '#ea580c'],
  },
  {
    id: 'gradient-forest',
    name: 'Forest',
    colors: ['#14532d', '#166534', '#22c55e'],
  },
  {
    id: 'gradient-rose',
    name: 'Rose',
    colors: ['#4c0519', '#9f1239', '#e11d48'],
  },
  {
    id: 'gradient-midnight',
    name: 'Midnight',
    colors: ['#0f172a', '#1e293b', '#334155'],
  },
]

export function getWallpaperStyle(wallpaperId: string): React.CSSProperties {
  const wallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) || WALLPAPERS[0]
  return {
    background: `linear-gradient(135deg, ${wallpaper.colors.join(', ')})`,
  }
}

export function getWallpaperById(id: string): Wallpaper {
  return WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0]
}
