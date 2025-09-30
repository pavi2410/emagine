import { generateText } from 'ai'
import { openrouter, MODELS } from '../lib/openrouter'
import type { AgentContext, GeneratedApp, AgentError } from './types'
import { plannerAgent } from './planner'
import { uiGeneratorAgent } from './ui-generator'

export async function orchestratorAgent(
  context: AgentContext
): Promise<{ success: true; app: GeneratedApp } | { success: false; error: AgentError }> {
  try {
    // Step 1: Plan the app
    const planResult = await plannerAgent(context)

    if (!planResult.feasible) {
      return {
        success: false,
        error: {
          type: 'invalid_request',
          message: planResult.reason || 'Cannot generate this type of app'
        }
      }
    }

    // Step 2: Generate UI
    const uiResult = await uiGeneratorAgent({
      ...context,
      plan: planResult
    })

    if (!uiResult.success) {
      return {
        success: false,
        error: uiResult.error
      }
    }

    return {
      success: true,
      app: uiResult.app
    }
  } catch (error) {
    console.error('Orchestrator error:', error)
    return {
      success: false,
      error: {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}
