import { motion } from 'motion/react'
import { Button } from '../../ui/Button'
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
    <div
      className="flex flex-col items-center justify-center gap-8 text-center px-8"
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
        <h1 className="text-3xl font-bold text-white mb-2">
          You're all set{data.name ? `, ${data.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-base text-slate-300 max-w-md">
          Your desktop is ready. Start creating amazing apps with just a description.
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 rounded-xl p-4 border border-white/10"
      >
        <div className="flex flex-col gap-2 items-start">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-400">
              Profile:
            </span>
            <span className="text-sm text-white">
              {data.name || 'Not set'}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-400">
              Wallpaper:
            </span>
            <div
              className="w-6 h-4 rounded"
              style={{
                background: `linear-gradient(135deg, var(--wallpaper-color))`,
              }}
            />
            <span className="text-sm text-white capitalize">
              {data.wallpaper.replace('gradient-', '')}
            </span>
          </div>
        </div>
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
        <Button size="3" onClick={onComplete} disabled={isLoading}>
          {isLoading ? 'Setting up...' : 'Start Creating'}
        </Button>
      </motion.div>
    </div>
  )
}
