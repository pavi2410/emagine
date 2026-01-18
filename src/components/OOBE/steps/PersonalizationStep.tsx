import { motion } from 'motion/react'
import { Button } from '../../ui/Button'
import { WALLPAPERS } from '../data/wallpapers'
import type { OOBEData } from '../hooks/useOOBE'

interface PersonalizationStepProps {
  data: OOBEData
  onUpdate: (updates: Partial<OOBEData>) => void
  onNext: () => void
  onBack: () => void
}

export function PersonalizationStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: PersonalizationStepProps) {
  return (
    <div
      className="flex flex-col items-center gap-6 px-8 w-full max-w-lg"
    >
      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          Make it yours
        </h1>
        <p className="text-sm text-slate-300">
          Choose a wallpaper for your desktop
        </p>
      </motion.div>

      {/* Wallpaper selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {WALLPAPERS.map((wallpaper, index) => (
            <motion.button
              key={wallpaper.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onUpdate({ wallpaper: wallpaper.id })}
              className={`relative aspect-video rounded-xl overflow-hidden transition-all ${
                data.wallpaper === wallpaper.id
                  ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900'
                  : 'ring-2 ring-white/20 hover:ring-white/40'
              }`}
            >
              {/* Wallpaper preview */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${wallpaper.colors.join(', ')})`,
                }}
              />

              {/* Wallpaper name */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                <span className="text-xs text-white">
                  {wallpaper.name}
                </span>
              </div>

              {/* Selected checkmark */}
              {data.wallpaper === wallpaper.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <span className="text-xs text-slate-400">
          You can change this anytime in Settings
        </span>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 mt-2"
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
