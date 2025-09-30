import { atom } from 'nanostores'

export interface GenerationState {
  isGenerating: boolean
  status: string
  progress: number
  currentStep: string
}

export const generation = atom<GenerationState>({
  isGenerating: false,
  status: '',
  progress: 0,
  currentStep: ''
})

export function startGeneration(prompt: string) {
  generation.set({
    isGenerating: true,
    status: `Generating app: ${prompt}`,
    progress: 0,
    currentStep: 'Planning...'
  })
}

export function updateGenerationProgress(progress: number, step: string) {
  const current = generation.get()
  generation.set({
    ...current,
    progress,
    currentStep: step
  })
}

export function completeGeneration() {
  generation.set({
    isGenerating: false,
    status: 'Complete',
    progress: 100,
    currentStep: 'Done'
  })
}

export function failGeneration(error: string) {
  generation.set({
    isGenerating: false,
    status: `Error: ${error}`,
    progress: 0,
    currentStep: 'Failed'
  })
}
