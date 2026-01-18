export interface Avatar {
  id: string
  type: 'gradient' | 'emoji'
  colors?: string[]
  emoji?: string
}

export const AVATARS: Avatar[] = [
  // Gradient avatars
  {
    id: 'gradient-1',
    type: 'gradient',
    colors: ['#8B5CF6', '#D946EF'],
  },
  {
    id: 'gradient-2',
    type: 'gradient',
    colors: ['#3B82F6', '#06B6D4'],
  },
  {
    id: 'gradient-3',
    type: 'gradient',
    colors: ['#F59E0B', '#EF4444'],
  },
  {
    id: 'gradient-4',
    type: 'gradient',
    colors: ['#10B981', '#3B82F6'],
  },
  {
    id: 'gradient-5',
    type: 'gradient',
    colors: ['#EC4899', '#8B5CF6'],
  },
  {
    id: 'gradient-6',
    type: 'gradient',
    colors: ['#6366F1', '#A855F7'],
  },
  // Emoji avatars
  {
    id: 'emoji-smile',
    type: 'emoji',
    emoji: '😊',
  },
  {
    id: 'emoji-rocket',
    type: 'emoji',
    emoji: '🚀',
  },
  {
    id: 'emoji-star',
    type: 'emoji',
    emoji: '⭐',
  },
  {
    id: 'emoji-fire',
    type: 'emoji',
    emoji: '🔥',
  },
  {
    id: 'emoji-sparkles',
    type: 'emoji',
    emoji: '✨',
  },
  {
    id: 'emoji-alien',
    type: 'emoji',
    emoji: '👾',
  },
]

export function getAvatarById(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) || AVATARS[0]
}

export function getAvatarStyle(avatar: Avatar): React.CSSProperties {
  if (avatar.type === 'gradient' && avatar.colors) {
    return {
      background: `linear-gradient(135deg, ${avatar.colors.join(', ')})`,
    }
  }
  return {
    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
