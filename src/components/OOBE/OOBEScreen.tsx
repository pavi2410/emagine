import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { motion, AnimatePresence } from 'motion/react'
import { useOOBE } from './hooks/useOOBE'
import { OOBEProgress } from './OOBEProgress'
import { WelcomeStep } from './steps/WelcomeStep'
import { ProfileSetupStep } from './steps/ProfileSetupStep'
import { PersonalizationStep } from './steps/PersonalizationStep'
import { TutorialStep } from './steps/TutorialStep'
import { ReadyStep } from './steps/ReadyStep'
import { getWallpaperStyle } from './data/wallpapers'
import { useUpdateSettings } from '../../queries/settings'

interface OOBEScreenProps {
  initialName?: string
  onComplete: () => void
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

export function OOBEScreen({ initialName = '', onComplete }: OOBEScreenProps) {
  const {
    currentStep,
    direction,
    data,
    totalSteps,
    goNext,
    goBack,
    updateData,
  } = useOOBE(initialName)

  const updateSettings = useUpdateSettings()
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await updateSettings.mutateAsync({
        hasCompletedOOBE: true,
        avatar: data.avatar,
        wallpaper: data.wallpaper,
        accentColor: data.accentColor,
      })
      // Small delay for visual feedback
      setTimeout(() => {
        onComplete()
      }, 300)
    } catch (error) {
      console.error('Failed to save OOBE settings:', error)
      setIsCompleting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={goNext} />
      case 1:
        return (
          <ProfileSetupStep
            data={data}
            onUpdate={updateData}
            onNext={goNext}
            onBack={goBack}
          />
        )
      case 2:
        return (
          <PersonalizationStep
            data={data}
            onUpdate={updateData}
            onNext={goNext}
            onBack={goBack}
          />
        )
      case 3:
        return <TutorialStep onNext={goNext} onBack={goBack} />
      case 4:
        return (
          <ReadyStep
            data={data}
            isLoading={isCompleting}
            onComplete={handleComplete}
            onBack={goBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated wallpaper background based on selection */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={getWallpaperStyle(data.wallpaper)}
        transition={{ duration: 0.5 }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <Flex
        direction="column"
        className="relative z-10 min-h-screen"
      >
        {/* Main content area */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="flex-1 overflow-hidden"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full flex justify-center"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Flex>

        {/* Progress indicator at bottom */}
        {currentStep > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-8"
          >
            <OOBEProgress currentStep={currentStep} totalSteps={totalSteps} />
          </motion.div>
        )}
      </Flex>
    </motion.div>
  )
}
