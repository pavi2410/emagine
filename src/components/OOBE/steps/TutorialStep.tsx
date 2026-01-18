import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../../ui/Button'

interface TutorialStepProps {
  onNext: () => void
  onBack: () => void
}

const TUTORIAL_SLIDES = [
  {
    title: 'Describe what you want',
    description: 'Type a description of any app you want to create in the prompt bar at the bottom',
    highlight: 'prompt-bar',
  },
  {
    title: 'AI generates your app',
    description: 'Our AI will create a fully functional app based on your description',
    highlight: 'generation',
  },
  {
    title: 'Use it instantly',
    description: 'Your app appears on your desktop. Click to open, drag to move, resize as needed',
    highlight: 'desktop',
  },
]

export function TutorialStep({ onNext, onBack }: TutorialStepProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [typedText, setTypedText] = useState('')
  const examplePrompt = 'Create a Pomodoro timer'

  // Typewriter effect for the first slide
  useEffect(() => {
    if (currentSlide === 0) {
      setTypedText('')
      let i = 0
      const interval = setInterval(() => {
        if (i < examplePrompt.length) {
          setTypedText(examplePrompt.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
        }
      }, 80)
      return () => clearInterval(interval)
    }
  }, [currentSlide])

  const nextSlide = () => {
    if (currentSlide < TUTORIAL_SLIDES.length - 1) {
      setCurrentSlide((s) => s + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1)
    }
  }

  const slide = TUTORIAL_SLIDES[currentSlide]

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
          How it works
        </h1>
      </motion.div>

      {/* Demo area */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="relative bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 aspect-video">
          <AnimatePresence mode="wait">
            {/* Slide 1: Prompt bar demo */}
            {currentSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Desktop preview */}
                <div className="flex-1 relative">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)',
                    }}
                  />
                </div>
                {/* Prompt bar */}
                <div className="p-4">
                  <motion.div
                    className="bg-slate-900/90 rounded-xl p-3 border-2 border-purple-500"
                    animate={{ boxShadow: ['0 0 0 0 rgba(139, 92, 246, 0)', '0 0 0 8px rgba(139, 92, 246, 0.3)', '0 0 0 0 rgba(139, 92, 246, 0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-white">
                      {typedText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Slide 2: Generation animation */}
            {currentSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  {/* Spinning loader */}
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-purple-500/30 border-t-purple-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="text-slate-300">Generating your app...</span>
                </div>
              </motion.div>
            )}

            {/* Slide 3: Desktop with app */}
            {currentSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0"
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)',
                  }}
                />
                {/* App icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute top-4 right-4"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-red-500/80 rounded-xl flex items-center justify-center text-xl">
                      ⏱️
                    </div>
                    <span className="text-xs text-white">
                      Pomodoro
                    </span>
                  </div>
                </motion.div>
                {/* Open window */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute left-4 top-4 bottom-12 right-20 bg-slate-900 rounded-lg border border-slate-600 overflow-hidden"
                >
                  <div className="h-6 bg-slate-800 flex items-center px-2 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-2xl text-white font-mono">
                      25:00
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide info */}
      <motion.div
        key={currentSlide}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-lg font-bold text-white mb-1">
          {slide.title}
        </h2>
        <p className="text-sm text-slate-300">
          {slide.description}
        </p>
      </motion.div>

      {/* Slide indicators */}
      <div className="flex gap-2 items-center">
        {TUTORIAL_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-4' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4"
      >
        <Button variant="soft" size="3" onClick={onBack}>
          Back
        </Button>
        {currentSlide < TUTORIAL_SLIDES.length - 1 ? (
          <Button size="3" onClick={nextSlide}>
            Next
          </Button>
        ) : (
          <Button size="3" onClick={onNext}>
            Continue
          </Button>
        )}
      </motion.div>
    </div>
  )
}
