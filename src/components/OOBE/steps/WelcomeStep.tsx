import { Flex, Text, Button } from '@radix-ui/themes'
import { motion } from 'motion/react'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="8"
      className="text-center px-8"
    >
      {/* Animated logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      >
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/30 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Logo circle */}
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #D946EF)',
            }}
          >
            <Text size="9" weight="bold" className="text-white">
              e
            </Text>
          </div>
        </div>
      </motion.div>

      {/* Welcome text */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Text size="8" weight="bold" className="text-white block mb-2">
          Welcome to emagine
        </Text>
        <Text size="3" className="text-slate-300 max-w-md">
          The AI-powered generative desktop where you can create any app you imagine
        </Text>
      </motion.div>

      {/* Get started button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button size="4" onClick={onNext}>
          Get Started
        </Button>
      </motion.div>
    </Flex>
  )
}
