import { useState, useCallback } from 'react'

export interface OOBEData {
  name: string
  avatar: string
  wallpaper: string
  accentColor: string
}

const TOTAL_STEPS = 5

export function useOOBE(initialName: string = '') {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const [data, setData] = useState<OOBEData>({
    name: initialName,
    avatar: 'gradient-1',
    wallpaper: 'gradient-purple',
    accentColor: 'purple',
  })

  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1)
      setCurrentStep((s) => s + 1)
    }
  }, [currentStep])

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((s) => s - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setDirection(step > currentStep ? 1 : -1)
      setCurrentStep(step)
    }
  }, [currentStep])

  const updateData = useCallback((updates: Partial<OOBEData>) => {
    setData((d) => ({ ...d, ...updates }))
  }, [])

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TOTAL_STEPS - 1

  return {
    currentStep,
    direction,
    data,
    totalSteps: TOTAL_STEPS,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    goToStep,
    updateData,
  }
}
