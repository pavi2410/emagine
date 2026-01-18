import { getAvatarById, getAvatarStyle, getInitials } from '../OOBE/data/avatars'

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
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
}

export function UserAvatar({ avatarId, name, email, size = 'md', className = '' }: UserAvatarProps) {
  const pixelSize = sizeMap[size]
  const fontClass = fontSizeMap[size]
  const avatar = avatarId ? getAvatarById(avatarId) : null

  // If we have an avatar ID, use it
  if (avatar) {
    if (avatar.type === 'emoji') {
      return (
        <div
          className={`flex items-center justify-center rounded-full bg-slate-800 ${className}`}
          style={{
            width: pixelSize,
            height: pixelSize,
          }}
        >
          <span style={{ fontSize: pixelSize * 0.5 }}>{avatar.emoji}</span>
        </div>
      )
    }

    // Gradient avatar
    return (
      <div
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{
          width: pixelSize,
          height: pixelSize,
          ...getAvatarStyle(avatar),
        }}
      >
        {name && (
          <span className={`${fontClass} font-bold text-white`}>
            {getInitials(name)}
          </span>
        )}
      </div>
    )
  }

  // Fallback: show initials on default gradient
  const displayName = name || email?.split('@')[0] || '?'
  const initials = getInitials(displayName)

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        background: 'linear-gradient(135deg, #8B5CF6, #D946EF)',
      }}
    >
      <span className={`${fontClass} font-bold text-white`}>
        {initials}
      </span>
    </div>
  )
}
