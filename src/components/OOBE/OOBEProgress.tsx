import { Flex } from '@radix-ui/themes'
import { motion } from 'motion/react'

interface OOBEProgressProps {
  currentStep: number
  totalSteps: number
}

export function OOBEProgress({ currentStep, totalSteps }: OOBEProgressProps) {
  return (
    <Flex gap="2" align="center" justify="center" className="py-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={`rounded-full ${
            index === currentStep
              ? 'bg-white'
              : index < currentStep
                ? 'bg-white/60'
                : 'bg-white/20'
          }`}
          initial={false}
          animate={{
            width: index === currentStep ? 24 : 8,
            height: 8,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      ))}
    </Flex>
  )
}
