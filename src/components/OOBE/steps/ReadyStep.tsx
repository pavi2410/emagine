import { Flex, Text, Button } from '@radix-ui/themes'
import { motion } from 'motion/react'
import { UserAvatar } from '../../Auth/UserAvatar'
import type { OOBEData } from '../hooks/useOOBE'

interface ReadyStepProps {
  data: OOBEData
  isLoading: boolean
  onComplete: () => void
  onBack: () => void
}

export function ReadyStep({ data, isLoading, onComplete, onBack }: ReadyStepProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="8"
      className="text-center px-8"
    >
      {/* Celebration animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="relative"
      >
        {/* Confetti/sparkle effect */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i * Math.PI * 2) / 8) * 80,
              y: Math.sin((i * Math.PI * 2) / 8) * 80,
            }}
            transition={{
              duration: 1,
              delay: 0.3 + i * 0.05,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: -4,
              marginTop: -4,
            }}
          />
        ))}

        {/* User avatar */}
        <UserAvatar
          avatarId={data.avatar}
          name={data.name}
          size="xl"
          className="ring-4 ring-purple-500/50 shadow-2xl"
        />
      </motion.div>

      {/* Ready text */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Text size="8" weight="bold" className="text-white block mb-2">
          You're all set{data.name ? `, ${data.name.split(' ')[0]}` : ''}!
        </Text>
        <Text size="3" className="text-slate-300 max-w-md">
          Your desktop is ready. Start creating amazing apps with just a description.
        </Text>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 rounded-xl p-4 border border-white/10"
      >
        <Flex direction="column" gap="2" align="start">
          <Flex gap="2" align="center">
            <Text size="2" className="text-slate-400">
              Profile:
            </Text>
            <Text size="2" className="text-white">
              {data.name || 'Not set'}
            </Text>
          </Flex>
          <Flex gap="2" align="center">
            <Text size="2" className="text-slate-400">
              Wallpaper:
            </Text>
            <div
              className="w-6 h-4 rounded"
              style={{
                background: `linear-gradient(135deg, var(--wallpaper-color))`,
              }}
            />
            <Text size="2" className="text-white capitalize">
              {data.wallpaper.replace('gradient-', '')}
            </Text>
          </Flex>
        </Flex>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4"
      >
        <Button variant="soft" size="3" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button size="4" onClick={onComplete} disabled={isLoading}>
          {isLoading ? 'Setting up...' : 'Start Creating'}
        </Button>
      </motion.div>
    </Flex>
  )
}
