import { streamText, stepCountIs } from 'ai'
import { openrouter, MODELS } from '../lib/openrouter'
import type { AgentContext, StreamingGenerationResult } from './types'
import { generationTools } from './tools'
import {
  startStreaming,
  completeStreaming,
  setStreamingError
} from '../stores/streaming'

/**
 * Streaming-based orchestrator agent
 * Uses stopWhen for multi-step tool calling (AI SDK 5.0)
 */
export async function orchestratorAgent(
  context: AgentContext
): Promise<StreamingGenerationResult> {
  try {
    // Start streaming session
    startStreaming()

    let generatedAppId: string | null = null

    const systemPrompt = `Build a self-contained HTML app for: "${context.prompt}"

Use these tools in order:
1. create_app - Set name, icon (emoji), and description
2. launch_window - Use the appId returned from create_app
3. update_app_code - Provide complete HTML with embedded CSS/JS

The HTML must be self-contained, modern, and fully functional.`

    // Use streamText with stopWhen for multi-step execution
    const result = await streamText({
      model: openrouter.chat(MODELS.ORCHESTRATOR),
      prompt: systemPrompt,
      tools: generationTools,
      temperature: 0.3,
      toolChoice: 'required',
      // Stop after 10 steps maximum
      stopWhen: stepCountIs(10),
      onChunk: async (event) => {
        if (event.chunk.type === 'text-delta') {
          console.log('Text delta:', event.chunk.textDelta)
        }
      },
      onStepFinish: async (event) => {
        console.log('Step finished:', {
          stepType: event.stepType,
          text: event.text?.slice(0, 100),
          toolCallsCount: event.toolCalls?.length || 0,
          finishReason: event.finishReason
        })

        // Process tool call results
        if (event.toolCalls && event.toolCalls.length > 0) {
          for (const toolCall of event.toolCalls) {
            console.log(`Tool called: ${toolCall.toolName}`, toolCall.args)

            // Save appId when create_app tool is called
            if (toolCall.toolName === 'create_app') {
              const toolResult = event.toolResults?.find(
                r => r.toolCallId === toolCall.toolCallId
              )
              if (toolResult && typeof toolResult.result === 'object' && toolResult.result !== null) {
                const resultObj = toolResult.result as { appId?: string }
                if (resultObj.appId) {
                  generatedAppId = resultObj.appId
                  console.log('App ID captured:', generatedAppId)
                }
              }
            }
          }
        }
      },
      onFinish: async (event) => {
        console.log('Streaming finished:', {
          finishReason: event.finishReason,
          usage: event.usage,
          text: event.text?.slice(0, 200)
        })
      }
    })

    // Get final text
    const finalText = await result.text
    console.log('Final text length:', finalText.length)

    // Complete session
    completeStreaming()

    return {
      success: true,
      appId: generatedAppId ?? undefined
    }
  } catch (error) {
    console.error('Orchestrator error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    setStreamingError(errorMessage)

    return {
      success: false,
      error: {
        type: 'unknown',
        message: errorMessage
      }
    }
  }
}
