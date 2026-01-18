import { Flex, Text } from '@radix-ui/themes'
import { getAvatarById, getAvatarStyle, getInitials, type Avatar } from '../OOBE/data/avatars'

interface UserAvatarProps {
  avatarId?: string
  name?: string
  email?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 120,
}

const fontSizeMap = {
  sm: '4',
  md: '6',
  lg: '8',
  xl: '9',
} as const

export function UserAvatar({ avatarId, name, email, size = 'md', className = '' }: UserAvatarProps) {
  const pixelSize = sizeMap[size]
  const fontSize = fontSizeMap[size]
  const avatar = avatarId ? getAvatarById(avatarId) : null

  // If we have an avatar ID, use it
  if (avatar) {
    if (avatar.type === 'emoji') {
      return (
        <Flex
          align="center"
          justify="center"
          className={`rounded-full bg-slate-800 ${className}`}
          style={{
            width: pixelSize,
            height: pixelSize,
          }}
        >
          <span style={{ fontSize: pixelSize * 0.5 }}>{avatar.emoji}</span>
        </Flex>
      )
    }

    // Gradient avatar
    return (
      <Flex
        align="center"
        justify="center"
        className={`rounded-full ${className}`}
        style={{
          width: pixelSize,
          height: pixelSize,
          ...getAvatarStyle(avatar),
        }}
      >
        {name && (
          <Text size={fontSize} weight="bold" className="text-white">
            {getInitials(name)}
          </Text>
        )}
      </Flex>
    )
  }

  // Fallback: show initials on default gradient
  const displayName = name || email?.split('@')[0] || '?'
  const initials = getInitials(displayName)

  return (
    <Flex
      align="center"
      justify="center"
      className={`rounded-full ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        background: 'linear-gradient(135deg, #8B5CF6, #D946EF)',
      }}
    >
      <Text size={fontSize} weight="bold" className="text-white">
        {initials}
      </Text>
    </Flex>
  )
}
