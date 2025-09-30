import { generateText } from 'ai'
import { openrouter, MODELS } from '../lib/openrouter'
import type { AgentContext, PlanResult } from './types'

const PLANNER_PROMPT = `You are a planning agent that determines if a user request can be fulfilled as a simple web app.

Analyze the user's request and respond with a JSON object:
{
  "feasible": boolean,
  "reason": "explanation if not feasible",
  "components": [
    {"name": "component name", "type": "ui|logic|state", "description": "what it does"}
  ],
  "complexity": "simple|medium|complex"
}

Consider feasible:
- UI components (buttons, forms, displays)
- Simple calculations (calculator, unit converter)
- Data visualization (charts, graphs)
- Simple games (tic-tac-toe, snake, etc.)
- Todo lists, notes apps
- Timers, clocks
- Simple utilities

Consider NOT feasible:
- Requires external APIs or backends
- Requires file system access
- Requires persistent database
- Security-sensitive operations
- Real-time multiplayer
- OS-level operations

User request: {{PROMPT}}`

export async function plannerAgent(context: AgentContext): Promise<PlanResult> {
  try {
    const { text } = await generateText({
      model: openrouter.chat(MODELS.PLANNER),
      prompt: PLANNER_PROMPT.replace('{{PROMPT}}', context.prompt),
      temperature: 0.3,
    })

    const plan = JSON.parse(text) as PlanResult
    return plan
  } catch (error) {
    console.error('Planner error:', error)
    return {
      feasible: false,
      reason: 'Failed to analyze request',
      components: [],
      complexity: 'simple'
    }
  }
}
