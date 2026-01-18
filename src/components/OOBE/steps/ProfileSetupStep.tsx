import { Flex, Text, TextField, Button, Box } from '@radix-ui/themes'
import { motion } from 'motion/react'
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
    <Flex
      direction="column"
      align="center"
      gap="6"
      className="px-8 w-full max-w-md"
    >
      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <Text size="7" weight="bold" className="text-white block mb-2">
          Set up your profile
        </Text>
        <Text size="2" className="text-slate-300">
          Choose how you want to appear
        </Text>
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
        <Text size="2" className="text-slate-400 mb-2 block">
          Your name
        </Text>
        <TextField.Root
          size="3"
          placeholder="Enter your name"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full"
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.2)',
          }}
        />
      </motion.div>

      {/* Avatar selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <Text size="2" className="text-slate-400 mb-3 block">
          Choose an avatar
        </Text>
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
    </Flex>
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
      <Flex
        align="center"
        justify="center"
        className="rounded-full bg-slate-700"
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.5 }}>{avatar.emoji}</span>
      </Flex>
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
    <Flex
      align="center"
      justify="center"
      className="rounded-full"
      style={{
        width: size,
        height: size,
        ...getAvatarStyle(avatar),
      }}
    >
      {name && (
        <Text
          weight="bold"
          className="text-white"
          style={{ fontSize: size * 0.35 }}
        >
          {initials}
        </Text>
      )}
    </Flex>
  )
}
