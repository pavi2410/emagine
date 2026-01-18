export interface AgentContext {
  prompt: string
  history?: Message[]
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface PlanResult {
  feasible: boolean
  reason?: string
  components: ComponentPlan[]
  complexity: 'simple' | 'medium' | 'complex'
}

export interface ComponentPlan {
  name: string
  type: 'ui' | 'logic' | 'state'
  description: string
}

export interface GeneratedApp {
  html: string
  name: string
  icon: string
}

export type AgentError = {
  type: 'rate_limit' | 'invalid_request' | 'generation_failed' | 'unknown'
  message: string
}

/**
 * Callbacks for streaming generation
 */
export interface StreamingCallbacks {
  onThinkingDelta?: (delta: string) => void
  onProgressUpdate?: (progress: number, message: string) => void
  onHtmlChunk?: (chunk: string) => void
  onToolCall?: (toolName: string, args: any) => void
  onError?: (error: string) => void
  onComplete?: () => void
}

/**
 * Result of streaming generation
 */
export interface StreamingGenerationResult {
  success: boolean
  appId?: string
  error?: AgentError
}
