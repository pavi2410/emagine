import { atom } from 'nanostores'

/**
 * Delta representing streaming generation progress
 */
export interface ProgressDelta {
  timestamp: number
  progress: number
  message: string
}

/**
 * Overall streaming state structure
 */
export interface StreamingState {
  // Thinking stream
  thinking: {
    chunks: string[]
    isActive: boolean
  }

  // Progress status
  progress: {
    current: number
    message: string
    deltas: ProgressDelta[]
  }

  // HTML stream
  html: {
    chunks: string[]
    targetAppId: string | null
  }

  // Currently executing tool
  currentTool: {
    name: string
    args: any
  } | null

  // Error state
  error: string | null
}

/**
 * Global store managing streaming state
 */
export const streaming = atom<StreamingState>({
  thinking: {
    chunks: [],
    isActive: false
  },
  progress: {
    current: 0,
    message: '',
    deltas: []
  },
  html: {
    chunks: [],
    targetAppId: null
  },
  currentTool: null,
  error: null
})

/**
 * Start a streaming session
 */
export function startStreaming() {
  streaming.set({
    thinking: {
      chunks: [],
      isActive: false
    },
    progress: {
      current: 0,
      message: '',
      deltas: []
    },
    html: {
      chunks: [],
      targetAppId: null
    },
    currentTool: null,
    error: null
  })
}

/**
 * Add a delta to the thinking stream
 */
export function addThinkingDelta(delta: string) {
  const current = streaming.get()
  streaming.set({
    ...current,
    thinking: {
      chunks: [...current.thinking.chunks, delta],
      isActive: true
    }
  })
}

/**
 * Start the thinking stream
 */
export function startThinking() {
  const current = streaming.get()
  streaming.set({
    ...current,
    thinking: {
      chunks: [],
      isActive: true
    }
  })
}

/**
 * End the thinking stream
 */
export function endThinking() {
  const current = streaming.get()
  streaming.set({
    ...current,
    thinking: {
      ...current.thinking,
      isActive: false
    }
  })
}

/**
 * Update progress status
 */
export function addProgressDelta(progress: number, message: string) {
  const current = streaming.get()
  const delta: ProgressDelta = {
    timestamp: Date.now(),
    progress,
    message
  }

  streaming.set({
    ...current,
    progress: {
      current: progress,
      message,
      deltas: [...current.progress.deltas, delta]
    }
  })
}

/**
 * Add an HTML chunk
 */
export function addHtmlChunk(chunk: string, appId?: string) {
  const current = streaming.get()
  streaming.set({
    ...current,
    html: {
      chunks: [...current.html.chunks, chunk],
      targetAppId: appId ?? current.html.targetAppId
    }
  })
}

/**
 * Set the target app for HTML streaming
 */
export function setHtmlTarget(appId: string) {
  const current = streaming.get()
  streaming.set({
    ...current,
    html: {
      chunks: [],
      targetAppId: appId
    }
  })
}

/**
 * Get current HTML content (all chunks joined)
 */
export function getCurrentHtml(): string {
  return streaming.get().html.chunks.join('')
}

/**
 * Set the currently executing tool
 */
export function setCurrentTool(name: string, args: any) {
  const current = streaming.get()
  streaming.set({
    ...current,
    currentTool: { name, args }
  })
}

/**
 * Clear the currently executing tool
 */
export function clearCurrentTool() {
  const current = streaming.get()
  streaming.set({
    ...current,
    currentTool: null
  })
}

/**
 * Set an error
 */
export function setStreamingError(error: string) {
  const current = streaming.get()
  streaming.set({
    ...current,
    error,
    thinking: {
      ...current.thinking,
      isActive: false
    }
  })
}

/**
 * Complete the streaming session
 */
export function completeStreaming() {
  const current = streaming.get()
  streaming.set({
    ...current,
    thinking: {
      ...current.thinking,
      isActive: false
    },
    currentTool: null
  })
}
