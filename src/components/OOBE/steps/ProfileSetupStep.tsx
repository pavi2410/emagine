import { motion } from 'motion/react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { AVATARS, getAvatarStyle, type Avatar } from '../data/avatars'
import type { OOBEData } from '../hooks/useOOBE'

interface ProfileSetupStepProps {
  data: OOBEData
  onUpdate: (updates: Partial<OOBEData>) => void
  onNext: () => void
  onBack: () => void
}

export function ProfileSetupStep({ data, onUpdate, onNext, onBack }: ProfileSetupStepProps) {
  const selectedAvatar = AVATARS.find((a) => a.id === data.avatar) || AVATARS[0]

  return (
    <div
      className="flex flex-col items-center gap-6 px-8 w-full max-w-md"
    >
      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          Set up your profile
        </h1>
        <p className="text-sm text-slate-300">
          Choose how you want to appear
        </p>
      </motion.div>

      {/* Selected avatar preview */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="relative"
      >
        <AvatarDisplay avatar={selectedAvatar} name={data.name} size={96} />
      </motion.div>

      {/* Name input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <label className="text-sm text-slate-400 mb-2 block">
          Your name
        </label>
        <Input
          inputSize="3"
          placeholder="Enter your name"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full bg-white/10 border-white/20"
        />
      </motion.div>

      {/* Avatar selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <span className="text-sm text-slate-400 mb-3 block">
          Choose an avatar
        </span>
        <div className="grid grid-cols-6 gap-3">
          {AVATARS.map((avatar, index) => (
            <motion.button
              key={avatar.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.03 }}
              onClick={() => onUpdate({ avatar: avatar.id })}
              className={`relative rounded-full p-0.5 transition-all ${
                data.avatar === avatar.id
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
                  : 'hover:ring-2 hover:ring-white/50'
              }`}
            >
              <AvatarDisplay avatar={avatar} size={40} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 mt-4"
      >
        <Button variant="soft" size="3" onClick={onBack}>
          Back
        </Button>
        <Button size="3" onClick={onNext}>
          Continue
        </Button>
      </motion.div>
    </div>
  )
}

function AvatarDisplay({
  avatar,
  name,
  size,
}: {
  avatar: Avatar
  name?: string
  size: number
}) {
  if (avatar.type === 'emoji') {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-slate-700"
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.5 }}>{avatar.emoji}</span>
      </div>
    )
  }

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : ''

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        ...getAvatarStyle(avatar),
      }}
    >
      {name && (
        <span
          className="font-bold text-white"
          style={{ fontSize: size * 0.35 }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
