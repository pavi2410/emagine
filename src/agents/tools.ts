import { tool } from 'ai'
import { z } from 'zod'
import { addApp } from '../stores/desktop'
import { openWindow } from '../stores/windows'
import {
  addThinkingDelta,
  startThinking,
  endThinking,
  addProgressDelta,
  addHtmlChunk,
  setHtmlTarget,
  setCurrentTool,
  clearCurrentTool
} from '../stores/streaming'

/**
 * App creation tool - Creates app metadata and registers it in the store
 */
export const createAppTool = tool({
  description: 'Create a new app with metadata (name, icon, description)',
  parameters: z.object({
    name: z.string().describe('The name of the app (2-4 words)'),
    icon: z.string().describe('An emoji icon representing the app'),
    description: z.string().describe('Brief description of what the app does')
  }),
  execute: async ({ name, icon, description }) => {
    console.log('createAppTool executed', { name, icon, description })
    setCurrentTool('create_app', { name, icon, description })

    const appId = crypto.randomUUID()

    // Add app to store (initial HTML is empty)
    addApp({
      id: appId,
      name,
      icon,
      html: '', // Will be populated by update_app_code
      createdAt: Date.now()
    })

    clearCurrentTool()

    return {
      success: true,
      appId,
      message: `Created app "${name}" ${icon}`
    }
  }
})

/**
 * Window launch tool - Opens a window for the specified app
 */
export const launchWindowTool = tool({
  description: 'Launch a window for the specified app',
  parameters: z.object({
    appId: z.string().describe('The ID of the app to launch'),
    title: z.string().describe('The window title'),
    size: z.enum(['sm', 'md', 'lg']).optional().describe('Window size (default: md)')
  }),
  execute: async ({ appId, title, size = 'md' }) => {
    console.log('launchWindowTool executed', { appId, title, size })
    setCurrentTool('launch_window', { appId, title, size })

    const windowId = openWindow(appId)
    setHtmlTarget(appId)

    clearCurrentTool()

    return {
      success: true,
      windowId,
      message: `Launched window for "${title}"`
    }
  }
})

/**
 * App code update tool - Adds HTML code in chunks
 */
export const updateAppCodeTool = tool({
  description: 'Update app HTML code by streaming chunks',
  parameters: z.object({
    appId: z.string().describe('The ID of the app to update'),
    htmlChunk: z.string().describe('A chunk of HTML code to append')
  }),
  execute: async ({ appId, htmlChunk }) => {
    console.log('updateAppCodeTool executed', { appId, chunkLength: htmlChunk.length })
    setCurrentTool('update_app_code', { appId, htmlChunk })

    // Add HTML chunk to streaming store
    addHtmlChunk(htmlChunk, appId)

    clearCurrentTool()

    return {
      success: true,
      message: `Added ${htmlChunk.length} characters to app code`
    }
  }
})

/**
 * Thinking stream tool - Displays AI reasoning process in real-time
 */
export const thinkingStreamTool = tool({
  description: 'Stream AI reasoning/thinking process to the user',
  parameters: z.object({
    delta: z.string().describe('A chunk of thinking text to display')
  }),
  execute: async ({ delta }) => {
    console.log('thinkingStreamTool executed', { deltaLength: delta.length })
    addThinkingDelta(delta)

    return {
      success: true,
      message: 'Thinking delta streamed'
    }
  }
})

/**
 * Thinking start tool
 */
export const thinkingStartTool = tool({
  description: 'Signal the start of AI thinking/reasoning phase',
  parameters: z.object({}),
  execute: async (args) => {
    console.log('thinkingStartTool executed', args)
    startThinking()

    return {
      success: true,
      message: 'Started thinking phase'
    }
  }
})

/**
 * Thinking end tool
 */
export const thinkingEndTool = tool({
  description: 'Signal the end of AI thinking/reasoning phase',
  parameters: z.object({}),
  execute: async (args) => {
    console.log('thinkingEndTool executed', args)
    endThinking()

    return {
      success: true,
      message: 'Ended thinking phase'
    }
  }
})

/**
 * Progress update tool - Updates progress status in real-time
 */
export const progressUpdateTool = tool({
  description: 'Update generation progress with percentage and message',
  parameters: z.object({
    progress: z.number().min(0).max(100).describe('Progress percentage (0-100)'),
    message: z.string().describe('Progress message describing current step')
  }),
  execute: async ({ progress, message }) => {
    console.log('progressUpdateTool executed', { progress, message })
    setCurrentTool('progress_update', { progress, message })

    addProgressDelta(progress, message)

    clearCurrentTool()

    return {
      success: true,
      message: `Progress updated: ${progress}% - ${message}`
    }
  }
})

/**
 * Tool aggregation object
 * Used by Vercel AI SDK's streamText
 */
export const generationTools = {
  create_app: createAppTool,
  launch_window: launchWindowTool,
  update_app_code: updateAppCodeTool,
  thinking_stream: thinkingStreamTool,
  thinking_start: thinkingStartTool,
  thinking_end: thinkingEndTool,
  progress_update: progressUpdateTool
}
